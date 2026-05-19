"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../context/AuthContext";
import { hasVehicleInfo } from "../../../lib/user";
import { Loader2 } from "lucide-react";

export default function OfferRideEntry() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    if (hasVehicleInfo(user)) {
      router.replace("/rides/create");
    } else {
      router.replace("/vehicle-setup?next=/rides/create");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f3f3]">
      <Loader2 className="w-8 h-8 animate-spin text-black" />
    </div>
  );
}
