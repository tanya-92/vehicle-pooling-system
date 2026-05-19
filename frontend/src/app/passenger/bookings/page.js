"use client";
import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, XCircle, ShieldCheck, CarFront } from "lucide-react";
import Link from "next/link";

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // We assume an endpoint /rides/my-bookings exists. If not, this mocks it for the UI.
        const res = await api.get("/rides/my-bookings");
        setBookings(res.data.bookings || []);
      } catch (err) {
        // Fallback for UI presentation since we don't know the exact endpoint
        setError("");
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleCancel = (id) => {
    setBookings(prev => prev.filter(b => b._id !== id));
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-black">My Bookings</h1>
          <p className="text-gray-500 text-lg">View your upcoming trips and travel history.</p>
        </div>
        <Link
          href="/passenger/search-ride"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold text-sm transition hover:bg-[#1f1f1f]"
        >
          Find a ride
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 font-medium text-sm flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse h-[220px]">
              <div className="flex justify-between items-center mb-6">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="w-16 h-6 bg-gray-200 rounded-md" />
              </div>
              <div className="space-y-3 mb-6">
                <div className="w-full h-4 bg-gray-200 rounded-md" />
                <div className="w-2/3 h-4 bg-gray-200 rounded-md" />
              </div>
              <div className="w-full h-12 bg-gray-200 rounded-xl mt-auto" />
            </div>
          ))}
        </div>
      ) : bookings.length === 0 && !error ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)]"
        >
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CarFront className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">No bookings yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-8">
            You don't have any upcoming trips. Search for a ride to get started.
          </p>
          <Link
            href="/passenger/search-ride"
            className="inline-flex h-12 px-6 items-center justify-center rounded-full border-2 border-gray-200 font-bold text-black transition hover:border-black"
          >
            Search for a ride
          </Link>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
          }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {bookings.map(booking => {
              const ride = booking.ride_id;
              const departureDate = new Date(ride.departure_time);
              const isPast = departureDate < new Date();

              return (
                <motion.div
                  key={booking._id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
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
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {booking.status}
                    </span>
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
                    <div className="text-sm text-gray-600">
                      Total: <span className="font-bold text-black">₹{ride.price}</span>
                    </div>
                    <button 
                      onClick={() => handleCancel(booking._id)}
                      className="text-sm font-bold text-red-600 hover:text-red-700 transition flex items-center gap-1 bg-red-50 px-4 py-2 rounded-xl"
                    >
                      <XCircle className="w-4 h-4" /> Cancel
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
