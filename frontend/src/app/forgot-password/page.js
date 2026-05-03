"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, Mail } from "lucide-react";
import api from "../../../lib/axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.post("/auth/forgot-password", { email });
      setSuccess("If this email exists, password reset instructions have been sent.");
    } catch (_err) {
      setSuccess("If this email exists, password reset instructions have been sent.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#eef3ff_0%,#e4edff_25%,#f2ebff_55%,#ffffff_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_65px_-28px_rgba(79,70,229,0.55)] backdrop-blur-xl sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-slate-900">Reset your password</h1>
          <p className="mt-1 text-sm text-slate-600">
            Enter your email and we will send you reset instructions.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium text-slate-700" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-indigo-100 bg-white/90 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100"
              placeholder="you@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,#4f46e5_0%,#7c3aed_45%,#9333ea_100%)] py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-300/60 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-80"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send reset link"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Remember your password?{" "}
          <Link href="/login" className="font-semibold text-indigo-700 transition hover:text-indigo-600 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
