"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/axios";
import Link from "next/link";
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-6">
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

        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
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
                <button
                  onClick={handleAddRole}
                  disabled={addingRole}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors inline-flex items-center gap-2"
                >
                  {addingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Add {missingRole} Role
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
