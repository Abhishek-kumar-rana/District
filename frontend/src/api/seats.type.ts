// ---------- Types ----------

export interface Seat {
  seatId: string;
  row: string;
  number: number;
  status: "available" | "held" | "booked";
  heldBy: number | null;
  heldUntil: string | null;
  bookedBy: number | null;
}

export interface SeatMap {
  movieId: number;
  price: number;
  seats: Seat[];
}

export interface HoldResult {
  seatIds: string[];
  heldBy: number;
  heldUntil: string;
}

export interface ReleaseResult {
  seatIds: string[];
}

export interface Booking {
  id: number;
  movieId: number;
  userId: number;
  seatIds: string[];
  totalAmount: number;
  bookedAt: string;
  movieTitle?: string;
}