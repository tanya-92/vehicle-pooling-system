"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyCreateRideRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/offer");
  }, [router]);
  return null;
}
