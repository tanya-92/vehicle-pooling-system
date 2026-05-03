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
      <div className="min-h-screen flex items-center justify-center" style={{ color: "#556B2F" }}>
        <div className="animate-spin">
          <Car className="w-8 h-8" />
        </div>
      </div>
    );
  }

  const upcomingRides = rides.filter(ride => new Date(ride.departure_time) > new Date());

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "#2E2E2E" }}>Driver Dashboard</h1>

      {error && (
        <div className="p-4 rounded-lg border flex items-center gap-3" style={{ backgroundColor: "#FFE5E5", color: "#CC0000", borderColor: "#FFD5D5" }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "#666666" }}>Total Rides</p>
          <p className="text-3xl font-bold" style={{ color: "#556B2F" }}>{rides.length}</p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "#666666" }}>Upcoming Rides</p>
          <p className="text-3xl font-bold" style={{ color: "#556B2F" }}>{upcomingRides.length}</p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <p className="text-sm font-medium mb-1" style={{ color: "#666666" }}>Status</p>
          <p className="font-medium" style={{ color: "#2E2E2E" }}>
            {upcomingRides.length > 0 ? "Active" : "No rides"}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-lg font-bold" style={{ color: "#2E2E2E" }}>Upcoming Rides</h2>
        {upcomingRides.length === 0 ? (
          <div className="p-8 text-center rounded-xl border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC", color: "#666666" }}>
            No upcoming rides
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingRides.slice(0, 5).map(ride => (
              <div key={ride._id} className="p-4 rounded-lg border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: "#2E2E2E" }}>{ride.pickup_location} → {ride.drop_location}</p>
                    <p className="text-sm mt-1" style={{ color: "#666666" }}>
                      {new Date(ride.departure_time).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex gap-4 text-sm">
                    <span style={{ color: "#2E2E2E" }}>{ride.available_seats} seats</span>
                    <span className="font-medium" style={{ color: "#556B2F" }}>₹{ride.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
