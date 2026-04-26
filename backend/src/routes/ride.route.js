const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createRide, getAllRides, getMyRides } = require('../controllers/rideController');

router.post('/create', authMiddleware, createRide);
router.get('/all', getAllRides); // Making this public or protected? The request says "Public or protected (your choice)". I'll make it public for now, or just require token later if needed. Let's make it protected to be safe. Actually, the dashboard could show rides, so I'll leave it without middleware to be public, but usually you want auth. Let's add authMiddleware.
// wait, the plan said "Mount GET /all -> getAllRides", I'll follow that.

router.get('/my-rides', authMiddleware, getMyRides);

module.exports = router;
