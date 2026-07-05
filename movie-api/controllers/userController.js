const { readDB, writeDB, nextId } = require("../utils/db");
const { validateUserInput, toPublicUser } = require("../models/userModel");

// GET /api/users
function getUsers(req, res) {
  const db = readDB();
  res.json({
    success: true,
    message: "Users fetched successfully",
    count: db.users.length,
    data: db.users.map(toPublicUser),
  });
}

// GET /api/users/:id
function getUserById(req, res) {
  const db = readDB();
  const user = db.users.find((u) => String(u.id) === String(req.params.id));

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.json({ success: true, message: "User fetched successfully", data: toPublicUser(user) });
}

// POST /api/users  (register - public)
function createUser(req, res) {
  const errors = validateUserInput(req.body);
  console.log(req.body);
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const db = readDB();

  const exists = db.users.some(
    (u) => u.email.toLowerCase() === req.body.email.toLowerCase()
  );
  if (exists) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  const newUser = {
    id: nextId(db.users),
    name: req.body.name || "",
    email: req.body.email,
    password: req.body.password,
    role: req.body.role === "admin" ? "admin" : "user",
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  writeDB(db);

  res.status(201).json({ success: true, message: "User created successfully", data: toPublicUser(newUser) });
}

// POST /api/users/login  (public, no JWT - just returns the matching user)
function loginUser(req, res) {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "'email' and 'password' are required" });
  }

  const db = readDB();
  const user = db.users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );

  if (!user) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.json({ success: true, message: "Login successful", data: toPublicUser(user) });
}

// PUT /api/users/:id
function updateUser(req, res) {
  const errors = validateUserInput(req.body, { isUpdate: true });
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const db = readDB();
  const index = db.users.findIndex((u) => String(u.id) === String(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  db.users[index] = { ...db.users[index], ...req.body, id: db.users[index].id };
  writeDB(db);

  res.json({ success: true, message: "User updated successfully", data: toPublicUser(db.users[index]) });
}

// DELETE /api/users/:id  (admin only)
function deleteUser(req, res) {
  const db = readDB();
  const index = db.users.findIndex((u) => String(u.id) === String(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const [deleted] = db.users.splice(index, 1);
  writeDB(db);

  res.json({ success: true, message: "User deleted successfully", data: toPublicUser(deleted) });
}

module.exports = { getUsers, getUserById, createUser, loginUser, updateUser, deleteUser };
