"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import Logo from "./ui/logo";

export function HomeHero() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </Link>
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/auth/login">Get Started</Link>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                href="#features"
                className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Features
              </Link>
              <Link
                href="#about"
                className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                About
              </Link>
              <Link
                href="/sign-in"
                className="block text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                Sign In
              </Link>
              <Button className="w-full bg-primary hover:bg-primary/90">
                Get Started
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary text-sm font-medium">
              Healthcare Innovation
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Secure Online{" "}
            <span className="text-primary">Health Consultations</span>, Anytime,
            Anywhere
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            Connect with certified healthcare professionals for secure,
            confidential consultations. Hudermaonline brings quality healthcare
            to your fingertips.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button
              size="lg"
              asChild
              className="bg-primary hover:bg-primary/90 text-lg px-8"
            >
              <Link href="/auth/login">Start Consultation</Link>
            </Button>
          </div>

          {/* Hero Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary text-xl">🔒</span>
              </div>
              <h3 className="text-foreground font-semibold mb-2">
                Secure Communication
              </h3>
              <p className="text-muted-foreground text-sm">
                End-to-end encrypted consultations
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary text-xl">👨‍⚕️</span>
              </div>
              <h3 className="text-foreground font-semibold mb-2">
                Expert Doctors
              </h3>
              <p className="text-muted-foreground text-sm">
                Verified healthcare professionals
              </p>
            </div>

            <div className="p-6 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <span className="text-primary text-xl">🛡️</span>
              </div>
              <h3 className="text-foreground font-semibold mb-2">
                Privacy First
              </h3>
              <p className="text-muted-foreground text-sm">
                Your health data is completely confidential
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
