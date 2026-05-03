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
      <div className="flex items-center justify-center min-h-screen" style={{ color: "#556B2F" }}>
        <div className="animate-spin">
          <MapPin className="w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full space-y-6">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold" style={{ color: "#2E2E2E" }}>My Rides</h1>
          <p style={{ color: "#666666" }}>Manage your published rides.</p>
        </div>
        <Link
          href="/driver/create-ride"
          className="hidden sm:inline-block px-4 py-2 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: "#556B2F" }}
          onMouseEnter={(e) => e.target.style.opacity = "0.9"}
          onMouseLeave={(e) => e.target.style.opacity = "1"}
        >
          + Create
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#FFE5E5", color: "#CC0000", borderColor: "#FFD5D5" }}>
          {error}
        </div>
      )}

      {rides.length === 0 && !error ? (
        <div className="p-12 text-center rounded-xl border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <MapPin className="w-10 h-10 mx-auto mb-3" style={{ color: "#C5C5B0" }} />
          <h3 className="font-medium mb-1" style={{ color: "#2E2E2E" }}>No rides yet</h3>
          <p className="text-sm mb-4" style={{ color: "#666666" }}>Create your first ride to get started.</p>
          <Link
            href="/driver/create-ride"
            className="inline-block px-4 py-2 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: "#556B2F" }}
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            Create Ride
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rides.map(ride => {
            const departureDate = new Date(ride.departure_time);
            const isPast = departureDate < new Date();

            return (
              <motion.div whileHover={{ scale: 1.02 }} key={ride._id} className="p-4 rounded-lg border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-xs font-semibold px-2 py-1 rounded" style={{ backgroundColor: isPast ? "#F0F0E8" : "#F0F0E8", color: isPast ? "#999999" : "#556B2F" }}>
                    {isPast ? "Past" : "Upcoming"}
                  </span>
                </div>

                <p className="font-medium mb-2" style={{ color: "#2E2E2E" }}>
                  {ride.pickup_location} → {ride.drop_location}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <div>
                    <p style={{ color: "#999999" }}>Date</p>
                    <p style={{ color: "#2E2E2E" }}>{departureDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</p>
                  </div>
                  <div>
                    <p style={{ color: "#999999" }}>Time</p>
                    <p style={{ color: "#2E2E2E" }}>{departureDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  <div>
                    <p style={{ color: "#999999" }}>Seats</p>
                    <p style={{ color: "#2E2E2E" }}>{ride.available_seats}</p>
                  </div>
                  <div>
                    <p style={{ color: "#999999" }}>Price</p>
                    <p className="font-medium" style={{ color: "#556B2F" }}>₹{ride.price}</p>
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
