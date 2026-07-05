const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const userRoutes = require("./routes/userRoutes");
const movieRoutes = require("./routes/movieRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Movie API is running",
    endpoints: {
      movies: "/api/movies",
      users: "/api/users",
      login: "/api/users/login",
    },
  });
});

app.use("/api/movies", movieRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ success: false, message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Movie API running at http://localhost:${PORT}`);
});
