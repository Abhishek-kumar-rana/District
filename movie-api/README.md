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

To reset the data back to the original seed (3 users + 10 movies):

```bash
npm run seed
```

## Roles (no JWT)

There is no token/auth header. Instead, every write action requires an
`x-user-id` header containing the id of a user. The server looks up that
user record from `data/db.json` and reads their real `role` field — it
never trusts a role sent directly by the client.

There are three roles:

| Role         | Can do |
|--------------|--------|
| `user`       | Read-only (list/view movies) |
| `admin`      | Read + **update (edit)** movies |
| `superadmin` | Read + **create**, **update**, and **delete** movies |

So a normal `admin` can only edit existing movies — creating a new movie or
deleting one requires `superadmin`.

Seeded users:

| id | email                   | password  | role       |
|----|-------------------------|-----------|------------|
| 1  | superadmin@example.com  | 11111111  | superadmin |
| 2  | admin@example.com       | 11111111  | admin      |
| 3  | user@example.com        | 11111111  | user       |

Example (frontend `fetch`):

```js
// Create a movie — only works with a superadmin's id
fetch('http://localhost:5000/api/movies', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': '1' // must belong to a superadmin
  },
  body: JSON.stringify({ title: 'New Movie', certificate: 'U', ... })
});

// Edit a movie — works with either an admin's or a superadmin's id
fetch('http://localhost:5000/api/movies/101', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': '2' // admin or superadmin
  },
  body: JSON.stringify({ title: 'Updated Title' })
});
```

If `x-user-id` is missing → `401`.
If the user's role doesn't have permission → `403`.

## Schemas

### User
```
{
  id: Number,
  name: String,
  email: String,       // required, unique
  password: String,    // required (stored as plain text — local testing only)
  role: "user" | "admin" | "superadmin",
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
| Method | Route              | Auth              | Description               |
|--------|---------------------|-------------------|----------------------------|
| GET    | `/api/movies`        | Public            | List all movies (sorted by `releaseDate` descending). Supports `?genre=`, `?language=`, `?certificate=`, `?search=` query params |
| GET    | `/api/movies/:id`    | Public            | Get a single movie |
| POST   | `/api/movies`        | Super Admin only  | Create a movie |
| PUT    | `/api/movies/:id`    | Admin or Super Admin | Update (edit) a movie |
| DELETE | `/api/movies/:id`    | Super Admin only  | Delete a movie |

### Users
| Method | Route               | Auth                 | Description |
|--------|----------------------|----------------------|-------------|
| GET    | `/api/users`          | Public               | List all users (passwords excluded) |
| GET    | `/api/users/:id`      | Public               | Get a single user |
| POST   | `/api/users`          | Public               | Register a new user |
| POST   | `/api/users/login`    | Public               | Login with `email` + `password`, returns the user (no token) |
| PUT    | `/api/users/:id`      | Public               | Update a user |
| DELETE | `/api/users/:id`      | Admin or Super Admin | Delete a user |

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
│   ├── userModel.js          # user schema + validation (roles live here)
│   └── movieModel.js         # movie schema + validation
├── controllers/
│   ├── userController.js
│   └── movieController.js
├── routes/
│   ├── userRoutes.js
│   └── movieRoutes.js
├── middleware/
│   └── checkAdmin.js         # exports requireAdmin + requireSuperAdmin
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
