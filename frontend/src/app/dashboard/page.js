"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  PlusCircle,
  LogOut,
  CarFront,
  MapPin,
  Calendar,
  Users,
  Route,
  Wallet,
  ShieldCheck,
  ChevronDown
} from "lucide-react";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [showCampusRoutes, setShowCampusRoutes] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    router.push(`/search?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&date=${date}`);
  };

  const handleLogout = () => {
    setProfileOpen(false);
    logout();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen w-full bg-[#f3f3f3] flex flex-col font-sans">
        {/* Skeleton Header */}
        <div className="h-16 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="w-24 h-6 bg-gray-200 rounded-md animate-pulse"></div>
          <div className="flex items-center gap-4">
            <div className="w-16 h-8 bg-gray-200 rounded-full animate-pulse hidden sm:block"></div>
            <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse hidden sm:block"></div>
            <div className="w-12 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
        {/* Skeleton Main */}
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 flex-1 py-12">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-14 mb-10">
            <div className="space-y-4">
              <div className="w-3/4 h-12 md:h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="w-2/4 h-12 md:h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
              <div className="w-full h-6 bg-gray-200 rounded-md animate-pulse mt-6"></div>
              <div className="w-5/6 h-6 bg-gray-200 rounded-md animate-pulse"></div>
            </div>
            <div className="w-full h-[300px] sm:h-[380px] lg:h-[450px] bg-gray-200 rounded-3xl animate-pulse"></div>
          </div>
          {/* Skeleton Search */}
          <div className="w-full h-20 bg-white rounded-3xl border border-gray-100 shadow-sm animate-pulse"></div>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Route,
      title: "Travel everywhere",
      description: "Choose from thousands of destinations and campus routes. No matter where you're going, we'll get you there.",
    },
    {
      icon: Wallet,
      title: "Prices like nowhere",
      description: "Spend smarter. Share costs with verified students and commuters for the most affordable journeys.",
    },
    {
      icon: ShieldCheck,
      title: "Ride with confidence",
      description: "We verify profiles, IDs, and campus emails so you know exactly who you're traveling with.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-[#111111] font-sans flex flex-col">
      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/dashboard" className="text-2xl font-bold tracking-tight text-black flex items-center gap-2">
            UniPool
          </Link>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => document.getElementById("search-form")?.scrollIntoView({ behavior: "smooth" })}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              <Search className="h-5 w-5" />
              <span>Search</span>
            </button>

            <Link
              href="/offer"
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-black hover:bg-gray-100 rounded-full transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              <span>Offer a ride</span>
            </Link>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 p-1.5 pl-3 border border-gray-300 rounded-full bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black text-white text-sm font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <ChevronDown className="h-4 w-4 text-gray-500 mr-1" />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-gray-100 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-100">
                      <p className="font-semibold text-black truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/rides/offered"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <CarFront className="h-4 w-4" />
                        Rides offered
                      </Link>
                      <Link
                        href="/my-trips"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        <MapPin className="h-4 w-4" />
                        My Trips
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-100">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10 flex-1 pb-20">
        {/* HERO SECTION */}
        <section className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-10 py-8 md:py-12 lg:gap-14">
          <div className="flex flex-col justify-center order-1 w-full">
            <h1 className="w-full lg:max-w-[550px] text-[48px] font-bold leading-[1.05] tracking-tight text-black sm:text-[60px]">
              Travel anywhere together. Spend smarter.
            </h1>
            <p className="mt-6 w-full lg:max-w-[450px] text-xl text-gray-700 leading-relaxed">
              Find and share rides easily within your campus and nearby routes.
            </p>
          </div>

          <div className="w-full order-2">
            <div className="h-[300px] sm:h-[380px] lg:h-[450px] w-full overflow-hidden rounded-3xl bg-[#dddddd]">
              <img
                src="https://images.unsplash.com/photo-1549921296-3a6b81f4f6d1?auto=format&fit=crop&w=1200&q=80"
                alt="UniPool journey placeholder"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* SEARCH BAR */}
        <section className="relative z-20 mb-10 lg:mb-20">
          {/* SHOW CAMPUS ROUTES TOGGLE */}
          <div className="mb-2">
            <label className="inline-flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center w-5 h-5 rounded border-2 border-gray-300 bg-white group-hover:border-black transition-colors">
                <input
                  type="checkbox"
                  checked={showCampusRoutes}
                  onChange={(e) => setShowCampusRoutes(e.target.checked)}
                  className="peer sr-only"
                />
                {showCampusRoutes && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute inset-0 bg-black rounded-[2px] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                )}
              </div>
              <span className="text-sm text-gray-600 font-medium select-none group-hover:text-black transition-colors">
                Show campus routes
              </span>
            </label>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl bg-white p-2 shadow-xl border border-gray-100"
          >
            <form id="search-form" onSubmit={handleSearch} className="flex flex-col lg:flex-row items-center gap-2">
              <div className="flex w-full flex-col lg:flex-row flex-1 border border-gray-200 lg:border-none rounded-2xl lg:rounded-none overflow-hidden">
                <div className="flex flex-1 items-center gap-3 bg-white px-4 py-3 lg:border-r border-gray-200 border-b lg:border-b-0 hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={from}
                    onChange={(e) => setFrom(e.target.value)}
                    placeholder="Leaving from"
                    className="w-full bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-gray-500"
                  />
                </div>

                <div className="flex flex-1 items-center gap-3 bg-white px-4 py-3 lg:border-r border-gray-200 border-b lg:border-b-0 hover:bg-gray-50 transition-colors">
                  <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    required
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="Going to"
                    className="w-full bg-transparent text-base font-medium outline-none placeholder:font-normal placeholder:text-gray-500"
                  />
                </div>

                <div className="flex flex-1 items-center gap-3 bg-white px-4 py-3 lg:border-r border-gray-200 border-b lg:border-b-0 hover:bg-gray-50 transition-colors">
                  <Calendar className="h-5 w-5 text-gray-400 shrink-0" />
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-transparent text-base font-medium outline-none text-gray-700"
                  />
                </div>

                <div className="flex sm:w-48 items-center gap-3 bg-white px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer relative">
                  <Users className="h-5 w-5 text-gray-400 shrink-0" />
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full bg-transparent text-base font-medium outline-none cursor-pointer appearance-none text-gray-700"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>{num} passenger{num > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full lg:w-auto h-14 px-8 rounded-2xl bg-black text-white font-semibold text-base transition hover:bg-[#1f1f1f] active:bg-[#2a2a2a] whitespace-nowrap shadow-md"
              >
                Search
              </motion.button>
            </form>
          </motion.div>
        </section>

        {/* OFFER RIDE CTA */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full rounded-3xl bg-[#1B2B50] p-10 md:p-14 text-center shadow-lg"
          >
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Share your ride. Cut your costs.</h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Offer empty seats on your route and split travel costs with fellow riders.
            </p>
            <Link
              href="/offer"
              className="mt-8 inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-white text-black font-bold text-base transition hover:bg-gray-100 active:bg-gray-200"
            >
              Offer a ride
            </Link>
          </motion.div>
        </section>

        {/* INFO CARD */}
        <section className="mb-16 flex flex-col md:grid md:grid-cols-2 items-center gap-10 lg:gap-14 bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100">
          <div className="w-full h-[250px] sm:h-[300px] md:h-full order-1 md:order-1 bg-[#dddddd]">
            <img
              src="https://images.unsplash.com/photo-1549921296-3a6b81f4f6d1?auto=format&fit=crop&w=800&q=80"
              alt="Never miss a carpool"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-8 md:p-12 order-2 md:order-2 flex flex-col justify-center items-start">
            <h2 className="text-3xl font-bold text-black sm:text-4xl">Never miss a carpool!</h2>
            <p className="mt-4 text-lg text-gray-600">
              Set up alerts to get notified instantly when a ride matching your route becomes available.
            </p>
            <Link
              href="/search"
              className="mt-8 inline-flex items-center justify-center h-14 px-8 rounded-2xl bg-black text-white font-bold text-base transition hover:bg-[#1f1f1f] active:bg-[#2a2a2a]"
            >
              Find a ride
            </Link>
          </div>
        </section>

        {/* FEATURE SECTION */}
        <section className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl bg-white p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 transition-shadow hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]"
                >
                  <div className="mb-6 inline-flex rounded-xl bg-black p-3 text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-black">{feature.title}</h3>
                  <p className="text-[15px] leading-relaxed text-gray-600">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="w-full bg-black py-10 text-white mt-auto">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold tracking-tight">
              UniPool
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/how-it-works" className="hover:text-white transition">How it works</Link>
              <Link href="/contact?from=dashboard" className="hover:text-white transition">Contact</Link>
            </div>
          </div>
          <div className="mt-8 text-center md:text-left text-xs text-gray-500">
            © 2026 UniPool. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
