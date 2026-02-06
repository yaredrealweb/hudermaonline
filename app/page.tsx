"use client";

import { HomeHero } from "@/components/home-hero";
import { HomeFeatures } from "@/components/home-features";
import { HomeFooter } from "@/components/home-footer";
import { useGetProfile } from "@/hooks/use-auth-mutation";
import { redirect } from "next/navigation";

export default function Page() {
  const { data } = useGetProfile();

  if (data?.role && data.role === "PATIENT") {
    redirect("/patient/dashboard");
  }

  if (data?.role && data?.role === "DOCTOR") {
    redirect("/doctor/dashboard");
  }

  return (
    <main className="bg-background">
      <HomeHero />
      <HomeFeatures />
      <HomeFooter />
    </main>
  );
}
