"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LegacyMyRidesRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/rides/offered");
  }, [router]);
  return null;
}
