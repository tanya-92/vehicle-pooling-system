"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Mail,
  ArrowLeft,
  Phone,
  MessageSquare,
  HelpCircle,
  MapPin,
  ArrowRight,
  ShieldAlert,
  Loader2,
  CheckCircle2
} from "lucide-react";

function ContactContent() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "dashboard" ? "/dashboard" : "/login";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const supportCards = [
    {
      icon: MessageSquare,
      title: "Chat Support",
      description: "Get instant help from our support team.",
      action: "Start Chat"
    },
    {
      icon: Mail,
      title: "Email Us",
      description: "Drop us a line and we'll get back to you within 24 hours.",
      action: "support@unipool.com"
    },
    {
      icon: HelpCircle,
      title: "Help Center",
      description: "Browse our detailed FAQs and guides.",
      action: "Visit FAQ"
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
            <Link 
              href={backHref}
              className="group flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              Back
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pb-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-16 md:py-24 px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-[1280px] text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              How can we help?
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
            >
              Whether you have a question about your ride, need help setting up your driver profile, or want to report an issue, we're here for you.
            </motion.p>
          </div>
        </section>

        <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10 -mt-8">
          {/* Support Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="bg-white rounded-3xl p-8 shadow-[0_8px_24px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-start"
                >
                  <div className="bg-[#f3f3f3] p-3 rounded-2xl mb-6">
                    <Icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                  <p className="text-gray-600 mb-6 flex-1">{card.description}</p>
                  <button className="font-semibold text-black flex items-center gap-2 hover:gap-3 transition-all">
                    {card.action} <ArrowRight className="w-4 h-4" />
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-8">Send us a message</h2>
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-0 left-0 right-0 bg-black text-white p-4 flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-5 h-5 text-white" />
                    <span className="font-medium text-sm">Message sent successfully! We'll get back to you soon.</span>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      placeholder="How can we help?"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all resize-none"
                      placeholder="Describe your issue..."
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-4 rounded-xl bg-black text-white font-bold text-base transition hover:bg-[#1f1f1f] flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Message"}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* Emergency & Social */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="bg-[#1B2B50] rounded-3xl p-8 text-white shadow-lg">
                <div className="bg-red-500/20 p-3 rounded-2xl inline-block mb-6">
                  <ShieldAlert className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Emergency Help</h3>
                <p className="text-gray-300 mb-6">
                  If you are in immediate danger or experiencing an emergency during a ride, please contact local authorities immediately before contacting us.
                </p>
                <div className="bg-black/20 rounded-xl p-4 flex items-center gap-4">
                  <Phone className="w-5 h-5 text-gray-300" />
                  <span className="font-bold text-lg">112 (Emergency Services)</span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
                <h3 className="text-xl font-bold mb-6">Other ways to connect</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="bg-[#f3f3f3] p-3 rounded-full">
                      <MapPin className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Headquarters</p>
                      <p className="text-sm">UniPool Tower, 123 Innovation Drive, Tech City, 45678</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-gray-700">
                    <div className="bg-[#f3f3f3] p-3 rounded-full">
                      <Phone className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-semibold text-black">Phone Support</p>
                      <p className="text-sm">Mon-Fri, 9am-6pm (+1 234 567 890)</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="w-full bg-black py-10 text-white mt-auto">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-2xl font-bold tracking-tight">
              UniPool
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-gray-300">
              <Link href="/about" className="hover:text-white transition">About</Link>
              <Link href="/how-it-works" className="hover:text-white transition">How it works</Link>
              <Link href="/contact" className="text-white">Contact</Link>
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

export default function Contact() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f3f3f3]" />}>
      <ContactContent />
    </Suspense>
  );
}
