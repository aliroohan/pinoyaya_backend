# Pinoyaya Backend

Backend API for the Pinoyaya babysitting platform. Built with Node.js, Express, and MongoDB (Mongoose). Includes modular controllers/services, Stripe payments, S3 uploads, Twilio, and Socket.IO (for non-serverless hosting).

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- Stripe, AWS S3, Twilio, Firebase Admin
- Socket.IO (websockets; only for traditional hosting)
- Deployed on Vercel (Serverless Functions)

## Project Structure
```
pinoyaya_backend/
  src/
    app.js                # Traditional server (for VM/host usage with websockets)
    createApp.js          # Express factory used by serverless entry
    config/mongoose.js    # Mongo connection
    controllers/          # Route handlers
    middleware/           # Auth middlewares
    models/               # Mongoose schemas
    routes/               # Express routers (mounted at root in serverless)
    services/             # Business logic & integrations
    socket/socketHandler.js  # Socket.IO events (not used on Vercel)
  api/
    index.js              # Vercel Serverless Function entry (exports Express app)
  vercel.json             # Vercel routing/build config
  package.json
```

## Prerequisites
- Node.js 18+
- MongoDB database
- Accounts/credentials as needed: Stripe, AWS (S3), Twilio, Firebase Admin

## Environment Variables
Create a `.env` file in the project root for local development. Example:

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/pinoyaya
JWT_SECRET=change_me
STRIPE_SECRET_KEY=sk_test_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_REGION=...
AWS_S3_BUCKET=...
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Set the same variables in your Vercel Project Settings → Environment Variables for production.

## Installation
```
npm install
```

## Running Locally
Two ways to run:

1) Traditional server (includes Socket.IO):
```
npm start
# or live reload
npm run dev
```
- Base URL: http://localhost:${PORT}
- API path: /api/...

2) Vercel dev (serverless):
```
vercel dev
```
- Base URL: http://localhost:3000
- API path: /api/... (Vercel routes everything under /api to the serverless function)

## Deployment (Vercel)
This repository is configured for Vercel Serverless Functions:
- api/index.js exports the Express app created in src/createApp.js.
- vercel.json routes requests under /api/* (and /) to the serverless function.

Steps:
1. Connect the repo to Vercel.
2. Set Environment Variables in the project settings (same names as .env).
3. Deploy.

Notes:
- Websockets via Socket.IO are not supported on Vercel Serverless. If you need realtime, deploy a separate long‑running service (VM/Container) using src/app.js or migrate to a compatible realtime service.

## Scripts
```
# Start traditional server (HTTP + Socket.IO)
npm start

# Dev with nodemon
npm run dev
```

## API
- Base path (Vercel): /api
- Base path (traditional server): /api

Routers registered in src/routes/index.js:
- /customer
- /child
- /location
- /pet
- /babysitter
- /certificates
- /card
- /notification
- /favourites
- /job
- /request
- /review
- /payments
- /bankaccount
- /wallet
- /transactions
- /subscription
- /chat
- /message
- /admin

Health check
- GET / → "Hello World" (via src/createApp.js)

## Code Style & Conventions
- Express routers return JSON responses.
- Business logic should live in src/services/*, used by controllers.
- Mongoose models in src/models/* with clear schema definitions.
- Middlewares under src/middleware/* for auth and shared concerns.

## Troubleshooting
- 404 on site root after Vercel deploy: ensure vercel.json routes / to /api/index.js.
- Mongo connection errors on Vercel: verify MONGO_URI is set for the current environment (Production/Preview/Development) in Vercel.
- CORS: configured globally in src/createApp.js. Adjust origins as needed.
- Socket.IO not working on Vercel: use traditional hosting (src/app.js) or a dedicated realtime service.

## License
MIT
