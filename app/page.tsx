import { HomeHero } from "@/components/home-hero";
import { HomeFeatures } from "@/components/home-features";
import { HomeFooter } from "@/components/home-footer";
import type { Metadata } from "next";

export default function Page() {
  return (
    <main className="bg-background">
      <HomeHero />
      <HomeFeatures />
      <HomeFooter />
    </main>
  );
}
