const Ride = require('../models/Ride');
const User = require('../models/User');

const createRide = async (req, res) => {
  try {
    const { pickup_location, drop_location, departure_time, available_seats, price } = req.body;
    
    // Validate required fields
    if (!pickup_location || !drop_location || !departure_time || !available_seats || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (available_seats < 1) {
      return res.status(400).json({ message: 'Available seats must be at least 1.' });
    }

    // Check user role from DB to ensure they are still a driver
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.currentRole !== 'driver') {
      return res.status(403).json({ message: 'Access denied. Only users in the driver role can create rides.' });
    }

    const newRide = new Ride({
      driver_id: req.user.id,
      pickup_location,
      drop_location,
      departure_time,
      available_seats,
      price
    });

    await newRide.save();

    res.status(201).json({ message: 'Ride created successfully.', ride: newRide });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllRides = async (req, res) => {
  try {
    const { pickup_location, drop_location, date } = req.query;
    
    let filter = {};

    if (pickup_location) {
      filter.pickup_location = { $regex: pickup_location, $options: 'i' };
    }

    if (drop_location) {
      filter.drop_location = { $regex: drop_location, $options: 'i' };
    }

    if (date) {
      // Create a date range for the entire selected day (ignoring time)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      filter.departure_time = {
        $gte: startDate,
        $lte: endDate
      };
    }

    // Return filtered rides, sorted by departure_time asc, created_at desc
    const rides = await Ride.find(filter)
      .populate('driver_id', 'name email') // Populating driver info
      .sort({ departure_time: 1, created_at: -1 });
      
    res.status(200).json({ rides });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyRides = async (req, res) => {
  try {
    // Return rides created by the logged-in driver
    const rides = await Ride.find({ driver_id: req.user.id })
      .sort({ departure_time: 1, created_at: -1 });

    res.status(200).json({ rides });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRide,
  getAllRides,
  getMyRides
};
