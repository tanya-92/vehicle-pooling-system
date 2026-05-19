"use client";
import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import AppLayout from "../../../components/AppLayout";

export default function RidesOffered() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.get("/rides/my-rides");
        setRides(res.data.rides || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch your rides.");
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  return (
    <AppLayout>
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8 space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-black">Rides offered</h1>
            <p className="text-gray-500 text-lg">Trips you are sharing with others.</p>
          </div>
          <Link
            href="/offer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-[#1f1f1f] transition"
          >
            Offer a ride
          </Link>
        </motion.div>

        {error && (
          <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl p-6 border border-gray-100 h-[220px] animate-pulse"
              />
            ))}
          </motion.div>
        ) : rides.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-12 text-center border border-gray-100"
          >
            <MapPin className="w-10 h-10 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-black mb-2">No rides yet</h3>
            <p className="text-gray-500 mb-8">Offer your first ride and start sharing costs.</p>
            <Link
              href="/offer"
              className="inline-flex h-12 px-6 items-center justify-center rounded-full border-2 border-gray-200 font-bold hover:border-black transition"
            >
              Offer a ride
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
              {rides.map((ride) => {
                const departure = new Date(ride.departureTime);
                const isPast = departure < new Date();
                return (
                  <motion.div
                    key={ride._id}
                    variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
                    whileHover={{ y: -4 }}
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm flex flex-col"
                  >
                    <div className="flex justify-between mb-4">
                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                          isPast ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isPast ? "Completed" : "Upcoming"}
                      </span>
                      <span className="text-xl font-bold">₹{ride.pricePerSeat}</span>
                    </div>
                    <p className="text-sm font-bold">{ride.pickupLocation}</p>
                    <p className="text-sm text-gray-600 mb-4">→ {ride.dropLocation}</p>
                    <p className="text-xs text-gray-500 mt-auto">
                      {departure.toLocaleString()} · {ride.availableSeats} seats left
                    </p>
                    {ride.vehicleSnapshot && (
                      <p className="text-xs text-gray-400 mt-2">
                        {ride.vehicleSnapshot.vehicleType} {ride.vehicleSnapshot.vehicleModel}
                      </p>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
