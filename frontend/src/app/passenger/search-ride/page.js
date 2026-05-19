"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function RedirectWithParams() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get("from") || "";
    const to = searchParams.get("to") || "";
    const date = searchParams.get("date") || "";
    const qs = new URLSearchParams();
    if (from) qs.set("from", from);
    if (to) qs.set("to", to);
    if (date) qs.set("date", date);
    const query = qs.toString();
    router.replace(query ? `/search?${query}` : "/search");
  }, [router, searchParams]);

  return null;
}

export default function LegacySearchRedirect() {
  return (
    <Suspense fallback={null}>
      <RedirectWithParams />
    </Suspense>
  );
}
