const express = require("express");
const router = express.Router({ mergeParams: true }); // needs :id from the parent /api/movies/:id mount

const { getSeats, holdSeats, releaseSeats, bookSeats } = require("../controllers/seatController");

router.get("/", getSeats);
router.post("/hold", holdSeats);
router.post("/release", releaseSeats);
router.post("/book", bookSeats);

module.exports = router;
