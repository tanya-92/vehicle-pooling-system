"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import api from "../../../../lib/axios";
import { Search, MapPin, Calendar, Users, DollarSign, Clock, CheckCircle, Car } from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function SearchRide() {
  const [formData, setFormData] = useState({
    pickup_location: "",
    drop_location: "",
    date: ""
  });

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [ripples, setRipples] = useState([]);

  const [selectedRide, setSelectedRide] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setHasSearched(true);
    setSelectedRide(null);

    try {
      const params = new URLSearchParams();
      if (formData.pickup_location) params.append("pickup_location", formData.pickup_location);
      if (formData.drop_location) params.append("drop_location", formData.drop_location);
      if (formData.date) params.append("date", formData.date);

      const res = await api.get(`/rides/all?${params.toString()}`);
      setRides(res.data.rides);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search rides.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRide = (ride) => {
    setSelectedRide(ride);
  };

  const handleConfirmBooking = () => {
    alert("Booking confirmed! (This is a placeholder UI)");
    setSelectedRide(null);
    // Real implementation would call a POST /bookings endpoint here.
  };

  const createRipple = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    const ripple = { x, y, size, id: Date.now() + Math.random() };
    setRipples((prev) => [...prev, ripple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((item) => item.id !== ripple.id));
    }, 500);
  };

  const SkeletonCard = () => (
    <div className="bg-white/30 backdrop-blur-lg border border-white/40 rounded-2xl p-5 shadow-lg animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="h-4 w-24 bg-white/60 rounded" />
        <div className="h-4 w-16 bg-white/60 rounded" />
      </div>
      <div className="space-y-3 mb-5">
        <div className="h-3 w-full bg-white/60 rounded" />
        <div className="h-3 w-5/6 bg-white/60 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="h-10 bg-white/60 rounded-xl" />
        <div className="h-10 bg-white/60 rounded-xl" />
      </div>
      <div className="h-10 bg-white/60 rounded-xl" />
    </div>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="w-full min-h-screen px-4 md:px-8 lg:px-12 py-6 md:py-8 space-y-8 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Search for a Ride</h1>
        <p className="text-gray-500 mt-2">Enter your route and date to find available rides.</p>
      </div>

      {/* Search Form */}
      <motion.form
        onSubmit={handleSearch}
        variants={cardVariants}
        className="bg-white/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/30 shadow-lg transition-all duration-300"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="pickup_location"
                value={formData.pickup_location}
                onChange={handleChange}
                className="peer pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all outline-none text-gray-900 bg-white/60"
                placeholder="Any location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Drop Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="drop_location"
                value={formData.drop_location}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all outline-none text-gray-900 bg-white/60"
                placeholder="Any location"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="date"
                name="date"
                required
                value={formData.date}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-all outline-none text-gray-900 bg-white/60"
              />
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={createRipple}
            className={`relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl transition-all duration-300 ease-in-out font-medium flex items-center justify-center gap-2 shadow-lg w-full md:w-auto ${
              loading ? "opacity-80 cursor-not-allowed" : "hover:shadow-2xl"
            }`}
          >
            {ripples.map((ripple) => (
              <span
                key={ripple.id}
                className="absolute rounded-full bg-white/40 pointer-events-none animate-ripple"
                style={{
                  left: ripple.x,
                  top: ripple.y,
                  width: ripple.size,
                  height: ripple.size,
                }}
              />
            ))}
            <Search className="w-5 h-5 relative z-10" />
            {loading ? "Searching..." : "Search Rides"}
          </motion.button>
        </div>
      </motion.form>

      {/* Error State */}
      {error && (
        <div className="bg-red-100/70 text-red-700 p-4 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <SkeletonCard key={item} />
          ))}
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !loading && !error && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900">
            {rides.length} {rides.length === 1 ? 'Ride' : 'Rides'} Found
          </h2>

          {rides.length === 0 ? (
            <div className="bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl p-12 text-center">
              <Car className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No rides available for selected date</h3>
              <p className="text-gray-600">Try adjusting your search criteria or date to find more options.</p>
            </div>
          ) : (
            <motion.div variants={cardContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rides.map(ride => {
                const departureDate = new Date(ride.departure_time);
                const isSelected = selectedRide?._id === ride._id;

                return (
                  <motion.div
                    key={ride._id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.05 }}
                    className={`bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ease-in-out ${isSelected ? "ring-2 ring-blue-400 shadow-2xl" : "hover:shadow-2xl"
                      }`}
                  >
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-sm">
                            {ride.driver_id?.name?.charAt(0).toUpperCase() || 'D'}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{ride.driver_id?.name || 'Driver'}</p>
                            <p className="text-xs text-gray-500">Driver</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-blue-600">₹{ride.price}</p>
                          <p className="text-xs text-gray-500">per seat</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 mb-6">
                        <div className="flex flex-col items-center mt-1">
                          <div className="w-3 h-3 rounded-full border-2 border-gray-400"></div>
                          <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
                          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        </div>
                        <div className="flex-1 space-y-3">
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{ride.pickup_location}</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm">{ride.drop_location}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-white/50 p-3 rounded-xl border border-white/60 mb-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-800">
                            {departureDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span className="text-sm font-medium text-gray-800">
                            {ride.available_seats} seats left
                          </span>
                        </div>
                      </div>

                      <motion.button
                        onClick={() => handleSelectRide(ride)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-full py-2.5 rounded-xl font-medium transition-all duration-300 ${isSelected
                          ? "bg-blue-100/80 text-blue-700 border border-blue-200"
                          : "bg-white/70 border border-white text-gray-700 hover:bg-white"
                          }`}
                      >
                        {isSelected ? "Selected" : "Select Ride"}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}

      {/* Confirmation UI (Visible only when a ride is selected) */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-emerald-600 p-6 text-white flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Confirm Booking
                </h3>
                <p className="text-emerald-100 text-sm mt-1">Review ride details before confirming.</p>
              </div>
              <button
                onClick={() => setSelectedRide(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-700 hover:bg-emerald-800 transition-colors"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Route</p>
                    <p className="text-gray-900 font-medium">{selectedRide.pickup_location} &rarr; {selectedRide.drop_location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Departure Time</p>
                    <p className="text-gray-900 font-medium">
                      {new Date(selectedRide.departure_time).toLocaleString(undefined, {
                        weekday: 'long', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Car className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Driver</p>
                    <p className="text-gray-900 font-medium">{selectedRide.driver_id?.name || 'Driver'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <DollarSign className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Price</p>
                    <p className="text-gray-900 font-bold text-lg">₹{selectedRide.price}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  onClick={() => setSelectedRide(null)}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={handleConfirmBooking}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-medium transition-colors shadow-md"
                >
                  Confirm Booking
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
