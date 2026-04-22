"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/axios";
import { ShieldCheck, Loader2 } from "lucide-react";

export default function VerifyOTP() {
  const router = useRouter();
  const { login } = useAuth();
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("otpEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    } else {
      router.push("/register");
    }
  }, [router]);

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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
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
                className="w-full px-4 py-3 text-center text-2xl tracking-[0.5em] border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center mt-6"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
