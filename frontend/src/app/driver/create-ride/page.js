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
      className="w-full space-y-6"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold" style={{ color: "#2E2E2E" }}>Create a Ride</h1>
        <p style={{ color: "#666666" }}>Publish your route to find passengers.</p>
      </div>

      {error && (
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#FFE5E5", color: "#CC0000", borderColor: "#FFD5D5" }}>
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg border" style={{ backgroundColor: "#E5FFE5", color: "#006600", borderColor: "#D5FFD5" }}>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6 rounded-xl shadow-sm border space-y-6" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>From</label>
              <input
                type="text"
                name="pickup_location"
                required
                value={formData.pickup_location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
                onFocus={(e) => e.target.style.borderColor = "#556B2F"}
                onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
                placeholder="Main Gate"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>To</label>
              <input
                type="text"
                name="drop_location"
                required
                value={formData.drop_location}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
                onFocus={(e) => e.target.style.borderColor = "#556B2F"}
                onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
                placeholder="Jalandhar City"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>Departure</label>
            <input
              type="datetime-local"
              name="departure_time"
              required
              value={formData.departure_time}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
              style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
              onFocus={(e) => e.target.style.borderColor = "#556B2F"}
              onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>Seats</label>
              <input
                type="number"
                name="available_seats"
                min="1"
                required
                value={formData.available_seats}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
                onFocus={(e) => e.target.style.borderColor = "#556B2F"}
                onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: "#2E2E2E" }}>Price (₹)</label>
              <input
                type="number"
                name="price"
                min="0"
                required
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
                onFocus={(e) => e.target.style.borderColor = "#556B2F"}
                onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
                placeholder="50"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2.5 rounded-lg font-medium text-white transition-colors flex items-center justify-center gap-2 mt-2"
            style={{ backgroundColor: "#556B2F" }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Publishing
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
