"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, UserPlus, ShieldPlus, Loader2 } from "lucide-react";

export default function Settings() {
  const { user, loading, updateRoleState } = useAuth();
  const router = useRouter();
  const [addingRole, setAddingRole] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full px-4 md:px-8 lg:px-12 py-8 bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100">
        <div className="h-56 rounded-2xl bg-white/40 border border-white/50 animate-pulse" />
      </div>
    );
  }

  const hasBothRoles = user.roles.length === 2;
  const missingRole = user.roles.includes("driver") ? "passenger" : "driver";

  const handleAddRole = async () => {
    setAddingRole(true);
    setError("");
    setMessage("");

    try {
      const res = await api.patch("/auth/add-role", { newRole: missingRole });
      updateRoleState(res.data.user);
      setMessage(`Successfully added ${missingRole} role!`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add role.");
    } finally {
      setAddingRole(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-purple-100 to-cyan-100 flex flex-col"
    >
      <nav className="w-full sticky top-0 z-40 bg-white/30 backdrop-blur-md shadow-sm border-b border-white/40">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full px-4 md:px-8 lg:px-12 py-6 md:py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-100">
            {error}
          </div>
        )}

        {message && (
          <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg mb-6 shadow-sm border border-emerald-100 flex items-center gap-2">
            <ShieldPlus className="w-5 h-5" />
            {message}
          </div>
        )}

        <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-4">Manage Roles</h2>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-2">Current Associated Roles</p>
              <div className="flex flex-wrap gap-2">
                {user.roles.map(role => (
                  <span key={role} className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-100 text-sm font-medium rounded-full capitalize">
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {hasBothRoles ? (
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-sm text-gray-600 text-center">
                You have associated both <strong>Driver</strong> and <strong>Passenger</strong> roles with your account. You can switch between them from the dashboard.
              </div>
            ) : (
              <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 mt-4 text-center">
                <UserPlus className="w-10 h-10 text-blue-500 mx-auto mb-3" />
                <h3 className="text-gray-900 font-medium mb-1">Expand Your Options</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Add the missing <strong>{missingRole}</strong> role to your account to unlock new capabilities.
                </p>
                <motion.button
                  onClick={handleAddRole}
                  disabled={addingRole}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg hover:shadow-2xl"
                >
                  {addingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Add {missingRole} Role
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
