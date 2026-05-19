"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CarFront, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { hasVehicleInfo } from "../../../lib/user";
import api from "../../../lib/axios";
import AppLayout from "../../components/AppLayout";

function VehicleSetupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/rides/create";
  const { user, loading, updateUser } = useAuth();

  const [formData, setFormData] = useState({
    phone: "",
    vehicleType: "",
    vehicleModel: "",
    vehicleNumber: "",
    vehicleColor: "",
    seatsAvailable: 4,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user && hasVehicleInfo(user)) {
      router.replace(nextPath);
    } else if (user) {
      setFormData({
        phone: user.phone || "",
        vehicleType: user.vehicleInfo?.vehicleType || "",
        vehicleModel: user.vehicleInfo?.vehicleModel || "",
        vehicleNumber: user.vehicleInfo?.vehicleNumber || "",
        vehicleColor: user.vehicleInfo?.vehicleColor || "",
        seatsAvailable: user.vehicleInfo?.seatsAvailable || 4,
      });
    }
  }, [user, router, nextPath]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await api.patch("/user/vehicle-info", formData);
      updateUser(res.data.user);
      router.replace(nextPath);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save vehicle information.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-[#f3f3f3]"
      >
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </motion.div>
    );
  }

  return (
    <AppLayout>
      <div className="w-full max-w-lg mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CarFront className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-black">Set up your vehicle</h1>
          <p className="mt-2 text-gray-500">
            Add your vehicle details once — then offer rides anytime.
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)] space-y-5"
        >
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium border border-red-100"
            >
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Phone number</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none border border-transparent"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Vehicle type</label>
            <input
              type="text"
              name="vehicleType"
              required
              value={formData.vehicleType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none border border-transparent"
              placeholder="e.g. Sedan, SUV, Hatchback"
            />
          </div>

          <motion.div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Vehicle model</label>
            <input
              type="text"
              name="vehicleModel"
              required
              value={formData.vehicleModel}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none border border-transparent"
              placeholder="e.g. Honda City"
            />
          </motion.div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Number plate</label>
              <input
                type="text"
                name="vehicleNumber"
                required
                value={formData.vehicleNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none border border-transparent uppercase"
                placeholder="PB 08 XX 1234"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Color</label>
              <input
                type="text"
                name="vehicleColor"
                required
                value={formData.vehicleColor}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none border border-transparent"
                placeholder="White"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">Seats available</label>
            <select
              name="seatsAvailable"
              value={formData.seatsAvailable}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#f9f9f9] rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none border border-transparent"
            >
              {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                <option key={num} value={num}>
                  {num} seat{num > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            type="submit"
            disabled={submitting}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl bg-black text-white font-bold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue to offer ride <ArrowRight className="w-5 h-5" />
              </>
            )}
          </motion.button>
        </motion.form>
      </div>
    </AppLayout>
  );
}

export default function VehicleSetup() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
          <Loader2 className="w-8 h-8 animate-spin text-black" />
        </div>
      }
    >
      <VehicleSetupForm />
    </Suspense>
  );
}
