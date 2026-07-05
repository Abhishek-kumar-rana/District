const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  createUser,
  loginUser,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const checkAdmin = require("../middleware/checkAdmin");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.delete("/:id", checkAdmin, deleteUser);

module.exports = router;
