## Basic backend (MongoDB + Socket.IO)

The frontend remains a Next.js app. A small Express server handles saved places and community reports over REST, and venue chat over Socket.IO. Chat messages, saved places, and reports are stored in MongoDB. Guest names are demo identities and are not authenticated accounts.

### Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `MONGODB_URI` to a local MongoDB instance or your own MongoDB Atlas connection string. Keep `.env` private.
3. Start MongoDB.
4. Run `npm run dev` and open `http://localhost:3000`. This starts both Next.js and the Express/Socket.IO backend. Use `npm run dev:backend` by itself only when you want to run or debug the backend separately.

The backend accepts frontend requests from `FRONTEND_URL` (comma-separated origins), defaults to `http://localhost:3000`, and listens on `PORT` (default `4000`). Set `NEXT_PUBLIC_API_URL` to the backend URL if it differs.

### API and chat

- `GET /api/health`
- `GET /api/venues/:venueId/reports` and `POST` to submit a report/comment
- `GET /api/reports` for report history
- `GET /api/saved/:userId` and `PUT /api/saved/:venueId` to save/unsave a place
- `GET /api/venues/:venueId/chat` for recent messages
- Socket.IO events: `join-venue`, `send-message`, and `new-message`

The server accepts only venue IDs present in `src/data/venues.json`, validates report and message lengths, and stores chat messages before broadcasting them. A demo browser identity is stored locally to associate saved places; use real authentication before treating user identities as trusted.

The provided venue data is still demo content. The community backend does not turn chat messages into verified venue conditions.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
