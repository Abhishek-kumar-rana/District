/**
 * Seat Schema (embedded inside Movie.seats — auto-generated on movie creation)
 * {
 *   seatId: String              e.g. "A1", "A2", "B5"
 *   row: String                 "A", "B", "C"...
 *   number: Number              1, 2, 3...
 *   status: "available" | "held" | "booked"
 *   heldBy: Number | null       userId currently holding it
 *   heldUntil: String | null    ISO datetime the hold expires
 *   bookedBy: Number | null     userId who booked it (set once status is "booked")
 * }
 *
 * Booking Schema (top-level db.bookings collection — created only on confirm)
 * {
 *   id: Number
 *   movieId: Number
 *   userId: Number
 *   seatIds: [String]
 *   totalAmount: Number
 *   bookedAt: String            ISO datetime
 * }
 */

const HOLD_DURATION_MS = 30 * 1000; // 10 minutes
const DEFAULT_ROWS = 5;
const DEFAULT_SEATS_PER_ROW = 10;
const ROW_LETTERS = "ABCDEFGHIJ";

// Builds a fresh seat map (default 5 rows x 10 seats = 50 seats)
function generateSeats(rows = DEFAULT_ROWS, seatsPerRow = DEFAULT_SEATS_PER_ROW) {
  const seats = [];

  for (let r = 0; r < rows; r++) {
    for (let n = 1; n <= seatsPerRow; n++) {
      seats.push({
        seatId: `${ROW_LETTERS[r]}${n}`,
        row: ROW_LETTERS[r],
        number: n,
        status: "available",
        heldBy: null,
        heldUntil: null,
        bookedBy: null,
      });
    }
  }

  return seats;
}

// Flips any expired "held" seats back to "available". Mutates in place.
// Returns true if anything changed (so the caller knows whether to persist).
function expireHeldSeats(seats) {
  const now = Date.now();
  let changed = false;

  for (const seat of seats) {
    if (seat.status === "held" && seat.heldUntil && new Date(seat.heldUntil).getTime() < now) {
      seat.status = "available";
      seat.heldBy = null;
      seat.heldUntil = null;
      changed = true;
    }
  }

  return changed;
}

module.exports = {
  HOLD_DURATION_MS,
  DEFAULT_ROWS,
  DEFAULT_SEATS_PER_ROW,
  generateSeats,
  expireHeldSeats,
};
