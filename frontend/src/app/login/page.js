"use client";
import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import api from "../../../lib/axios";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Loader2,
  ChevronDown,
  CircleHelp,
  ShieldCheck,
  Sparkles,
  Route,
  UsersRound,
  UserCircle2,
} from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [openFaqId, setOpenFaqId] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      login(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Route,
      title: "Real-Time Route Tracking",
      description: "Track ride status, live ETA, and route progress in one clear view.",
    },
    {
      icon: UsersRound,
      title: "Smart Coordination",
      description: "Auto-match drivers and passengers for efficient and timely pooling.",
    },
    {
      icon: Sparkles,
      title: "User-Friendly Interface",
      description: "Clean and mobile-first design with intuitive navigation at every step.",
    },
    {
      icon: ShieldCheck,
      title: "Safety & Reliability",
      description: "Verified users, secure access, and dependable ride experiences.",
    },
  ];

  const faqs = [
    {
      question: "Can I schedule a UniPool ride in advance?",
      answer:
        "Yes. You can request a ride now or schedule one for later based on your preferred pickup time and route.",
    },
    {
      question: "How does UniPool match riders and drivers?",
      answer:
        "UniPool uses smart coordination to pair nearby verified drivers and passengers with similar routes for efficient pooling.",
    },
    {
      question: "Is UniPool safe for students and daily commuters?",
      answer:
        "Safety is a priority with verified profiles, secured access, and real-time trip visibility from start to finish.",
    },
    {
      question: "Can I use UniPool across different cities?",
      answer:
        "Yes. UniPool is designed to support multiple city routes, making shared rides easier whether you are local or traveling.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-[#111111]">
      <header className="sticky top-0 z-30 bg-black text-white">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-7">
            <Link href="/login" className="text-2xl font-semibold tracking-tight">
              UniPool
            </Link>
            <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
              <Link href="#hero" className="transition-opacity hover:opacity-80">
                Ride
              </Link>
              <Link href="#features" className="transition-opacity hover:opacity-80">
                Drive
              </Link>
              <Link href="#features" className="transition-opacity hover:opacity-80">
                Business
              </Link>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAboutOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1 transition-opacity hover:opacity-80"
                >
                  About <ChevronDown className={`h-4 w-4 transition-transform ${aboutOpen ? "rotate-180" : ""}`} />
                </button>
                {aboutOpen && (
                  <div className="absolute left-0 top-9 min-w-40 rounded-lg bg-white p-2 text-black shadow-lg">
                    <Link href="#faq" onClick={() => setAboutOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                      FAQ
                    </Link>
                    <Link href="#features" onClick={() => setAboutOpen(false)} className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100">
                      Features
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>

          <div className="flex items-center gap-4 text-sm font-medium">
            <Link href="#faq" className="transition-opacity hover:opacity-80">
              Help
            </Link>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-black transition-colors hover:bg-gray-200"
            >
              <UserCircle2 className="h-4 w-4" />
              <span>Profile</span>
            </button>
          </div>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className="mx-auto grid w-full max-w-[1280px] grid-cols-1 items-start gap-10 px-4 py-10 sm:px-6 md:py-14 lg:grid-cols-2 lg:gap-14 lg:px-10"
        >
          <div>
            <h1 className="max-w-[420px] text-[42px] font-bold leading-[1.05] tracking-tight text-black sm:text-[52px]">
              Request a ride for now or later
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-8 w-full max-w-[430px] rounded-2xl bg-white p-6 shadow-[0_14px_34px_rgba(0,0,0,0.12)]"
            >
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                  placeholder="Email"
                />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-black focus:ring-2 focus:ring-black/10"
                  placeholder="Password"
                />

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full rounded-xl bg-black py-3 text-sm font-semibold text-white transition hover:bg-[#1f1f1f] active:bg-[#2a2a2a] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : "Login"}
                </motion.button>
              </form>

              <div className="mt-4 flex flex-col items-start gap-2 text-sm">
                <Link href="/forgot-password" className="font-medium text-black underline-offset-2 hover:underline">
                  Forgot password?
                </Link>
                <Link href="/register" className="font-medium text-black underline-offset-2 hover:underline">
                  Create account
                </Link>
              </div>
            </motion.div>
          </div>

          <div className="w-full">
            <div className="h-[300px] w-full overflow-hidden rounded-xl bg-[#dddddd] sm:h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1549921296-3a6b81f4f6d1?auto=format&fit=crop&w=1200&q=80"
                alt="UniPool hero placeholder"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-6 lg:px-10">
          <h2 className="text-center text-3xl font-bold tracking-tight text-black sm:text-4xl">
            Know more about UniPool
          </h2>

          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.article
                  key={feature.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.3, delay: index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,0.08)] transition-shadow hover:shadow-[0_14px_30px_rgba(0,0,0,0.14)]"
                >
                  <div className="mb-4 inline-flex rounded-lg bg-black p-2.5 text-white">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-black">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-700">{feature.description}</p>
                </motion.article>
              );
            })}
          </div>
        </section>

        <section id="faq" className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-10">
          <h2 className="text-3xl font-bold tracking-tight text-black sm:text-4xl">FAQs</h2>
          <div className="mt-6 divide-y divide-gray-300 rounded-2xl bg-white px-4 shadow-[0_8px_24px_rgba(0,0,0,0.06)] sm:px-6">
            {faqs.map((faq, index) => {
              const isOpen = openFaqId === index;
              const textFirst = index % 2 === 0;
              return (
                <div key={faq.question} className="py-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 py-2 text-left"
                    onClick={() => setOpenFaqId(isOpen ? -1 : index)}
                  >
                    <span className="text-base font-semibold text-black sm:text-lg">{faq.question}</span>
                    <ChevronDown className={`h-5 w-5 shrink-0 text-black transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                      marginTop: isOpen ? 12 : 0,
                    }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 items-center gap-5 md:grid-cols-2">
                      <div className={`${textFirst ? "md:order-1" : "md:order-2"}`}>
                        <p className="text-sm leading-7 text-gray-700 sm:text-base">{faq.answer}</p>
                      </div>
                      <div className={`${textFirst ? "md:order-2" : "md:order-1"}`}>
                        <div className="h-44 w-full rounded-xl bg-gradient-to-br from-gray-200 to-gray-300 p-4 sm:h-52">
                          <div className="flex h-full items-center justify-center rounded-lg border border-white/70 bg-white/40">
                            <span className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                              <CircleHelp className="h-4 w-4" />
                              FAQ image placeholder
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
