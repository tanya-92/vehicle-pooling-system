"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "../../../../lib/axios";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { hasVehicleInfo } from "../../../../lib/user";
import AppLayout from "../../../components/AppLayout";

export default function CreateRide() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    pickupLocation: "",
    dropLocation: "",
    departureTime: "",
    availableSeats: 1,
    pricePerSeat: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!hasVehicleInfo(user)) {
      router.replace("/vehicle-setup?next=/rides/create");
    } else if (user.vehicleInfo?.seatsAvailable) {
      setFormData((prev) => ({
        ...prev,
        availableSeats: Math.min(prev.availableSeats, user.vehicleInfo.seatsAvailable),
      }));
    }
  }, [user, loading, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/rides/create", formData);
      setSuccess("Ride published successfully!");
      setTimeout(() => router.push("/rides/offered"), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create ride.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  const maxSeats = user.vehicleInfo?.seatsAvailable || 4;

  return (
    <AppLayout>
      <div className="w-full max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-10 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl mx-auto space-y-6"
        >
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h1 className="text-3xl font-bold tracking-tight text-black">Offer a ride</h1>
            <p className="text-gray-500 text-lg mt-1">
              Share your route — your vehicle details are already saved.
            </p>
            {user.vehicleInfo && (
              <p className="text-sm text-gray-500 mt-2">
                {user.vehicleInfo.vehicleType} {user.vehicleInfo.vehicleModel} ·{" "}
                {user.vehicleInfo.vehicleNumber}
              </p>
            )}
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl border border-red-100 bg-red-50 text-red-600 font-medium text-sm"
            >
              {error}
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl border border-green-100 bg-green-50 text-green-600 font-medium text-sm"
            >
              {success}
            </motion.div>
          )}

          <motion.form
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            onSubmit={handleSubmit}
            className="p-8 rounded-3xl shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 bg-white space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">From</label>
                <input
                  type="text"
                  name="pickupLocation"
                  required
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none"
                  placeholder="Main Gate"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">To</label>
                <input
                  type="text"
                  name="dropLocation"
                  required
                  value={formData.dropLocation}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none"
                  placeholder="Jalandhar City"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Departure</label>
              <input
                type="datetime-local"
                name="departureTime"
                required
                value={formData.departureTime}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Seats</label>
                <input
                  type="number"
                  name="availableSeats"
                  min="1"
                  max={maxSeats}
                  required
                  value={formData.availableSeats}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Price per seat (₹)</label>
                <input
                  type="number"
                  name="pricePerSeat"
                  min="0"
                  required
                  value={formData.pricePerSeat}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none"
                  placeholder="50"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-xl bg-black text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Publishing
                </>
              ) : (
                "Publish ride"
              )}
            </motion.button>
          </motion.form>
        </motion.div>
      </div>
    </AppLayout>
  );
}
