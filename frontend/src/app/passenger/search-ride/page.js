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
      className="w-full space-y-6"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold" style={{ color: "#2E2E2E" }}>Find a Ride</h1>
        <p style={{ color: "#666666" }}>Enter your route and date.</p>
      </div>

      {/* Search Form */}
      <motion.form
        onSubmit={handleSearch}
        variants={cardVariants}
        className="p-6 rounded-xl shadow-sm border space-y-4"
        style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>From</label>
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
              style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
              onFocus={(e) => e.target.style.borderColor = "#556B2F"}
              onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
              placeholder="Location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>To</label>
            <input
              type="text"
              name="drop_location"
              value={formData.drop_location}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
              style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
              onFocus={(e) => e.target.style.borderColor = "#556B2F"}
              onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
              placeholder="Location"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>Date</label>
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
              style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
              onFocus={(e) => e.target.style.borderColor = "#556B2F"}
              onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2.5 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2"
          style={{ backgroundColor: "#556B2F" }}
        >
          <Search className="w-5 h-5" />
          {loading ? "Searching..." : "Search"}
        </motion.button>
      </motion.form>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#FFE5E5", color: "#CC0000", borderColor: "#FFD5D5" }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-40 rounded-lg animate-pulse" style={{ backgroundColor: "#F0F0E8" }} />
          ))}
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !loading && !error && (
        <div className="space-y-4">
          <h2 className="font-bold" style={{ color: "#2E2E2E" }}>
            {rides.length} {rides.length === 1 ? 'Ride' : 'Rides'} Found
          </h2>

          {rides.length === 0 ? (
            <div className="p-12 text-center rounded-lg border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
              <Car className="w-10 h-10 mx-auto mb-3" style={{ color: "#C5C5B0" }} />
              <h3 className="font-medium mb-1" style={{ color: "#2E2E2E" }}>No rides found</h3>
              <p style={{ color: "#666666" }}>Try adjusting your search.</p>
            </div>
          ) : (
            <motion.div variants={cardContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {rides.map(ride => {
                const departureDate = new Date(ride.departure_time);
                const isSelected = selectedRide?._id === ride._id;

                return (
                  <motion.div
                    key={ride._id}
                    variants={cardVariants}
                    whileHover={{ scale: 1.02 }}
                    className="p-4 rounded-lg border cursor-pointer transition-all"
                    style={{
                      backgroundColor: isSelected ? "#F0F0E8" : "#FAF9F6",
                      borderColor: isSelected ? "#556B2F" : "#E5E5DC"
                    }}
                    onClick={() => handleSelectRide(ride)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: "#F0F0E8", color: "#556B2F" }}>
                          {ride.driver_id?.name?.charAt(0).toUpperCase() || 'D'}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "#2E2E2E" }}>{ride.driver_id?.name || 'Driver'}</p>
                        </div>
                      </div>
                      <p className="font-bold" style={{ color: "#556B2F" }}>₹{ride.price}</p>
                    </div>

                    <p className="text-sm font-medium mb-2" style={{ color: "#2E2E2E" }}>
                      {ride.pickup_location} → {ride.drop_location}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                      <span style={{ color: "#666666" }}>{departureDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                      <span style={{ color: "#666666" }}>{ride.available_seats} seats</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectRide(ride);
                      }}
                      className="w-full py-2 rounded-lg font-medium text-sm transition-colors"
                      style={{
                        backgroundColor: isSelected ? "#556B2F" : "#F0F0E8",
                        color: isSelected ? "white" : "#2E2E2E"
                      }}
                    >
                      {isSelected ? "Selected" : "Select"}
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}

      {/* Confirmation UI */}
      {selectedRide && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            style={{ backgroundColor: "#FAF9F6" }}
          >
            <div className="p-6 text-center space-y-4">
              <h3 className="text-lg font-bold" style={{ color: "#2E2E2E" }}>Confirm Ride</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p style={{ color: "#666666" }}>Route</p>
                  <p className="font-medium" style={{ color: "#2E2E2E" }}>{selectedRide.pickup_location} → {selectedRide.drop_location}</p>
                </div>

                <div>
                  <p style={{ color: "#666666" }}>Time</p>
                  <p className="font-medium" style={{ color: "#2E2E2E" }}>
                    {new Date(selectedRide.departure_time).toLocaleString(undefined, {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>

                <div>
                  <p style={{ color: "#666666" }}>Driver</p>
                  <p className="font-medium" style={{ color: "#2E2E2E" }}>{selectedRide.driver_id?.name || 'Driver'}</p>
                </div>

                <div>
                  <p style={{ color: "#666666" }}>Price</p>
                  <p className="text-lg font-bold" style={{ color: "#556B2F" }}>₹{selectedRide.price}</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setSelectedRide(null)}
                  className="flex-1 py-2.5 rounded-lg font-medium transition-colors"
                  style={{ backgroundColor: "#F0F0E8", color: "#2E2E2E" }}
                  onMouseEnter={(e) => e.target.style.opacity = "0.8"}
                  onMouseLeave={(e) => e.target.style.opacity = "1"}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBooking}
                  className="flex-1 py-2.5 rounded-lg font-medium text-white transition-colors"
                  style={{ backgroundColor: "#556B2F" }}
                  onMouseEnter={(e) => e.target.style.opacity = "0.9"}
                  onMouseLeave={(e) => e.target.style.opacity = "1"}
                >
                  Confirm
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
