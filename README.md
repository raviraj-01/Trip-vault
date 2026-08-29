# TripVault

A full-stack MERN travel memory journal where users can log trips, upload photos, and share their travel journey through a public profile.

Built as part of the CodGen Virtual Internship Program, Full Stack MERN track.

## Features

- **Authentication**: Register and log in with JWT, with passwords hashed using bcrypt.
- **Trip Management**: Create, view, edit, and delete personal trips.
- **Photo Uploads**: Attach cover images and photo galleries to trips via Cloudinary.
- **Public Profiles**: Shareable `/profile/:username` pages showing a user's trips, with no login required to view.

## Tech Stack

**Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, Multer, Cloudinary

**Frontend:** React, Vite, React Router, Axios

## Project Structure

```text
tripvault/
├── client/                 # React (Vite) frontend
│   ├── src/
│   │   ├── pages/          # Login, Register, Dashboard, Profile, TripDetail
│   │   ├── components/     # TripCard, ProtectedRoute, forms, API helper
│   │   ├── App.jsx
│   │   └── main.jsx
├── server/                 # Node + Express backend
│   ├── middleware/         # authMiddleware.js, upload.js
│   ├── models/             # User.js, Trip.js
│   ├── routes/             # auth.js, trips.js, users.js
│   ├── .env                # not committed
│   └── index.js
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/raviraj-01/Trip-vault.git
cd Trip-vault
```

### 2. Backend setup

```bash
cd server
npm install
```

Create a `.env` file inside `server/`:

```ini
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_random_secret_string
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the server:

```bash
npm run dev
```

The backend runs on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../client
npm install
npm run dev
```

The frontend runs on `http://localhost:5173`.

## API Routes

### Auth

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Log in and receive a JWT |
| GET | `/api/auth/me` | Yes | Get logged-in user info |

### Trips

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/trips` | Yes | Create a trip |
| GET | `/api/trips` | Yes | Get all trips for the logged-in user |
| GET | `/api/trips/:id` | Yes | Get a single trip, owner only |
| PUT | `/api/trips/:id` | Yes | Update a trip, owner only |
| DELETE | `/api/trips/:id` | Yes | Delete a trip, owner only |
| POST | `/api/trips/:id/upload` | Yes | Upload a photo and attach it to a trip |

### Users / Profiles

| Method | Route | Auth | Description |
| --- | --- | --- | --- |
| GET | `/api/users/:username/profile` | No | View a public profile with name, bio, and trips |
| PUT | `/api/users/profile` | Yes | Update the logged-in user's username and bio |

## Testing the Auth Flow

1. Register a new account at `/register`.
2. Log in at `/login`.
3. Go to `/dashboard`, create a trip, and upload a cover photo.
4. Visit `/profile/:username` in an incognito window to confirm the public profile works without login.

## Security Notes

- Passwords are hashed with bcrypt and are never stored in plain text.
- JWT authentication is required on all private routes and verified through middleware.
- Trip ownership is checked on every update, delete, and upload action.
- Public profile responses expose only safe fields: name, username, bio, and trip information.
- Email addresses, password hashes, and environment secrets are never exposed through public routes.
- `.env` files are excluded with `.gitignore` and should never be committed.

## Roadmap

- Week 1: Auth system with JWT and bcrypt
- Week 2: Trip CRUD
- Week 3: Cloudinary photo uploads and public profiles
- Week 4: Polish and deployment

## License

Internship project for educational purposes.
