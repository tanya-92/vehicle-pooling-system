"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  CheckCircle2,
  Car,
  MapPin,
  Calendar,
  CreditCard,
  MessageCircle,
  ShieldCheck,
  UserCheck
} from "lucide-react";

export default function HowItWorks() {
  const passengerSteps = [
    {
      icon: Search,
      title: "1. Search for a ride",
      description: "Enter your pickup location, destination, and the date you want to travel. Browse available rides heading your way."
    },
    {
      icon: CheckCircle2,
      title: "2. Book your seat",
      description: "Review driver profiles, ratings, and ride details. Book your seat instantly or request approval from the driver."
    },
    {
      icon: Car,
      title: "3. Travel together",
      description: "Meet your driver at the agreed pickup spot. Enjoy a safe, affordable, and eco-friendly journey to your destination."
    }
  ];

  const driverSteps = [
    {
      icon: MapPin,
      title: "1. Offer a ride",
      description: "Publish your upcoming journey. Set your exact route, date, time, and how much you're charging per seat."
    },
    {
      icon: MessageCircle,
      title: "2. Accept passengers",
      description: "Review booking requests from verified students. Message them if you need to coordinate pickup details."
    },
    {
      icon: CreditCard,
      title: "3. Drive and save",
      description: "Pick up your passengers and drop them off. Share the travel costs and save money on your commute."
    }
  ];

  const safetyFeatures = [
    {
      icon: UserCheck,
      title: "Verified Profiles",
      description: "Every user must verify their university email before booking or offering a ride."
    },
    {
      icon: ShieldCheck,
      title: "Secure Matching",
      description: "Our system intelligently matches you with trusted peers from your campus community."
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
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-10 border-b border-gray-200">
          <div className="mx-auto max-w-[1280px] text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              How UniPool Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Simple, safe, and student-focused. Discover how easy it is to share rides and split costs on your daily commute.
            </motion.p>
          </div>
        </section>

        {/* Rider Flow */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-10 mx-auto max-w-[1280px]">
          <div className="mb-12 text-center md:text-left">
            <h2 className="text-3xl font-bold">For Passengers</h2>
            <p className="text-gray-600 mt-2">Find a ride in three simple steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>
            {passengerSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative z-10 flex flex-col items-center text-center bg-[#f3f3f3] md:bg-transparent"
                >
                  <div className="w-24 h-24 bg-black text-white rounded-full flex items-center justify-center mb-6 shadow-xl shadow-black/10 border-4 border-[#f3f3f3]">
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                  <p className="text-gray-600 px-4">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
          <div className="mt-12 text-center">
            <Link
              href="/passenger/search-ride"
              className="inline-flex h-14 px-8 items-center justify-center rounded-2xl bg-black text-white font-bold transition hover:bg-[#1f1f1f]"
            >
              Find a Ride Now
            </Link>
          </div>
        </section>

        {/* Driver Flow */}
        <section className="bg-white py-16 md:py-24 px-4 sm:px-6 lg:px-10 border-y border-gray-200">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-12 text-center md:text-left">
              <h2 className="text-3xl font-bold">For Drivers</h2>
              <p className="text-gray-600 mt-2">Share your journey and cut your costs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gray-200 z-0"></div>
              {driverSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative z-10 flex flex-col items-center text-center bg-white"
                  >
                    <div className="w-24 h-24 bg-[#f3f3f3] text-black rounded-full flex items-center justify-center mb-6 shadow-inner border-4 border-white">
                      <Icon className="w-10 h-10" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                    <p className="text-gray-600 px-4">{step.description}</p>
                  </motion.div>
                );
              })}
            </div>
            <div className="mt-12 text-center">
              <Link
                href="/driver/create-ride"
                className="inline-flex h-14 px-8 items-center justify-center rounded-2xl border-2 border-black text-black font-bold transition hover:bg-gray-50"
              >
                Offer a Ride Now
              </Link>
            </div>
          </div>
        </section>

        {/* Safety Section */}
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-10 mx-auto max-w-[1280px]">
          <div className="bg-[#1B2B50] rounded-3xl p-10 md:p-16 text-white grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Trust & Safety First</h2>
              <p className="text-gray-300 text-lg mb-8">
                We've built UniPool around community trust. Because we restrict access to verified university domains, you always know that you're traveling with a fellow student or staff member.
              </p>
              <div className="space-y-6">
                {safetyFeatures.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="flex items-start gap-4">
                      <div className="bg-white/10 p-3 rounded-xl mt-1">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg">{feat.title}</h4>
                        <p className="text-gray-400">{feat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-black/30 p-8 rounded-3xl border border-white/10 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-50">
                  <Calendar className="w-24 h-24 text-white" />
               </div>
               <h3 className="text-2xl font-bold mb-4 relative z-10">Smart Matching</h3>
               <p className="text-gray-300 relative z-10 leading-relaxed">
                 Our matching algorithm considers your campus schedule, preferred routes, and departure times to suggest the most convenient carpools. Less waiting, more moving.
               </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full bg-black py-10 text-white mt-auto">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold tracking-tight">
              UniPool
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/how-it-works" className="text-white">How it works</Link>
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
