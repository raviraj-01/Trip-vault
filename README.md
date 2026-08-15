# TripVault

Full-stack MERN authentication app with secure registration, login, JWT-protected routes, and a React dashboard.

## Project structure

```
tripvault/
├── client/              ← React (Vite) frontend
│   ├── src/
│   │   ├── pages/       ← Login.jsx, Register.jsx, Dashboard.jsx
│   │   ├── components/
│   │   └── App.jsx
├── server/              ← Node + Express backend
│   ├── models/          ← User.js (Mongoose schema)
│   ├── routes/          ← auth.js
│   ├── middleware/      ← authMiddleware.js
│   ├── .env             ← MONGO_URI, JWT_SECRET
│   └── index.js         ← Entry point
└── README.md
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas cluster (or local MongoDB)

## Environment variables

Create `server/.env` with:

| Variable     | Description                        |
| ------------ | ---------------------------------- |
| `MONGO_URI`  | MongoDB connection string          |
| `JWT_SECRET` | Secret key used to sign JWT tokens |
| `PORT`       | Backend port (default: `5000`)     |

Example:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/tripvault?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
```

Never commit `.env` files. Passwords are hashed with bcrypt before storage.

## Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

## Run the app

Terminal 1 — backend:

```bash
cd server
npm run dev
```

Terminal 2 — frontend:

```bash
cd client
npm run dev
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API routes

| Method | Route                | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/api/auth/register` | Register a new user             |
| POST   | `/api/auth/login`    | Log in and receive a JWT        |
| GET    | `/api/auth/me`       | Get current user (Bearer token) |

## Test the auth flow

1. Open `http://localhost:5173`.
2. Go to **Register**, create an account with name, email, and password (min 6 chars).
3. You should be redirected to **Login**.
4. Sign in with the same email and password.
5. You should land on **Dashboard** and see your name.
6. Click **Log out** to clear the token and return to login.

## Tech stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, cors, dotenv
- **Database:** MongoDB
