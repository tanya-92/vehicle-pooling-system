"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/axios";
import { motion } from "framer-motion";
import { MapPin, Calendar, Users, DollarSign, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";

export default function CreateRide() {
  const router = useRouter();
  const { user } = useAuth();
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

  useEffect(() => {
    // If the user hasn't gone through onboarding (no local flag and no profile)
    if (user && !user.driver_profile && !localStorage.getItem("hasDriverProfile")) {
      router.push("/driver/onboarding");
    }
  }, [user, router]);

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
    <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-2xl mx-auto space-y-6"
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-black">Create a Ride</h1>
          <p className="text-gray-500 text-lg">Publish your route to find passengers.</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 font-medium text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl border border-green-100 bg-green-50 text-green-600 font-medium text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 bg-white space-y-6">
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">From</label>
              <input
                type="text"
                name="pickup_location"
                required
                value={formData.pickup_location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="Main Gate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">To</label>
              <input
                type="text"
                name="drop_location"
                required
                value={formData.drop_location}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="Jalandhar City"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Departure</label>
            <input
              type="datetime-local"
              name="departure_time"
              required
              value={formData.departure_time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Seats</label>
              <input
                type="number"
                name="available_seats"
                min="1"
                required
                value={formData.available_seats}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                placeholder="50"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl bg-black text-white font-bold text-base transition hover:bg-[#1f1f1f] flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Publishing
              </>
            ) : (
              "Publish Ride"
            )}
          </motion.button>
        </div>
      </form>
      </motion.div>
    </div>
  );
}
