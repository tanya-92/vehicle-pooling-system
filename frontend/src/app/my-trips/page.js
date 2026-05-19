"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { CarFront, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import AppLayout from "../../components/AppLayout";

export default function MyTrips() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get("/rides/booked");
        setBookings(res.data.bookings || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch your trips.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <AppLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">My Trips</h1>
            <p className="text-gray-500 text-lg">Rides you have booked.</p>
          </div>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-[#1f1f1f] transition"
          >
            Find a ride
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-3xl p-6 border h-[220px] animate-pulse"
              />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-gray-100"
          >
            <CarFront className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black mb-2">No trips yet</h3>
            <p className="text-gray-500 mb-8">Search for a ride and book your seat.</p>
            <Link
              href="/search"
              className="inline-flex h-12 px-6 items-center justify-center rounded-full border-2 border-gray-200 font-bold hover:border-black transition"
            >
              Find a ride
            </Link>
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {bookings.map((booking) => {
                const ride = booking.ride;
                if (!ride) return null;
                const departure = new Date(ride.departureTime);
                return (
                  <motion.div
                    key={booking._id}
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col"
                  >
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="text-sm font-bold">{ride.driver?.name || "Host"}</p>
                        <p className="text-xs text-gray-500">{booking.seatsBooked} seat(s)</p>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700 capitalize">
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold">{ride.pickupLocation}</p>
                    <p className="text-sm text-gray-600 mb-4">→ {ride.dropLocation}</p>
                    <p className="text-xs text-gray-500 mt-auto">
                      {departure.toLocaleString()} · ₹{ride.pricePerSeat * booking.seatsBooked} total
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </motion.div>
    </AppLayout>
  );
}
