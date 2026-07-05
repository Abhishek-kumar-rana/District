const { readDB } = require("../utils/db");

/**
 * No JWT is used in this project. Instead, the client sends the acting
 * user's id in the "x-user-id" header. This middleware looks up that user
 * in the Users collection and reads their `role` field directly from the
 * database (never trusting a role sent by the client) to decide whether
 * they're allowed to perform the admin-only action.
 *
 * Example (frontend fetch):
 *   fetch('/api/movies', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json', 'x-user-id': '1' },
 *     body: JSON.stringify({ title: 'New Movie', ... })
 *   })
 */
function checkAdmin(req, res, next) {
  const userId = req.headers["x-user-id"];

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Missing 'x-user-id' header. Send the id of the logged-in user.",
    });
  }

  const db = readDB();
  const user = db.users.find((u) => String(u.id) === String(userId));

  if (!user) {
    return res.status(401).json({
      success: false,
      message: `No user found with id '${userId}'.`,
    });
  }

  if (user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required for this action.",
    });
  }

  req.currentUser = user;
  next();
}

module.exports = checkAdmin;
