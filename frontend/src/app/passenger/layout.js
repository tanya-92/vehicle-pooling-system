"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Search, ArrowLeft, Loader2, Users } from "lucide-react";

export default function PassengerLayout({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (user.currentRole !== "passenger") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border w-full text-center">
          <Users className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">Switch to passenger role to book rides.</p>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium w-full justify-center"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const navItems = [
    { name: "Dashboard", href: "/passenger", icon: LayoutDashboard },
    { name: "Find a Ride", href: "/passenger/search-ride", icon: Search },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full flex flex-col md:flex-row"
      style={{ backgroundColor: "#F5F5DC" }}
    >
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 border-r sticky top-0 md:min-h-screen flex flex-col" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC" }}>
        <div className="px-4 md:px-6 py-6 border-b flex items-center gap-2" style={{ borderColor: "#E5E5DC", color: "#556B2F" }}>
          <Users className="w-5 h-5" />
          <span className="font-bold text-base">Passenger Panel</span>
        </div>
        <nav className="flex-1 px-4 md:px-6 py-4 space-y-2 flex flex-row md:flex-col overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium whitespace-nowrap text-sm"
                style={{
                  backgroundColor: isActive ? "#F0F0E8" : "transparent",
                  color: isActive ? "#556B2F" : "#666666",
                }}
                onMouseEnter={(e) => !isActive && (e.target.style.backgroundColor = "#F5F5E8")}
                onMouseLeave={(e) => !isActive && (e.target.style.backgroundColor = "transparent")}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="px-4 md:px-6 py-4 border-t hidden md:block" style={{ borderColor: "#E5E5DC" }}>
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors font-medium text-sm" style={{ color: "#666666" }} onMouseEnter={(e) => e.target.style.backgroundColor = "#F0F0E8"} onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0 w-full">
        <header className="border-b p-4 md:hidden flex justify-between items-center sticky top-0" style={{ backgroundColor: "#FAF9F6", borderColor: "#E5E5DC", color: "#2E2E2E" }}>
          <span className="font-semibold">Passenger Panel</span>
          <Link href="/dashboard">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </header>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-6 md:py-8">
          <div className="w-full">
            {children}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
