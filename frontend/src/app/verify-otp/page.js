"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/axios";
import { motion } from "framer-motion";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function VerifyOTP() {
  const router = useRouter();
  const { login } = useAuth();
  const [otp, setOtp] = useState("");
  const [email] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }
    return localStorage.getItem("otpEmail") || "";
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!email) {
      router.push("/register");
    }
  }, [email, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const res = await api.post("/auth/verify-otp", { email, otp });
      // Login sets token and redirects to dashboard
      localStorage.removeItem("otpEmail");
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed.");
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
          <ShieldCheck className="w-12 h-12 mx-auto mb-2" />
          <h2 className="text-2xl font-bold">Verify Your Email</h2>
          <p className="text-blue-100 mt-1">Enter the 6-digit OTP sent to {email}</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 text-center">
                One-Time Password
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-colors bg-white/70"
                placeholder="000000"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center mt-6 shadow-lg hover:shadow-2xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
            </motion.button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}
