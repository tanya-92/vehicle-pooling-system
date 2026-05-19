const Ride = require('../models/Ride');
const Booking = require('../models/Booking');
const User = require('../models/User');

const createRide = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, departureTime, availableSeats, pricePerSeat } =
      req.body;

    if (!pickupLocation || !dropLocation || !departureTime || !availableSeats || !pricePerSeat) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const seats = Number(availableSeats);
    const price = Number(pricePerSeat);

    if (seats < 1) {
      return res.status(400).json({ message: 'Available seats must be at least 1.' });
    }

    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (!user.hasCompleteVehicleInfo()) {
      return res.status(400).json({
        message: 'Please complete your vehicle information before offering a ride.',
      });
    }

    if (seats > user.vehicleInfo.seatsAvailable) {
      return res.status(400).json({
        message: `You can offer at most ${user.vehicleInfo.seatsAvailable} seats based on your vehicle.`,
      });
    }

    const { vehicleType, vehicleModel, vehicleColor, vehicleNumber } = user.vehicleInfo;

    const newRide = new Ride({
      driver: req.user.userId,
      pickupLocation: pickupLocation.trim(),
      dropLocation: dropLocation.trim(),
      departureTime: new Date(departureTime),
      availableSeats: seats,
      pricePerSeat: price,
      vehicleSnapshot: {
        vehicleType,
        vehicleModel,
        vehicleColor,
        vehicleNumber,
      },
    });

    await newRide.save();

    res.status(201).json({ message: 'Ride created successfully.', ride: newRide });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllRides = async (req, res) => {
  try {
    const { pickupLocation, dropLocation, date } = req.query;
    const filter = { departureTime: { $gte: new Date() } };

    if (pickupLocation) {
      filter.pickupLocation = { $regex: pickupLocation, $options: 'i' };
    }

    if (dropLocation) {
      filter.dropLocation = { $regex: dropLocation, $options: 'i' };
    }

    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: startDate, $lte: endDate };
    }

    const rides = await Ride.find(filter)
      .populate('driver', 'name email phone avatar vehicleInfo')
      .sort({ departureTime: 1 });

    res.status(200).json({ rides });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMyRides = async (req, res) => {
  try {
    const rides = await Ride.find({ driver: req.user.userId }).sort({ departureTime: 1 });
    res.status(200).json({ rides });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getBookedRides = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId, status: { $ne: 'cancelled' } })
      .populate({
        path: 'ride',
        populate: { path: 'driver', select: 'name email phone avatar' },
      })
      .sort({ createdAt: -1 });

    res.status(200).json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const bookRide = async (req, res) => {
  try {
    const { rideId, seatsBooked = 1 } = req.body;

    if (!rideId) {
      return res.status(400).json({ message: 'Ride ID is required.' });
    }

    const seats = Number(seatsBooked);
    if (seats < 1) {
      return res.status(400).json({ message: 'At least 1 seat is required.' });
    }

    const ride = await Ride.findById(rideId);
    if (!ride) {
      return res.status(404).json({ message: 'Ride not found.' });
    }

    if (ride.driver.toString() === req.user.userId) {
      return res.status(400).json({ message: 'You cannot book your own ride.' });
    }

    if (ride.availableSeats < seats) {
      return res.status(400).json({ message: 'Not enough seats available.' });
    }

    const existingBooking = await Booking.findOne({
      ride: rideId,
      user: req.user.userId,
      status: 'confirmed',
    });

    if (existingBooking) {
      return res.status(400).json({ message: 'You have already booked this ride.' });
    }

    const booking = new Booking({
      ride: rideId,
      user: req.user.userId,
      seatsBooked: seats,
      status: 'confirmed',
    });

    ride.availableSeats -= seats;
    await Promise.all([booking.save(), ride.save()]);

    const populated = await Booking.findById(booking._id).populate({
      path: 'ride',
      populate: { path: 'driver', select: 'name email phone avatar' },
    });

    res.status(201).json({ message: 'Ride booked successfully.', booking: populated });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRide,
  getAllRides,
  getMyRides,
  getBookedRides,
  bookRide,
};
