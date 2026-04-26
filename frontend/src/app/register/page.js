"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { CarFront, Loader2 } from "lucide-react";

export default function Register() {
  
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [roles, setRoles] = useState({
    driver: false,
    passenger: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (role) => {
    setRoles((prev) => ({ ...prev, [role]: !prev[role] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const selectedRoles = Object.keys(roles).filter((role) => roles[role]);

    if (selectedRoles.length === 0) {
      setError("Please select at least one role.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/register", {
        ...formData,
        roles: selectedRoles,
      });
      // OTP details in local storage purely for passing to verify page UX
      localStorage.setItem("otpEmail", formData.email);
      router.push("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full flex items-center justify-center px-4 md:px-8 lg:px-12 py-8 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100"
    >
      <div className="w-full md:w-2/3 lg:w-1/2 xl:w-2/5 bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden">
        <div className="bg-blue-600 p-6 text-center text-white">
          <CarFront className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Create an Account</h2>
          <p className="text-blue-100 mt-1">Join the LPU Ride Pooling System</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-colors bg-white/70"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LPU Email
              </label>
              <input
                type="email"
                required
                // pattern="^[a-zA-Z0-9._%+\-]+@lpu\.in$"
                title="Only @lpu.in email addresses are allowed"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-colors bg-white/70"
                placeholder="john.doe@lpu.in"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-colors bg-white/70"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                Select Your Roles
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/50 rounded-xl flex-1 hover:bg-white/60 transition-colors bg-white/50">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={roles.driver}
                    onChange={() => handleRoleChange("driver")}
                  />
                  <span className="text-gray-700 font-medium">Driver</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border border-white/50 rounded-xl flex-1 hover:bg-white/60 transition-colors bg-white/50">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={roles.passenger}
                    onChange={() => handleRoleChange("passenger")}
                  />
                  <span className="text-gray-700 font-medium">Passenger</span>
                </label>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center mt-6 shadow-lg hover:shadow-2xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
