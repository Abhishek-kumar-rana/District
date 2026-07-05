const express = require("express");
const router = express.Router();

const {
  getMovies,
  getMovieById,
  createMovie,
  updateMovie,
  deleteMovie,
} = require("../controllers/movieController");
const checkAdmin = require("../middleware/checkAdmin");

router.get("/", getMovies);
router.get("/:id", getMovieById);
router.post("/", checkAdmin, createMovie);
router.put("/:id", checkAdmin, updateMovie);
router.delete("/:id", checkAdmin, deleteMovie);

module.exports = router;
