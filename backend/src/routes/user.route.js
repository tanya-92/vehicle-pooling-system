const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getProfile, updateVehicleInfo } = require('../controllers/userController');

router.get('/profile', authMiddleware, getProfile);
router.patch('/vehicle-info', authMiddleware, updateVehicleInfo);

module.exports = router;
