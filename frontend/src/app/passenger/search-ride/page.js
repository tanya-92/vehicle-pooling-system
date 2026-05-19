"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../../lib/axios";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  CarFront,
  ArrowRight,
  User,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

const pageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function SearchRide() {
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    pickup_location: "",
    drop_location: "",
    date: ""
  });

  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    // Extract query params and auto-search if they exist
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";

    if (from || to || date) {
      setFormData({ pickup_location: from, drop_location: to, date: date });
      performSearch(from, to, date);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    performSearch(formData.pickup_location, formData.drop_location, formData.date);
  };

  const performSearch = async (pickup, drop, travelDate) => {
    setLoading(true);
    setError("");
    setHasSearched(true);
    setSelectedRide(null);
    setBookingSuccess(false);

    try {
      const params = new URLSearchParams();
      if (pickup) params.append("pickup_location", pickup);
      if (drop) params.append("drop_location", drop);
      if (travelDate) params.append("date", travelDate);

      const res = await api.get(`/rides/all?${params.toString()}`);
      setRides(res.data.rides || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search rides.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmBooking = () => {
    // Placeholder for actual booking logic
    setBookingSuccess(true);
    setTimeout(() => {
      setSelectedRide(null);
      setBookingSuccess(false);
    }, 2500);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-black tracking-tight">Find your next ride</h1>
        <p className="text-gray-500 text-lg">Search thousands of routes and travel with verified peers.</p>
      </div>

      {/* Search Bar - Modern Black/White UI */}
      <motion.form
        onSubmit={handleSearchClick}
        className="bg-white rounded-3xl p-2 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col lg:flex-row items-center gap-2 relative z-20"
      >
        <div className="flex w-full flex-col lg:flex-row flex-1 border border-gray-200 lg:border-none rounded-2xl lg:rounded-none overflow-hidden">
          <div className="flex flex-1 items-center gap-3 bg-white px-4 py-4 lg:border-r border-gray-200 border-b lg:border-b-0 hover:bg-gray-50 transition-colors">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              name="pickup_location"
              value={formData.pickup_location}
              onChange={handleChange}
              placeholder="Leaving from"
              className="w-full bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-1 items-center gap-3 bg-white px-4 py-4 lg:border-r border-gray-200 border-b lg:border-b-0 hover:bg-gray-50 transition-colors">
            <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="text"
              name="drop_location"
              value={formData.drop_location}
              onChange={handleChange}
              placeholder="Going to"
              className="w-full bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-gray-500"
            />
          </div>

          <div className="flex flex-1 items-center gap-3 bg-white px-4 py-4 hover:bg-gray-50 transition-colors">
            <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full bg-transparent text-base font-medium outline-none text-gray-700"
            />
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full lg:w-auto h-16 px-10 rounded-2xl bg-black text-white font-bold text-base transition hover:bg-[#1f1f1f] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Searching..." : "Search"}
        </motion.button>
      </motion.form>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3 font-medium">
          <ShieldCheck className="w-5 h-5 text-red-500" />
          {error}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse h-[220px]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full" />
                  <div className="w-24 h-4 bg-gray-200 rounded-md" />
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded-md" />
              </div>
              <div className="space-y-3 mb-6">
                <div className="w-full h-4 bg-gray-200 rounded-md" />
                <div className="w-2/3 h-4 bg-gray-200 rounded-md" />
              </div>
              <div className="w-full h-12 bg-gray-200 rounded-xl" />
            </div>
          ))}
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !loading && !error && (
        <div className="pt-4">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-black">
              {rides.length} {rides.length === 1 ? 'ride' : 'rides'} available
            </h2>
            <div className="text-sm text-gray-500 font-medium">
              Sorted by earliest departure
            </div>
          </div>

          {rides.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
            >
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CarFront className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-black mb-2">No rides available</h3>
              <p className="text-gray-500 max-w-sm mx-auto mb-8">
                We couldn't find any rides matching your search. Try adjusting your dates or expanding your search area.
              </p>
              <button
                onClick={() => setFormData({ pickup_location: "", drop_location: "", date: "" })}
                className="inline-flex h-12 px-6 items-center justify-center rounded-full border-2 border-gray-200 font-bold text-black transition hover:border-black"
              >
                Clear Search
              </button>
            </motion.div>
          ) : (
            <motion.div variants={cardContainerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rides.map(ride => {
                const departureDate = new Date(ride.departure_time);

                return (
                  <motion.div
                    key={ride._id}
                    variants={cardVariants}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-[0_4px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] transition-all flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#f3f3f3] border border-gray-200 flex items-center justify-center">
                          <span className="text-sm font-bold text-black">
                            {ride.driver_id?.name?.charAt(0).toUpperCase() || 'D'}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-black leading-none">{ride.driver_id?.name || 'Driver'}</p>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500 font-medium">
                            <ShieldCheck className="w-3 h-3 text-green-600" />
                            Verified
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-black">₹{ride.price}</p>
                        <p className="text-xs text-gray-500 font-medium">per seat</p>
                      </div>
                    </div>

                    <div className="flex-1 relative pl-6 border-l-2 border-gray-100 space-y-6 mb-8 ml-2">
                      <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-black border-2 border-white" />
                        <p className="text-sm font-bold text-black leading-none">{departureDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                        <p className="text-sm text-gray-600 mt-1">{ride.pickup_location}</p>
                      </div>
                      <div className="relative">
                        <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-white border-2 border-black" />
                        <p className="text-sm text-gray-600">{ride.drop_location}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full">
                        <User className="w-4 h-4" />
                        {ride.available_seats} left
                      </div>
                      <button
                        onClick={() => setSelectedRide(ride)}
                        className="text-sm font-bold text-black hover:text-gray-600 transition flex items-center gap-1"
                      >
                        Book now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </div>
      )}

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {selectedRide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl overflow-hidden"
            >
              {bookingSuccess ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-black mb-2">Request Sent!</h3>
                  <p className="text-gray-500">The driver will review your booking request shortly.</p>
                </motion.div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-black mb-6">Confirm your ride</h3>

                  <div className="bg-[#f9f9f9] rounded-2xl p-4 mb-6 space-y-4 border border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Driver</span>
                      <span className="text-sm font-bold text-black">{selectedRide.driver_id?.name || 'Driver'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Route</span>
                      <span className="text-sm font-bold text-black truncate max-w-[200px]">
                        {selectedRide.pickup_location} → {selectedRide.drop_location}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">Time</span>
                      <span className="text-sm font-bold text-black">
                        {new Date(selectedRide.departure_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                      <span className="text-base text-gray-600 font-bold">Total Price</span>
                      <span className="text-xl font-bold text-black">₹{selectedRide.price}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedRide(null)}
                      className="flex-1 py-4 rounded-xl font-bold transition hover:bg-gray-100 border-2 border-transparent"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      className="flex-1 py-4 rounded-xl bg-black text-white font-bold transition hover:bg-[#1f1f1f]"
                    >
                      Request Seat
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
