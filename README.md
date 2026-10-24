# Spotwise

Spotwise is a Next.js app with server-side API Route Handlers. The app stores community reports, saved places, visit plans, and venue chat messages in MongoDB Atlas. Chat refreshes from the database every four seconds; it does not require a persistent Socket.IO server.

## Local development

1. Run `npm install`.
2. Copy `.env.example` to `.env.local` and set `MONGODB_URI` to your MongoDB Atlas connection string.
3. Run `npm run dev` and open `http://localhost:3000`.

Next.js runs the UI and `/api/*` handlers in the same app. The MongoDB connection is opened by those handlers and reused between warm serverless invocations when the host allows it.

## API routes

- `GET /api/health` checks the database connection.
- `GET /api/venues/:venueId/reports` and `POST` to submit a report/comment.
- `GET /api/reports` lists recent reports.
- `GET /api/saved/:userId` and `PUT /api/saved/:venueId` to list or update saved places.
- `GET /api/plans/:userId`, `POST /api/plans`, and `DELETE /api/plans/:planId` manage visit plans.
- `GET` and `POST /api/venues/:venueId/chat` load and save venue messages.

Set `MONGODB_URI` in the hosting provider's environment-variable settings for production. On Netlify, connect the repository as a Next.js site and use `npm run build` as the build command; Netlify's Next.js adapter deploys the app's route handlers with the site. Guest identities are demo identities and are not authenticated accounts. Use real authentication before trusting user IDs.

Venue data is demo content. Community reports and chat messages are user-submitted and are not independently verified.
