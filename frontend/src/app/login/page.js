"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { CarFront, Loader2 } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
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
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-blue-100 mt-1">LPU Ride Pooling System</p>
        </div>
        
        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LPU Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-colors bg-white/70"
                placeholder="you@lpu.in"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-white/50 rounded-xl focus:ring-2 focus:ring-blue-400 transition-colors bg-white/70"
                placeholder="••••••••"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-2xl"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-blue-600 font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}
