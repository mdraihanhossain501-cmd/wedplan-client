# WedPlan

WedPlan is a wedding planning platform that connects couples with trusted wedding vendors across Bangladesh. Customers browse and book services, vendors publish and manage their services, and admins moderate the platform.

- **Live site:** https://wedplan-client-lime.vercel.app
- **Live API:** https://wedplan-server-eight.vercel.app
- **Client repository:** https://github.com/mdraihanhossain501-cmd/wedplan-client
- **Server repository:** https://github.com/mdraihanhossain501-cmd/wedplan-server

## Features

**Public**
- Animated home page with a hero banner, categories, featured services, "Why choose WedPlan?" and "How it works"
- Browse approved services with search, category filter, location filter, price sorting and pagination
- Service details page with image gallery (login required to open)
- Premium vendors are listed first and show a Premium Vendor badge

**Authentication**
- Email and password sign up and sign in, plus Google login (Better Auth)
- Customers and vendors can register; admin accounts are created only by a server script
- Role-based routing and protected dashboards; blocked users see an account blocked screen

**Customer dashboard**
- Booking requests with event date, location and message
- Booking status tracking (pending, accepted, rejected) and cancellation of pending requests
- Profile settings

**Vendor dashboard**
- Overview with live stats
- Add, edit, activate or deactivate and delete services, with image upload to ImgBB
- Free plan limit of 3 active services (enforced on the server)
- Accept or reject booking requests
- Premium subscription through Stripe Checkout (test mode), activated only by a verified Stripe webhook

**Admin dashboard**
- Platform overview with counts and charts
- Manage users (search, role filter, details, block and unblock)
- Approve, reject or delete services
- Read-only transaction history

## Tech stack

- Next.js 16 (App Router), React, TypeScript
- Tailwind CSS v4, shadcn/ui, lucide-react, Sonner
- Motion (Framer Motion) for animations
- Better Auth (email/password, Google, JWT plugin) with MongoDB
- Stripe Checkout (test mode), ImgBB image hosting
- Express and MongoDB API in the separate server repository

## Getting started

### Prerequisites
- Node.js 20 or newer
- A MongoDB Atlas database
- The WedPlan server running (see the server repository)

### Install and run

```bash
git clone https://github.com/mdraihanhossain501-cmd/wedplan-client.git
cd wedplan-client
npm install
cp .env.example .env.local
# fill in the values in .env.local
npm run dev
```

The app runs at http://localhost:3000.

### Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |
| `npm run seed` | Add demo vendors and approved services |

## Environment variables

Create `.env.local` with these names. Never commit real values.

| Name | Purpose |
|---|---|
| `BETTER_AUTH_SECRET` | Secret used by Better Auth |
| `BETTER_AUTH_URL` | Public URL of this client (must match the server's `AUTH_URL`) |
| `MONGODB_URI` | MongoDB connection string |
| `DB_NAME` | Database name |
| `NEXT_PUBLIC_API_URL` | URL of the Express API |
| `IMGBB_API_KEY` | ImgBB API key for image uploads |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_DEMO_CUSTOMER_PASSWORD` | Optional. Password of the demo customer account (shows the Demo Customer button) |
| `NEXT_PUBLIC_DEMO_VENDOR_PASSWORD` | Optional. Password of the demo vendor account (shows the Demo Vendor button) |

## Testing Stripe payments

Stripe runs in test mode. On the Subscription page, use card `4242 4242 4242 4242`, any future expiry date and any CVC.

## Deployment

Deployed on Vercel. After deploying, set `BETTER_AUTH_URL` to the live client URL, add the Google redirect URI `https://<your-live-url>/api/auth/callback/google`, and make sure the server's `CLIENT_URL` and `AUTH_URL` use the same address.