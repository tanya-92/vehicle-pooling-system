"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../../lib/axios";
import {
  MapPin,
  Calendar,
  CarFront,
  ArrowRight,
  User,
  ShieldCheck,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import AppLayout from "../../components/AppLayout";

function SearchRideContent() {
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    date: "",
  });
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState("");
  const [selectedRide, setSelectedRide] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const performSearch = async (pickup, drop, travelDate) => {
    setLoading(true);
    setError("");
    setHasSearched(true);
    setSelectedRide(null);
    setBookingSuccess(false);

    try {
      const params = new URLSearchParams();
      if (pickup) params.append("pickupLocation", pickup);
      if (drop) params.append("dropLocation", drop);
      if (travelDate) params.append("date", travelDate);
      const res = await api.get(`/rides/all?${params.toString()}`);
      setRides(res.data.rides || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to search rides.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";
    if (from || to || date) {
      setFormData({ pickupLocation: from, dropLocation: to, date });
      performSearch(from, to, date);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = (e) => {
    e.preventDefault();
    performSearch(formData.pickupLocation, formData.dropLocation, formData.date);
  };

  const handleConfirmBooking = async () => {
    if (!selectedRide) return;
    setBookingLoading(true);
    try {
      await api.post("/rides/book", { rideId: selectedRide._id, seatsBooked: 1 });
      setBookingSuccess(true);
      setRides((prev) =>
        prev.map((r) =>
          r._id === selectedRide._id
            ? { ...r, availableSeats: Math.max(0, r.availableSeats - 1) }
            : r
        )
      );
      setTimeout(() => {
        setSelectedRide(null);
        setBookingSuccess(false);
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed.");
      setSelectedRide(null);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8"
      >
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-3xl font-bold text-black tracking-tight">Find a ride</h1>
          <p className="text-gray-500 text-lg">Search routes and book a seat instantly.</p>
        </motion.div>

        <motion.form
          onSubmit={handleSearchClick}
          className="bg-white rounded-3xl p-2 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col lg:flex-row gap-2"
        >
          <motion.div className="flex flex-1 flex-col lg:flex-row border border-gray-200 lg:border-none rounded-2xl lg:rounded-none overflow-hidden">
            <div className="flex flex-1 items-center gap-3 px-4 py-4 lg:border-r border-gray-200 border-b lg:border-b-0">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="text"
                name="pickupLocation"
                value={formData.pickupLocation}
                onChange={handleChange}
                placeholder="Leaving from"
                className="w-full bg-transparent text-base font-medium outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-3 px-4 py-4 lg:border-r border-gray-200 border-b lg:border-b-0">
              <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="text"
                name="dropLocation"
                value={formData.dropLocation}
                onChange={handleChange}
                placeholder="Going to"
                className="w-full bg-transparent text-base font-medium outline-none"
              />
            </div>
            <div className="flex flex-1 items-center gap-3 px-4 py-4">
              <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-transparent text-base font-medium outline-none"
              />
            </div>
          </motion.div>
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="h-14 px-10 rounded-2xl bg-black text-white font-bold disabled:opacity-70"
          >
            {loading ? "Searching..." : "Search"}
          </motion.button>
        </motion.form>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5" />
            {error}
          </div>
        )}

        {hasSearched && !loading && !error && (
          <div>
            <h2 className="text-xl font-bold mb-6">
              {rides.length} {rides.length === 1 ? "ride" : "rides"} available
            </h2>
            {rides.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border">
                <CarFront className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No rides match your search. Try different dates or routes.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rides.map((ride) => {
                  const departure = new Date(ride.departureTime);
                  return (
                    <motion.div
                      key={ride._id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ y: -4 }}
                      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col"
                    >
                      <motion.div className="flex justify-between mb-4">
                        <div>
                          <p className="text-sm font-bold">{ride.driver?.name || "Host"}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-green-600" /> Verified
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold">₹{ride.pricePerSeat}</p>
                          <p className="text-xs text-gray-500">per seat</p>
                        </div>
                      </motion.div>
                      <p className="text-sm font-bold">{ride.pickupLocation}</p>
                      <p className="text-sm text-gray-600 mb-4">→ {ride.dropLocation}</p>
                      <p className="text-xs text-gray-500 mb-4">{departure.toLocaleString()}</p>
                      <div className="flex items-center justify-between mt-auto pt-4 border-t">
                        <span className="text-sm flex items-center gap-1 text-gray-600">
                          <User className="w-4 h-4" />
                          {ride.availableSeats} left
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedRide(ride)}
                          className="text-sm font-bold flex items-center gap-1 hover:text-gray-600"
                        >
                          Book <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        <AnimatePresence>
          {selectedRide && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
              >
                {bookingSuccess ? (
                  <div className="text-center py-6">
                    <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Booked!</h3>
                    <p className="text-gray-500 mt-2">Your seat is confirmed.</p>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold mb-6">Confirm booking</h3>
                    <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2 text-sm">
                      <p>
                        <span className="text-gray-500">Host: </span>
                        <strong>{selectedRide.driver?.name}</strong>
                      </p>
                      <p>
                        <span className="text-gray-500">Route: </span>
                        <strong>
                          {selectedRide.pickupLocation} → {selectedRide.dropLocation}
                        </strong>
                      </p>
                      <p className="text-lg font-bold pt-2">₹{selectedRide.pricePerSeat}</p>
                    </div>
                    <motion.div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedRide(null)}
                        className="flex-1 py-3 rounded-xl font-bold hover:bg-gray-100"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        disabled={bookingLoading}
                        className="flex-1 py-3 rounded-xl bg-black text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {bookingLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Confirm"}
                      </button>
                    </motion.div>
                  </>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </AppLayout>
  );
}

export default function SearchRide() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <SearchRideContent />
    </Suspense>
  );
}
