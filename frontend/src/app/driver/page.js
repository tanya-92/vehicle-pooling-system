"use client";
import { useEffect, useState } from "react";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { Car, CalendarClock, TrendingUp, AlertCircle, Loader2 } from "lucide-react";

export default function DriverDashboard() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await api.get("/rides/my-rides");
        setRides(res.data.rides);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchRides();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        <div className="h-36 rounded-2xl bg-white/40 border border-white/50" />
        <div className="h-36 rounded-2xl bg-white/40 border border-white/50" />
        <div className="h-36 rounded-2xl bg-white/40 border border-white/50 md:col-span-2 lg:col-span-1" />
      </div>
    );
  }

  const upcomingRides = rides.filter(ride => new Date(ride.departure_time) > new Date());
  
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 tracking-tight">Driver Dashboard</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Car className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-700">Total Rides Created</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{rides.length}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <CalendarClock className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-700">Upcoming Rides</h3>
          </div>
          <p className="text-4xl font-bold text-gray-900">{upcomingRides.length}</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 hover:shadow-2xl transition-all duration-300 md:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-700">Status</h3>
          </div>
          <p className="text-lg font-medium text-gray-900">
            {upcomingRides.length > 0 ? "Active driver" : "No active rides"}
          </p>
        </motion.div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Rides Overview</h2>
        {upcomingRides.length === 0 ? (
          <div className="bg-white/20 backdrop-blur-lg border border-dashed border-white/40 rounded-2xl p-8 text-center text-gray-600">
            You don&apos;t have any upcoming rides.
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                    <th className="p-4 font-medium">Route</th>
                    <th className="p-4 font-medium">Departure</th>
                    <th className="p-4 font-medium">Seats</th>
                    <th className="p-4 font-medium">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {upcomingRides.slice(0, 5).map(ride => (
                    <tr key={ride._id} className="hover:bg-white/40 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-gray-900">{ride.pickup_location}</div>
                        <div className="text-sm text-gray-500">&rarr; {ride.drop_location}</div>
                      </td>
                      <td className="p-4 text-gray-700">
                        {new Date(ride.departure_time).toLocaleString(undefined, {
                          dateStyle: 'short', timeStyle: 'short'
                        })}
                      </td>
                      <td className="p-4 text-gray-700">{ride.available_seats}</td>
                      <td className="p-4 font-medium text-gray-900">₹{ride.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
