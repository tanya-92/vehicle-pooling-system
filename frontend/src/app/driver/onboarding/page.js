"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyOnboardingRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/vehicle-setup?next=/rides/create");
  }, [router]);
  return null;
}
