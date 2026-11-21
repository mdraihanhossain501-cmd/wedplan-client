import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// One shared connection for the whole runtime (development and production).
const globalForMongo = globalThis as unknown as {
  wedplanMongoClient?: MongoClient;
};
const client =
  globalForMongo.wedplanMongoClient ??
    new MongoClient(process.env.MONGODB_URI as string, {
    maxPoolSize: 5,
    minPoolSize: 0,
    maxIdleTimeMS: 5000, // drop idle connections before the serverless function freezes
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
  });
globalForMongo.wedplanMongoClient = client;

const db = client.db(process.env.DB_NAME || "wedplan");

const PROTECTED_FIELDS = [
  "role",
  "isBlocked",
  "subscriptionPlan",
  "subscriptionExpiresAt",
];

export const auth = betterAuth({
  database: mongodbAdapter(db),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    modelName: "users",
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer" },
      businessName: { type: "string", required: false },
      isBlocked: { type: "boolean", required: false, defaultValue: false, input: false },
      subscriptionPlan: { type: "string", required: false, defaultValue: "free", input: false },
      subscriptionExpiresAt: { type: "date", required: false, input: false },
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Only "vendor" is accepted from sign-up. Everything else becomes "customer".
          const requested = (user as { role?: string }).role;
          const role = requested === "vendor" ? "vendor" : "customer";
          return { data: { ...user, role } };
        },
      },
      update: {
        before: async (data) => {
          // Profile updates can never touch role or subscription fields.
          if (PROTECTED_FIELDS.some((key) => key in data)) {
            throw new APIError("FORBIDDEN", {
              message: "You cannot change this field",
            });
          }
          return { data };
        },
      },
    },
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      // Server-side password rule, so it cannot be bypassed by calling the API directly.
      if (ctx.path === "/sign-up/email") {
        const password = String(ctx.body?.password ?? "");
        if (!/^(?=.*[a-z])(?=.*[A-Z]).{6,}$/.test(password)) {
          throw new APIError("BAD_REQUEST", {
            message:
              "Password needs at least 6 characters, one uppercase and one lowercase letter",
          });
        }
      }
    }),
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({ id: user.id, email: user.email }),
      },
    }),
  ],
});