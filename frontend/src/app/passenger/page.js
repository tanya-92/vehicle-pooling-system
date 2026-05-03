"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, MapPin, ShieldCheck, Clock } from "lucide-react";

export default function PassengerDashboard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full space-y-8"
    >
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" style={{ color: "#2E2E2E" }}>Passenger Dashboard</h1>
        <p style={{ color: "#666666" }}>Ready to find your next ride?</p>
      </div>

      <div className="p-6 sm:p-8 rounded-xl shadow-sm border text-center" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
        <h2 className="text-xl font-bold mb-3" style={{ color: "#2E2E2E" }}>Where to next?</h2>
        <p className="mb-6" style={{ color: "#666666" }}>Find affordable rides shared by your peers.</p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            href="/passenger/search-ride"
            className="inline-block px-6 py-3 rounded-lg font-medium text-white transition-colors"
            style={{ backgroundColor: "#556B2F" }}
            onMouseEnter={(e) => e.target.style.opacity = "0.9"}
            onMouseLeave={(e) => e.target.style.opacity = "1"}
          >
            <Search className="w-5 h-5 inline-block mr-2" />
            Find a Ride
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl shadow-sm border text-center" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#F0F0E8", color: "#556B2F" }}>
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: "#2E2E2E" }}>Convenient</h3>
          <p className="text-sm" style={{ color: "#666666" }}>Rides matching your route.</p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border text-center" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#F0F0E8", color: "#556B2F" }}>
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: "#2E2E2E" }}>Fast</h3>
          <p className="text-sm" style={{ color: "#666666" }}>Book rides on your schedule.</p>
        </div>

        <div className="p-6 rounded-xl shadow-sm border text-center" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "#F0F0E8", color: "#556B2F" }}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-semibold mb-2" style={{ color: "#2E2E2E" }}>Secure</h3>
          <p className="text-sm" style={{ color: "#666666" }}>Verified community members.</p>
        </div>
      </div>
    </motion.div>
  );
}
