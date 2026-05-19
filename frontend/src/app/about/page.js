"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Leaf,
  GraduationCap,
  Sparkles,
  ArrowRight
} from "lucide-react";

export default function About() {
  const benefits = [
    {
      icon: Users,
      title: "Community First",
      description: "Connect with fellow students and faculty. Make your daily commute a chance to network and make new friends."
    },
    {
      icon: Leaf,
      title: "Eco-Friendly",
      description: "Reduce the carbon footprint of your campus by taking fewer cars on the road every single day."
    },
    {
      icon: ShieldCheck,
      title: "Verified Safety",
      description: "Every user is verified through their university email. Travel with peace of mind knowing who is in the car."
    },
    {
      icon: GraduationCap,
      title: "Student Budget Friendly",
      description: "Share the cost of gas and tolls. Save money for the things that actually matter during your college years."
    }
  ];

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] text-[#111111] font-sans flex flex-col">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <Link href="/" className="text-2xl font-bold tracking-tight text-black flex items-center gap-2">
            UniPool
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-black hover:opacity-80 transition-opacity">
              Back to App
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 md:py-32 px-4 sm:px-6 lg:px-10 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
             <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[60%] rounded-full bg-gradient-to-b from-gray-500 to-transparent blur-[120px]" />
          </div>
          <div className="mx-auto max-w-[1280px] flex flex-col items-center text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-medium mb-8"
            >
              <Sparkles className="w-4 h-4 text-gray-300" />
              <span>Redefining Student Commutes</span>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight max-w-4xl"
            >
              Share the ride, <br className="hidden md:block" />
              <span className="text-gray-400">share the journey.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mt-6 text-lg md:text-xl text-gray-300 max-w-2xl mx-auto"
            >
              UniPool is built exclusively for university students and staff to make commuting cheaper, greener, and safer.
            </motion.p>
          </div>
        </section>

        {/* Vision Section */}
        <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We believe that transportation shouldn't be a barrier to education or college life. Every day, thousands of students travel to the same campus, often alone in their cars, while others struggle with expensive alternatives or long transit times.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                UniPool bridges this gap. By creating a closed, trusted network of verified students and staff, we're building a smarter way to commute.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src="https://images.unsplash.com/photo-1529156069898-49953eb1f5ff?auto=format&fit=crop&w=800&q=80"
                alt="Students walking on campus"
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold">Why choose UniPool?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-3xl bg-[#f9f9f9] border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#1B2B50] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden"
          >
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to join the movement?</h2>
              <p className="text-xl text-gray-300 mb-10">
                Sign up today with your university email and start finding rides in minutes.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  Create an account <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/30 text-white font-bold rounded-xl hover:bg-white/10 transition"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="w-full bg-black py-10 text-white mt-auto">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold tracking-tight">
              UniPool
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/about" className="text-white">About</Link>
              <Link href="/how-it-works" className="hover:text-white transition">How it works</Link>
              <Link href="/contact" className="hover:text-white transition">Contact</Link>
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
