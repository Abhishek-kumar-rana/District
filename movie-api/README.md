# Movie API (for frontend CRUD testing)

A simple Express.js backend with **Users** and **Movies** schemas, built for
frontend developers to test CRUD pages against. No database installation
required — data is stored in a local JSON file (`data/db.json`). No JWT —
role checks are done by looking up the acting user's `role` from the Users
collection.

## Setup

```bash
npm install
npm start          # runs on http://localhost:5000
```

To reset the data back to the original seed (2 users + 10 movies):

```bash
npm run seed
```

## How "admin only" works (no JWT)

There is no token/auth header. Instead, every write action on movies
requires an `x-user-id` header containing the id of a user who has
`role: "admin"` in the database. The server looks up that user record from
`data/db.json` and reads their real `role` field — it never trusts a role
sent directly by the client.

Seeded users:

| id | email             | password  | role  |
|----|-------------------|-----------|-------|
| 1  | admin@example.com | admin123  | admin |
| 2  | user@example.com  | user123   | user  |

Example (frontend `fetch`):

```js
fetch('http://localhost:5000/api/movies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': '1' // must belong to an admin user
  },
  body: JSON.stringify({ title: 'New Movie', certificate: 'U', ... })
});
```

If `x-user-id` is missing → `401`.
If the user isn't an admin → `403`.

## Schemas

### User
```
{
  id: Number,
  name: String,
  email: String,       // required, unique
  password: String,    // required (stored as plain text — local testing only)
  role: "user" | "admin",
  createdAt: String
}
```

### Movie
```
{
  id: Number,
  title: String,        // required
  certificate: String,  // e.g. "U", "UA7+", "UA13+", "UA16+", "A"
  languages: [String],
  duration: String,      // e.g. "2h 05m"
  releaseDate: String,   // "YYYY-MM-DD"
  description: String,
  genres: [String],
  bannerImage: String,   // URL
  backgroundImage: String, // URL
  cast: [
    { id: Number, name: String, role: String, image: String }
  ]
}
```

## Endpoints

### Movies
| Method | Route              | Auth        | Description               |
|--------|---------------------|-------------|----------------------------|
| GET    | `/api/movies`        | Public      | List all movies. Supports `?genre=`, `?language=`, `?certificate=`, `?search=` query params |
| GET    | `/api/movies/:id`    | Public      | Get a single movie |
| POST   | `/api/movies`        | Admin only  | Create a movie |
| PUT    | `/api/movies/:id`    | Admin only  | Update a movie |
| DELETE | `/api/movies/:id`    | Admin only  | Delete a movie |

### Users
| Method | Route               | Auth        | Description |
|--------|----------------------|-------------|-------------|
| GET    | `/api/users`          | Public      | List all users (passwords excluded) |
| GET    | `/api/users/:id`      | Public      | Get a single user |
| POST   | `/api/users`          | Public      | Register a new user |
| POST   | `/api/users/login`    | Public      | Login with `email` + `password`, returns the user (no token) |
| PUT    | `/api/users/:id`      | Public      | Update a user |
| DELETE | `/api/users/:id`      | Admin only  | Delete a user |

All responses follow this shape:

```json
{ "success": true, "message": "...", "data": ... }
```

## Project structure

```
movie-api/
├── server.js               # app entry point
├── data/
│   ├── db.json              # live data (auto-generated / edited by the API)
│   └── movies.seed.json     # original seed movie list
├── models/
│   ├── userModel.js          # user schema + validation
│   └── movieModel.js         # movie schema + validation
├── controllers/
│   ├── userController.js
│   └── movieController.js
├── routes/
│   ├── userRoutes.js
│   └── movieRoutes.js
├── middleware/
│   └── checkAdmin.js         # role-lookup based admin gate
└── utils/
    ├── db.js                 # JSON file read/write helpers
    └── seed.js                # resets data/db.json
```

## Notes

- Passwords are stored in plain text. This is intentional for a lightweight
  local testing backend — do not use this as-is in production.
- Data persists to `data/db.json` between restarts. Run `npm run seed` any
  time you want a clean slate.
- CORS is enabled for all origins so you can call this from any frontend
  dev server.
