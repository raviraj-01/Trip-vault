# TripVault

Full-stack MERN app with JWT authentication (Week 1) and trip management CRUD (Week 2).

## Project structure

```
tripvault/
├── client/              ← React (Vite) frontend
│   ├── src/
│   │   ├── pages/       ← Login.jsx, Register.jsx, Dashboard.jsx
│   │   ├── components/  ← TripCard, TripForm, ProtectedRoute, api.js
│   │   └── App.jsx
├── server/              ← Node + Express backend
│   ├── models/          ← User.js, Trip.js
│   ├── routes/          ← auth.js, trips.js
│   ├── middleware/      ← authMiddleware.js
│   ├── .env             ← MONGO_URI, JWT_SECRET
│   └── index.js
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

## Week 1 — Authentication

| Method | Route                | Description                     |
| ------ | -------------------- | ------------------------------- |
| POST   | `/api/auth/register` | Register a new user             |
| POST   | `/api/auth/login`    | Log in and receive a JWT        |
| GET    | `/api/auth/me`       | Get current user (Bearer token) |

1. Register → Login → Dashboard
2. JWT is stored in `localStorage` and attached automatically to every API request via an axios interceptor

## Week 2 — Trip management

All trip routes require a valid JWT. Users can only access their own trips.

| Method | Route             | Description                              |
| ------ | ----------------- | ---------------------------------------- |
| POST   | `/api/trips`      | Create a trip (user set server-side)     |
| GET    | `/api/trips`      | List current user's trips                |
| GET    | `/api/trips/:id`  | Get one trip (403 if not owner)          |
| PUT    | `/api/trips/:id`  | Update trip (403 if not owner)           |
| DELETE | `/api/trips/:id`  | Delete trip (403 if not owner)           |

### Trip fields

- **Required:** `title`, `destination`
- **Optional:** `startDate`, `endDate`, `description`, `rating` (1–5)

### Dashboard features

- Loading, error, empty, and loaded states
- Trip cards with title, destination, dates, and star rating
- Create / edit modal form (shared `TripForm` component)
- Delete with confirmation
- List refreshes automatically after create, edit, or delete

### Test ownership isolation

1. Register **User A** and create a trip. Note the trip ID from the network tab if needed.
2. Log out, register **User B**, and log in.
3. User B's dashboard should show an empty list (not User A's trips).
4. If User B calls `GET /api/trips/:id` with User A's trip ID → **403 Forbidden**.

## Tech stack

- **Frontend:** React, Vite, React Router, Axios
- **Backend:** Node.js, Express, Mongoose, bcryptjs, jsonwebtoken, cors, dotenv
- **Database:** MongoDB
