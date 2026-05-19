const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createRide,
  getAllRides,
  getMyRides,
  getBookedRides,
  bookRide,
} = require('../controllers/rideController');

router.post('/create', authMiddleware, createRide);
router.post('/book', authMiddleware, bookRide);
router.get('/all', getAllRides);
router.get('/my-rides', authMiddleware, getMyRides);
router.get('/booked', authMiddleware, getBookedRides);

module.exports = router;
