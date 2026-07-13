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
const { requireAdmin } = require("../middleware/checkAdmin");
const { getUserBookings } = require("../controllers/seatController");

router.get("/", getUsers);
router.get("/:id", getUserById);
router.get("/:id/bookings", getUserBookings);
router.post("/", createUser);
router.post("/login", loginUser);
router.put("/:id", updateUser);
router.delete("/:id", requireAdmin, deleteUser);

module.exports = router;
