"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/axios";
import Link from "next/link";
import { User, LogOut, Settings, RotateCcw, Car, Users, Loader2 } from "lucide-react";

export default function Dashboard() {
  const { user, loading, logout, updateRoleState } = useAuth();
  const router = useRouter();
  const [switching, setSwitching] = useState(false);
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

  const handleSwitchRole = async () => {
    setSwitching(true);
    setError("");
    try {
      const res = await api.patch("/auth/switch-role");
      updateRoleState(res.data.user);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to switch role.");
    } finally {
      setSwitching(false);
    }
  };

  const isDriver = user.currentRole === "driver";
  const hasBothRoles = user.roles.length === 2;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 text-blue-600 font-bold text-xl">
              <Car className="w-6 h-6" />
              <span>Ride LPU</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/settings" className="text-gray-500 hover:text-gray-700 transition-colors">
                <Settings className="w-5 h-5" />
              </Link>
              <button 
                onClick={logout}
                className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-6">
        
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 shadow-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-48 h-48 bg-blue-50 rounded-full opacity-50 pointer-events-none" />

          <div className="flex items-center gap-4 mb-8 relative z-10">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl justify-center font-bold text-gray-900 tracking-tight">
                Welcome, {user.name.split(" ")[0]}!
              </h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            
            {/* Current Role Card */}
            <div className={`p-6 rounded-xl border ${isDriver ? 'bg-indigo-50 border-indigo-100' : 'bg-emerald-50 border-emerald-100'}`}>
              <div className="flex items-center gap-3 mb-3">
                {isDriver ? <Car className="w-6 h-6 text-indigo-600" /> : <Users className="w-6 h-6 text-emerald-600" />}
                <h3 className="font-semibold text-gray-900 text-lg">Active Role</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900 capitalize mb-4">
                {user.currentRole}
              </p>
              
              <div className="flex items-center gap-4">
                {hasBothRoles ? (
                  <button
                    onClick={handleSwitchRole}
                    disabled={switching}
                    className="flex items-center gap-2 bg-white text-gray-700 hover:bg-gray-50 border shadow-sm px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                  >
                    {switching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RotateCcw className="w-4 h-4" />}
                    Switch to {isDriver ? "Passenger" : "Driver"}
                  </button>
                ) : (
                  <Link
                    href="/settings"
                    className="text-sm font-medium text-blue-600 hover:underline"
                  >
                    Add {isDriver ? "Passenger" : "Driver"} role to switch
                  </Link>
                )}
              </div>
            </div>

            {/* Account Status Card */}
            <div className="p-6 rounded-xl border border-gray-100 bg-gray-50 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" /> Associated Roles
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {user.roles.map(role => (
                    <span key={role} className="px-3 py-1 bg-white border shadow-sm text-gray-700 text-sm font-medium rounded-full capitalize">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
              
              {!hasBothRoles && (
                <div className="mt-auto pt-4 border-t border-gray-200">
                  <Link 
                    href="/settings"
                    className="text-blue-600 font-medium text-sm hover:underline"
                  >
                    Manage Roles (Add {isDriver ? "Passenger" : "Driver"}) &rarr;
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
