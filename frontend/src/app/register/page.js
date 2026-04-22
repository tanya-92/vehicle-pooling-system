"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import Link from "next/link";
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 mt-4">
                Select Your Roles
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg flex-1 hover:bg-gray-50 transition-colors">
                  <input
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    checked={roles.driver}
                    onChange={() => handleRoleChange("driver")}
                  />
                  <span className="text-gray-700 font-medium">Driver</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer p-3 border rounded-lg flex-1 hover:bg-gray-50 transition-colors">
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center mt-6"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
