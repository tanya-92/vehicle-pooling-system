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
      <div className="min-h-screen w-full px-4 sm:px-6 md:px-10 py-8 flex items-center justify-center" style={{ backgroundColor: "#F5F5DC" }}>
        <div className="animate-spin" style={{ color: "#556B2F" }}>
          <ShieldPlus className="w-8 h-8" />
        </div>
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
      className="min-h-screen w-full flex flex-col"
      style={{ backgroundColor: "#F5F5DC" }}
    >
      <nav className="w-full sticky top-0 z-40 shadow-sm border-b" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
        <div className="w-full px-4 sm:px-6 md:px-10">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2 font-medium transition-colors" style={{ color: "#556B2F" }}>
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full px-4 sm:px-6 md:px-10 py-6 md:py-8">
        <h1 className="text-2xl font-bold mb-6" style={{ color: "#2E2E2E" }}>Settings</h1>

        {error && (
          <div className="p-4 rounded-lg mb-6 border" style={{ backgroundColor: "#FFE5E5", color: "#CC0000", borderColor: "#FFD5D5" }}>
            {error}
          </div>
        )}

        {message && (
          <div className="p-4 rounded-lg mb-6 border flex items-center gap-2" style={{ backgroundColor: "#E5FFE5", color: "#006600", borderColor: "#D5FFD5" }}>
            <ShieldPlus className="w-5 h-5 flex-shrink-0" />
            {message}
          </div>
        )}

        <div className="p-6 rounded-xl shadow-sm border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
          <h2 className="font-semibold mb-4" style={{ color: "#2E2E2E" }}>Manage Roles</h2>

          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-2" style={{ color: "#666666" }}>Current Roles</p>
              <div className="flex flex-wrap gap-2">
                {user.roles.map(role => (
                  <span key={role} className="px-3 py-1 text-sm font-medium rounded-full capitalize" style={{ backgroundColor: "#F0F0E8", color: "#2E2E2E", border: "1px solid #E5E5DC" }}>
                    {role}
                  </span>
                ))}
              </div>
            </div>

            {hasBothRoles ? (
              <div className="p-4 rounded-lg text-sm text-center" style={{ backgroundColor: "#F0F0E8", color: "#2E2E2E" }}>
                You have both <strong>Driver</strong> and <strong>Passenger</strong> roles. Switch between them from the dashboard.
              </div>
            ) : (
              <div className="p-6 rounded-lg text-center border" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
                <UserPlus className="w-10 h-10 mx-auto mb-3" style={{ color: "#556B2F" }} />
                <h3 className="font-medium mb-2" style={{ color: "#2E2E2E" }}>Add {missingRole} Role</h3>
                <p className="text-sm mb-4" style={{ color: "#666666" }}>
                  Unlock new capabilities by adding the {missingRole} role.
                </p>
                <motion.button
                  onClick={handleAddRole}
                  disabled={addingRole}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto px-6 py-2 rounded-lg font-medium text-white transition-colors inline-flex items-center justify-center gap-2"
                  style={{ backgroundColor: "#556B2F" }}
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
