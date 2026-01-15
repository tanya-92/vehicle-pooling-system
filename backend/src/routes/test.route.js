const express = require("express");
const router = express.Router();

const User = require("../models/User.model");
const Ride = require("../models/Ride.model");
const Booking = require("../models/Booking.model");

// TEST USER
router.get("/create-user", async (req, res) => {
  const user = await User.create({
    name: "Tanya",
    email: "tanya@lpu.in",
    phone: "9999999999",
  });

  res.json(user);
});

// TEST RIDE
router.get("/create-ride", async (req, res) => {
  const user = await User.findOne(); // first user

  const ride = await Ride.create({
    driver: user._id,
    from: "LPU Main Gate",
    to: "Phagwara",
    rideDate: new Date(),
    totalSeats: 4,
    availableSeats: 4,
    pricePerSeat: 50,
  });

  res.json(ride);
});

// TEST BOOKING
router.get("/create-booking", async (req, res) => {
  const user = await User.findOne();
  const ride = await Ride.findOne();

  const booking = await Booking.create({
    ride: ride._id,
    passenger: user._id,
  });

  res.json(booking);
});

module.exports = router;
