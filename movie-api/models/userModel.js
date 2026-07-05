/**
 * User Schema
 * {
 *   id: Number            (auto-generated)
 *   name: String
 *   email: String         (required, unique)
 *   password: String      (required) -- stored as plain text for local testing only
 *   role: "user" | "admin"  (default: "user")
 *   createdAt: String     (ISO date, auto-generated)
 * }
 */

const ROLES = ["user", "admin"];

function validateUserInput(body, { isUpdate = false } = {}) {
  const errors = [];

  if (!isUpdate || body.email !== undefined) {
    if (!body.email || typeof body.email !== "string" || !body.email.includes("@")) {
      errors.push("A valid 'email' is required.");
    }
  }

  if (!isUpdate) {
    if (!body.password || typeof body.password !== "string" || body.password.length < 4) {
      errors.push("'password' is required (min 4 characters).");
    }
  } else if (body.password !== undefined && body.password.length < 4) {
    errors.push("'password' must be at least 4 characters.");
  }

  if (body.role !== undefined && !ROLES.includes(body.role)) {
    errors.push(`'role' must be one of: ${ROLES.join(", ")}`);
  }

  return errors;
}

// Strips password before sending user objects back to the client
function toPublicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

module.exports = { ROLES, validateUserInput, toPublicUser };
