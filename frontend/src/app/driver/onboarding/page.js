"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CarFront, CheckCircle2, ArrowRight, ArrowLeft, Loader2, CreditCard, ShieldCheck } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import api from "../../../../lib/axios";

export default function DriverOnboarding() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    vehicle_name: "",
    vehicle_model: "",
    vehicle_number: "",
    vehicle_color: "",
    seats_available: 4,
    driving_license: "",
    phone_number: "",
  });

  // If user already has a driver profile, they shouldn't be here
  useEffect(() => {
    if (user && user.driver_profile) {
      router.push("/driver/create-ride");
    }
  }, [user, router]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Simulate API call for saving driver profile
      // await api.post("/users/driver-profile", formData);
      await new Promise(resolve => setTimeout(resolve, 1500));

      // We will assume backend succeeds and update local storage or context if possible
      // In a real app, this would refresh the user context

      setSuccess(true);
      setTimeout(() => {
        // We set a flag in localStorage to mock backend state if needed, or rely on context
        localStorage.setItem("hasDriverProfile", "true");
        router.push("/driver/create-ride");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save driver profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CarFront className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-3xl font-bold text-black tracking-tight">Become a Driver</h2>
          <p className="mt-3 text-gray-500 text-lg">Set up your vehicle details to start sharing rides.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-black rounded-full z-0 transition-all duration-500"
            style={{ width: step === 1 ? '50%' : '100%' }}
          ></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${step >= 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 transition-colors duration-500 ${step >= 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
        </div>

        {/* Form Card */}
        <motion.div
          className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {success ? (
            <div className="p-10 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10" />
              </motion.div>
              <h3 className="text-2xl font-bold text-black mb-2">Profile Complete!</h3>
              <p className="text-gray-500 mb-8">You are now ready to offer your first ride.</p>
              <Loader2 className="w-6 h-6 animate-spin text-black mx-auto" />
            </div>
          ) : (
            <div className="p-8">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-600 border border-red-100 flex items-center gap-3 text-sm font-medium">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              {step === 1 ? (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                    <CarFront className="w-5 h-5 text-gray-400" /> Vehicle Information
                  </h3>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Vehicle Make / Brand</label>
                    <input
                      type="text"
                      name="vehicle_name"
                      required
                      value={formData.vehicle_name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      placeholder="e.g. Honda, Hyundai"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Vehicle Model</label>
                    <input
                      type="text"
                      name="vehicle_model"
                      required
                      value={formData.vehicle_model}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                      placeholder="e.g. City, i20"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Vehicle Number</label>
                      <input
                        type="text"
                        name="vehicle_number"
                        required
                        value={formData.vehicle_number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all uppercase"
                        placeholder="PB 08 XX 1234"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2 text-gray-700">Color</label>
                      <input
                        type="text"
                        name="vehicle_color"
                        required
                        value={formData.vehicle_color}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        placeholder="e.g. White"
                      />
                    </div>
                  </div>

                  <button
                    onClick={nextStep}
                    disabled={!formData.vehicle_name || !formData.vehicle_model || !formData.vehicle_number || !formData.vehicle_color}
                    className="w-full py-4 mt-4 rounded-xl bg-black text-white font-bold transition hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-black mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" /> Driver Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Driving License Number</label>
                    <input
                      type="text"
                      name="driving_license"
                      required
                      value={formData.driving_license}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all uppercase"
                      placeholder="DL-XXXXXXXXXXXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Phone Number</label>
                    <div className="flex">
                      <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-transparent bg-[#f3f3f3] text-gray-500 font-medium">
                        +91
                      </span>
                      <input
                        type="tel"
                        name="phone_number"
                        required
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-r-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-gray-700">Total Passenger Seats Available</label>
                    <select
                      name="seats_available"
                      value={formData.seats_available}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[#f9f9f9] border border-transparent rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all appearance-none"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>{num} Seats</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex gap-3 mt-8">
                    <button
                      type="button"
                      onClick={prevStep}
                      className="px-6 py-4 rounded-xl bg-[#f3f3f3] text-black font-bold transition hover:bg-gray-200"
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !formData.driving_license || !formData.phone_number}
                      className="flex-1 py-4 rounded-xl bg-black text-white font-bold transition hover:bg-[#1f1f1f] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Complete Setup"}
                    </button>
                  </div>
                </motion.form>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
