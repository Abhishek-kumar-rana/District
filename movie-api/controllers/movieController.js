const { readDB, writeDB, nextId } = require("../utils/db");
const { validateMovieInput } = require("../models/movieModel");

// GET /api/movies  (supports ?genre=, ?language=, ?search=, ?certificate=)
function getMovies(req, res) {
  const { genre, language, search, certificate } = req.query;
  const db = readDB();

  // Sort a copy (don't mutate db.movies) by releaseDate, newest first
  let movies = [...db.movies].sort(
    (a, b) => new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
  );

  if (genre) {
    movies = movies.filter((m) =>
      m.genres.some((g) => g.toLowerCase() === genre.toLowerCase())
    );
  }
  if (language) {
    movies = movies.filter((m) =>
      m.languages.some((l) => l.toLowerCase() === language.toLowerCase())
    );
  }
  if (certificate) {
    movies = movies.filter(
      (m) => m.certificate.toLowerCase() === certificate.toLowerCase()
    );
  }
  if (search) {
    const term = search.toLowerCase();
    movies = movies.filter(
      (m) =>
        m.title.toLowerCase().includes(term) ||
        m.description.toLowerCase().includes(term)
    );
  }

  res.json({ success: true, message: "Movies fetched successfully", count: movies.length, data: movies });
}

// GET /api/movies/:id
function getMovieById(req, res) {
  const db = readDB();
  const movie = db.movies.find((m) => String(m.id) === String(req.params.id));

  if (!movie) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }

  res.json({ success: true, message: "Movie fetched successfully", data: movie });
}

// POST /api/movies  (admin only)
function createMovie(req, res) {
  const errors = validateMovieInput(req.body);
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const db = readDB();

  const newMovie = {
    id: nextId(db.movies),
    title: req.body.title,
    certificate: req.body.certificate || "U",
    languages: req.body.languages || [],
    duration: req.body.duration || "",
    releaseDate: req.body.releaseDate || "",
    description: req.body.description || "",
    genres: req.body.genres || [],
    bannerImage: req.body.bannerImage || "",
    backgroundImage: req.body.backgroundImage || "",
    cast: req.body.cast || [],
  };

  db.movies.push(newMovie);
  writeDB(db);

  res.status(201).json({ success: true, message: "Movie created successfully", data: newMovie });
}

// PUT /api/movies/:id  (admin only)
function updateMovie(req, res) {
  const errors = validateMovieInput(req.body, { isUpdate: true });
  if (errors.length) {
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  const db = readDB();
  const index = db.movies.findIndex((m) => String(m.id) === String(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }

  db.movies[index] = { ...db.movies[index], ...req.body, id: db.movies[index].id };
  writeDB(db);

  res.json({ success: true, message: "Movie updated successfully", data: db.movies[index] });
}

// DELETE /api/movies/:id  (admin only)
function deleteMovie(req, res) {
  const db = readDB();
  const index = db.movies.findIndex((m) => String(m.id) === String(req.params.id));

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }

  const [deleted] = db.movies.splice(index, 1);
  writeDB(db);

  res.json({ success: true, message: "Movie deleted successfully", data: deleted });
}

module.exports = { getMovies, getMovieById, createMovie, updateMovie, deleteMovie };