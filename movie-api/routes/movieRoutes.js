const express = require("express");
const router = express.Router();

const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const { requireAdmin, requireSuperAdmin } = require("../middleware/checkAdmin");
const seatRoutes = require("./seatRoutes");

router.get("/", getMovies);
router.get("/:id", getMovieById);

// Only Super Admins can create or delete movies
router.post("/", requireSuperAdmin, createMovie);
router.delete("/:id", requireSuperAdmin, deleteMovie);

// Both Admins and Super Admins can update (edit) a movie
router.put("/:id", requireAdmin, updateMovie);

// Seat booking (hold / release / book / view seat map) for this movie
router.use("/:id/seats", seatRoutes);

module.exports = router;
