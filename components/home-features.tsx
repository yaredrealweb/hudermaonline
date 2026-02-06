"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";

export function HomeFeatures() {
  const features = [
    {
      title: "Real-Time Video Consultations",
      description:
        "High-quality video and audio consultations powered by Google Meet, with scheduling handled through Google Calendar. Easy one-click join links, automatic calendar invites, and seamless scheduling for patients and doctors.",
      details: [
        "Google Meet integration for secure HD video",
        "Google Calendar-based scheduling with automatic invites",
        "One-click join links included in calendar events",
        "Screen sharing and optional recording (with consent)",
      ],
    },
    {
      title: "Electronic Health Records",
      description:
        "Secure digital storage of your medical history, prescriptions, and past consultations. Access your health information anytime, anywhere.",
      details: [
        "Complete medical history",
        "Prescription management",
        "Lab results storage",
        "Allergy and medication tracking",
      ],
    },
    {
      title: "Prescription Management",
      description:
        "Receive prescriptions directly to your registered pharmacy or have them delivered to your doorstep.",
      details: [
        "Digital prescriptions",
        "Pharmacy integration",
        "Home delivery options",
        "Refill reminders",
      ],
    },
    {
      title: "Verified Healthcare Professionals",
      description:
        "All doctors on our platform are thoroughly vetted with verified credentials and extensive experience.",
      details: [
        "License verification",
        "Experience validation",
        "Patient reviews and ratings",
        "Specialized practitioners",
      ],
    },
    {
      title: "Affordable Care Plans",
      description:
        "Flexible pricing options to suit your healthcare needs. No hidden fees, transparent pricing.",
      details: [
        "Pay-per-consultation",
        "Monthly subscriptions",
        "Family plans",
        "Insurance integration",
      ],
    },
    {
      title: "24/7 Customer Support",
      description:
        "Round-the-clock support to assist you with any questions or concerns about your consultations.",
      details: [
        "Live chat support",
        "Email assistance",
        "Phone support",
        "Multilingual support",
      ],
    },
  ];

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Comprehensive Healthcare Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for quality healthcare consultations at your
            convenience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-card border border-border rounded-lg hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10 group"
            >
              {/* Feature Title */}
              <div className="mb-4 w-10 h-10 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <CheckCircle className="text-primary w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>

              {/* Feature Description */}
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Feature Details */}
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start gap-3">
                    <span className="text-primary text-xl leading-none mt-0.5">
                      •
                    </span>
                    <span className="text-muted-foreground text-sm">
                      {detail}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-20 p-12 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg text-center">
          <h3 className="text-2xl font-bold text-foreground mb-3">
            Ready to Experience Better Healthcare?
          </h3>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of patients who trust Hudermaonline for their
            healthcare needs
          </p>
          <Link
            href={"/auth/login"}
            className="px-8 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </section>
  );
}
