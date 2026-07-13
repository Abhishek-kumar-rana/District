const { readDB, writeDB, nextId } = require("../utils/db");
const { HOLD_DURATION_MS, expireHeldSeats } = require("../models/seatModel");

function findMovie(db, movieId) {
  return db.movies.find((m) => String(m.id) === String(movieId));
}

// GET /api/movies/:id/seats
function getSeats(req, res) {
  const db = readDB();
  const movie = findMovie(db, req.params.id);

  if (!movie) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }

  // Lazily release any holds whose 10-minute window has passed
  if (expireHeldSeats(movie.seats)) {
    writeDB(db);
  }

  res.json({
    success: true,
    message: "Seats fetched successfully",
    data: { movieId: movie.id, price: movie.price, seats: movie.seats },
  });
}

// POST /api/movies/:id/seats/hold   body: { seatIds: [] }   header: x-user-id
function holdSeats(req, res) {
  const userId = req.headers["x-user-id"];
  const { seatIds } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Missing 'x-user-id' header." });
  }
  if (!Array.isArray(seatIds) || !seatIds.length) {
    return res.status(400).json({ success: false, message: "'seatIds' must be a non-empty array." });
  }

  const db = readDB();
  const movie = findMovie(db, req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }

  expireHeldSeats(movie.seats);

  const targetSeats = seatIds.map((id) => movie.seats.find((s) => s.seatId === id));

  const missing = seatIds.filter((id, i) => !targetSeats[i]);
  if (missing.length) {
    return res.status(404).json({ success: false, message: "Some seats don't exist", seatIds: missing });
  }

  // A seat already held by this same user can be re-held (refreshes the timer)
  const unavailable = targetSeats
    .filter((s) => s.status === "booked" || (s.status === "held" && String(s.heldBy) !== String(userId)))
    .map((s) => s.seatId);

  if (unavailable.length) {
    return res.status(409).json({
      success: false,
      message: "Some seats are already booked or held by another user",
      seatIds: unavailable,
    });
  }

  const heldUntil = new Date(Date.now() + HOLD_DURATION_MS).toISOString();
  targetSeats.forEach((s) => {
    s.status = "held";
    s.heldBy = Number(userId);
    s.heldUntil = heldUntil;
  });

  writeDB(db);

  res.json({
    success: true,
    message: "Seats held successfully",
    data: { seatIds, heldBy: Number(userId), heldUntil },
  });
}

// POST /api/movies/:id/seats/release   body: { seatIds: [] }   header: x-user-id
function releaseSeats(req, res) {
  const userId = req.headers["x-user-id"];
  const { seatIds } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Missing 'x-user-id' header." });
  }
  if (!Array.isArray(seatIds) || !seatIds.length) {
    return res.status(400).json({ success: false, message: "'seatIds' must be a non-empty array." });
  }

  const db = readDB();
  const movie = findMovie(db, req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }

  const released = [];
  movie.seats.forEach((s) => {
    if (seatIds.includes(s.seatId) && s.status === "held" && String(s.heldBy) === String(userId)) {
      s.status = "available";
      s.heldBy = null;
      s.heldUntil = null;
      released.push(s.seatId);
    }
  });

  writeDB(db);

  res.json({ success: true, message: "Seats released successfully", data: { seatIds: released } });
}

// POST /api/movies/:id/seats/book   body: { seatIds: [] }   header: x-user-id
function bookSeats(req, res) {
  const userId = req.headers["x-user-id"];
  const { seatIds } = req.body;

  if (!userId) {
    return res.status(401).json({ success: false, message: "Missing 'x-user-id' header." });
  }
  if (!Array.isArray(seatIds) || !seatIds.length) {
    return res.status(400).json({ success: false, message: "'seatIds' must be a non-empty array." });
  }

  const db = readDB();
  const movie = findMovie(db, req.params.id);
  if (!movie) {
    return res.status(404).json({ success: false, message: "Movie not found" });
  }

  expireHeldSeats(movie.seats);

  const targetSeats = seatIds.map((id) => movie.seats.find((s) => s.seatId === id));
  const missing = seatIds.filter((id, i) => !targetSeats[i]);
  if (missing.length) {
    return res.status(404).json({ success: false, message: "Some seats don't exist", seatIds: missing });
  }

  // Must currently hold every requested seat (hold not expired) to confirm booking
  const notHeldByUser = targetSeats
    .filter((s) => !(s.status === "held" && String(s.heldBy) === String(userId)))
    .map((s) => s.seatId);

  if (notHeldByUser.length) {
    return res.status(409).json({
      success: false,
      message: "You must hold these seats (and the hold must not have expired) before booking",
      seatIds: notHeldByUser,
    });
  }

  targetSeats.forEach((s) => {
    s.status = "booked";
    s.bookedBy = Number(userId);
    s.heldBy = null;
    s.heldUntil = null;
  });

  db.bookings = db.bookings || [];
  const booking = {
    id: nextId(db.bookings),
    movieId: movie.id,
    userId: Number(userId),
    seatIds,
    totalAmount: (movie.price || 0) * seatIds.length,
    bookedAt: new Date().toISOString(),
  };
  db.bookings.push(booking);

  writeDB(db);

  res.status(201).json({ success: true, message: "Seats booked successfully", data: booking });
}

// GET /api/users/:id/bookings
function getUserBookings(req, res) {
  const db = readDB();
  const userId = req.params.id;

  const bookings = (db.bookings || [])
    .filter((b) => String(b.userId) === String(userId))
    .map((b) => {
      const movie = db.movies.find((m) => String(m.id) === String(b.movieId));
      return { ...b, movieTitle: movie ? movie.title : null };
    });

  res.json({ success: true, message: "Bookings fetched successfully", count: bookings.length, data: bookings });
}

module.exports = { getSeats, holdSeats, releaseSeats, bookSeats, getUserBookings };
