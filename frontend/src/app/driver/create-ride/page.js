"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/axios";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, DollarSign, Loader2, ArrowRight } from "lucide-react";

export default function CreateRide() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    pickup_location: "",
    drop_location: "",
    departure_time: "",
    available_seats: 1,
    price: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post("/rides/create", formData);
      setSuccess("Ride created successfully!");
      setTimeout(() => {
        router.push("/driver/my-rides");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full min-h-screen"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Create a Ride</h1>
        <p className="text-gray-500 mt-2">Publish your route to find passengers for your journey.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-100">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white/20 backdrop-blur-lg p-6 md:p-8 rounded-2xl shadow-lg border border-white/30 transition-all duration-300">
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            <div className="absolute left-[calc(50%-14px)] top-[28px] hidden md:flex items-center justify-center bg-white border rounded-full w-7 h-7 z-10 text-gray-400">
              <ArrowRight className="w-4 h-4" />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="pickup_location"
                  required
                  value={formData.pickup_location}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-shadow outline-none text-gray-900 bg-white/70"
                  placeholder="e.g. Main Gate"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Drop Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="drop_location"
                  required
                  value={formData.drop_location}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-shadow outline-none text-gray-900 bg-white/70"
                  placeholder="e.g. Jalandhar City"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Departure Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="datetime-local"
                name="departure_time"
                required
                value={formData.departure_time}
                onChange={handleChange}
                className="pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-shadow outline-none text-gray-900 bg-white/70"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Available Seats</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Users className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="available_seats"
                  min="1"
                  required
                  value={formData.available_seats}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-shadow outline-none text-gray-900 bg-white/70"
                  placeholder="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  name="price"
                  min="0"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  className="pl-10 w-full p-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-shadow outline-none text-gray-900 bg-white/70"
                  placeholder="e.g. 50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t">
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-xl transition-all duration-300 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Publishing...
              </>
            ) : (
              "Publish Ride"
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
