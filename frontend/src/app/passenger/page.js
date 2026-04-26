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
      className="w-full min-h-screen"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Passenger Dashboard</h1>
        <p className="text-gray-500 mt-2">Welcome! Ready to find your next ride?</p>
      </div>

      <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 overflow-hidden mb-8 transition-all duration-300 hover:shadow-2xl">
        <div className="bg-emerald-50/70 p-8 md:p-12 text-center relative">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-emerald-100 rounded-full opacity-50 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Where to next?</h2>
            <p className="text-emerald-800 mb-8">
              Find affordable and convenient rides shared by your peers. Enter your pickup and drop locations to get started.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              href="/passenger/search-ride"
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-2xl"
            >
              <Search className="w-5 h-5" /> Find a Ride Now
            </Link>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
            <MapPin className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Convenient Routes</h3>
          <p className="text-gray-500 text-sm">Find rides that match your exact pickup and drop-off preferences.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Save Time</h3>
          <p className="text-gray-500 text-sm">No more waiting for public transport. Book a ride that fits your schedule.</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} className="bg-white/20 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-white/30 flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl">
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4 text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Safe & Secure</h3>
          <p className="text-gray-500 text-sm">Travel with verified members of your community for peace of mind.</p>
        </motion.div>
      </div>
    </motion.div>
  );
}
