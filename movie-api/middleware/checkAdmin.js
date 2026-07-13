const { readDB } = require("../utils/db");

/**
 * No JWT is used in this project. Instead, the client sends the acting
 * user's id in the "x-user-id" header. These middlewares look up that user
 * in the Users collection and read their `role` field directly from the
 * database (never trusting a role sent by the client) to decide whether
 * they're allowed to perform the action.
 *
 * Two admin levels:
 *   - "admin"      -> can only UPDATE (edit) movies
 *   - "superadmin" -> can CREATE, UPDATE, and DELETE movies
 *
 * Example (frontend fetch):
 *   fetch('/api/movies', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'x-user-id': '1' },
 *     body: JSON.stringify({ title: 'New Movie', ... })
 *   })
 */
function getRequestingUser(req) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return {
      error: {
        status: 401,
        message: "Missing 'x-user-id' header. Send the id of the logged-in user.",
      },
    };
  }

  const db = readDB();
  const user = db.users.find((u) => String(u.id) === String(userId));

  if (!user) {
    return { error: { status: 401, message: `No user found with id '${userId}'.` } };
  }

  return { user };
}

// Allows "admin" AND "superadmin" — use for actions both levels can do,
// e.g. editing (updating) a movie.
function requireAdmin(req, res, next) {
  const { user, error } = getRequestingUser(req);
  if (error) return res.status(error.status).json({ success: false, message: error.message });

  if (user.role !== "admin" && user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin or Super Admin role required for this action.",
    });
  }

  req.currentUser = user;
  next();
}

// Allows ONLY "superadmin" — use for actions only the highest level can do,
// e.g. creating or deleting a movie.
function requireSuperAdmin(req, res, next) {
  const { user, error } = getRequestingUser(req);
  if (error) return res.status(error.status).json({ success: false, message: error.message });

  if (user.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Super Admin role required for this action.",
    });
  }

  req.currentUser = user;
  next();
}

module.exports = { requireAdmin, requireSuperAdmin };
