import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// One shared connection for the whole runtime (development and production).
const globalForMongo = globalThis as unknown as {
  wedplanMongoClient?: MongoClient;
};
const client =
  globalForMongo.wedplanMongoClient ??
  new MongoClient(process.env.MONGODB_URI as string, { maxPoolSize: 5 });
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
  plugins: [
    jwt({
      jwt: {
        definePayload: ({ user }) => ({ id: user.id, email: user.email }),
      },
    }),
  ],
});