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
      localStorage.setItem("otpEmail", formData.email);
      router.push("/verify-otp");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8" style={{ backgroundColor: "#F5F5DC" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full sm:max-w-md rounded-xl shadow-sm border"
        style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}
      >
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto" style={{ backgroundColor: "#556B2F" }}>
              <CarFront className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold" style={{ color: "#2E2E2E" }}>Create Account</h1>
            <p style={{ color: "#666666" }}>Join LPU Ride Pooling</p>
          </div>

          {error && (
            <div className="p-3 rounded-lg text-sm text-center" style={{ backgroundColor: "#FFE5E5", color: "#CC0000" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2E2E2E" }}>
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
                onFocus={(e) => e.target.style.borderColor = "#556B2F"}
                onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
                placeholder="John Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2E2E2E" }}>
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
                onFocus={(e) => e.target.style.borderColor = "#556B2F"}
                onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
                placeholder="john.doe@lpu.in"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: "#2E2E2E" }}>
                Password
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors"
                style={{ borderColor: "#D5D5CC", color: "#2E2E2E" }}
                onFocus={(e) => e.target.style.borderColor = "#556B2F"}
                onBlur={(e) => e.target.style.borderColor = "#D5D5CC"}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium" style={{ color: "#2E2E2E" }}>
                Select Roles
              </label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors" style={{ backgroundColor: "#F5F5DC" }}>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded"
                    checked={roles.driver}
                    onChange={() => handleRoleChange("driver")}
                    style={{ accentColor: "#556B2F" }}
                  />
                  <span style={{ color: "#2E2E2E" }}>Driver</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-colors" style={{ backgroundColor: "#F5F5DC" }}>
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded"
                    checked={roles.passenger}
                    onChange={() => handleRoleChange("passenger")}
                    style={{ accentColor: "#556B2F" }}
                  />
                  <span style={{ color: "#2E2E2E" }}>Passenger</span>
                </label>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg font-medium text-white transition-all flex items-center justify-center mt-2"
              style={{ backgroundColor: "#556B2F" }}
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
            </motion.button>
          </form>

          <p className="text-center text-sm" style={{ color: "#666666" }}>
            Already have an account?{" "}
            <Link href="/login" className="font-medium hover:underline" style={{ color: "#556B2F" }}>
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
