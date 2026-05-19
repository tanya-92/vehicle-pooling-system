"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, PlusCircle, LogOut, CarFront, MapPin, ChevronDown, Loader2 } from "lucide-react";

export default function UnifiedLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-[#111111] font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-black">
            UniPool
          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/passenger/search-ride" className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-full transition-colors">
              <Search className="h-5 w-5" />
              <span>Search</span>
            </Link>
            <Link href="/driver/create-ride" className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-full transition-colors">
              <PlusCircle className="h-5 w-5" />
              <span>Offer a ride</span>
            </Link>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 p-1.5 pl-3 border border-gray-300 rounded-full bg-white hover:shadow-md transition-shadow">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-semibold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.15 }} className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-black truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link href="/driver/my-rides" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                        <CarFront className="h-4 w-4" /> My Rides
                      </Link>
                      <Link href="/passenger/bookings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors">
                        <MapPin className="h-4 w-4" /> Bookings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button onClick={() => { setProfileOpen(false); logout(); }} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        <LogOut className="h-4 w-4" /> Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>
    </div>
  );
}
