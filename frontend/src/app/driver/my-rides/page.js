"use client";
import { useEffect, useState } from "react";
import api from "../../../../lib/axios";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

export default function MyRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.get("/rides/my-rides");
        setRides(res.data.rides);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch rides.");
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="h-64 rounded-2xl bg-white/40 border border-white/50" />
        <div className="h-64 rounded-2xl bg-white/40 border border-white/50" />
        <div className="h-64 rounded-2xl bg-white/40 border border-white/50" />
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full min-h-screen">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Rides</h1>
          <p className="text-gray-500 mt-2">Manage all the rides you have published.</p>
        </div>
        <Link 
          href="/driver/create-ride"
          className="hidden md:inline-flex bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-2xl"
        >
          Create New Ride
        </Link>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {rides.length === 0 && !error ? (
        <div className="bg-white/20 backdrop-blur-lg border border-dashed border-white/40 rounded-2xl p-12 text-center">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No rides found</h3>
          <p className="text-gray-500 mb-6">You haven&apos;t created any rides yet.</p>
          <Link 
            href="/driver/create-ride"
            className="inline-flex bg-white border border-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-sm"
          >
            Create your first ride
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rides.map(ride => {
            const departureDate = new Date(ride.departure_time);
            const isPast = departureDate < new Date();
            
            return (
              <motion.div whileHover={{ scale: 1.05 }} key={ride._id} className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col">
                <div className={`px-5 py-3 border-b text-xs font-bold uppercase tracking-wider ${
                  isPast ? "bg-gray-50 text-gray-500 border-gray-100" : "bg-blue-50 text-blue-700 border-blue-100"
                }`}>
                  {isPast ? "Completed / Past" : "Upcoming"}
                </div>
                
                <div className="p-5 flex-1">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-3 h-3 rounded-full border-2 border-blue-600"></div>
                      <div className="w-0.5 h-10 bg-gray-200 my-1"></div>
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Pickup</p>
                        <p className="font-medium text-gray-900">{ride.pickup_location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Drop-off</p>
                        <p className="font-medium text-gray-900">{ride.drop_location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-white/50 p-4 rounded-xl border border-white/40">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">
                        {departureDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">
                        {departureDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">
                        {ride.available_seats} {ride.available_seats === 1 ? 'seat' : 'seats'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-800">
                        ₹{ride.price}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
