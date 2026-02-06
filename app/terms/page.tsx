import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HomeFooter } from "@/components/home-footer";
import Logo from "@/components/ui/logo";

export const metadata = {
  title: "Terms of Service - Huderma Dermatology Clinic and Aesthetics",
  description:
    "Terms of Service for Huderma Dermatology Clinic and Aesthetics - telemedicine and online consultation terms",
};

export default function TermsOfServicePage() {
  return (
    <main className="page">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <Link
              href="/"
              className="flex items-center gap-1 text-primary hover:gap-2 transition-all"
            >
              Back to Home
              <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gradient-to-b from-secondary to-background pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            TERMS OF SERVICE
          </h1>
          <p className="text-lg text-muted-foreground">
            Huderma Dermatology Clinic and Aesthetics
            <br />
            Last Updated: February 5, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using our website, mobile application, or online
                consultation services (“Service”), you agree to be bound by
                these Terms of Service. If you do not agree to these Terms,
                please do not use the Service.
              </p>
            </section>

            <section>
              <h2>2. Medical Services Disclaimer</h2>
              <p>
                The Service provides access to licensed dermatology
                professionals for telemedicine consultations. Online
                consultations do not replace in-person medical examinations when
                clinically required. In case of emergency, you should
                immediately contact local emergency services or seek urgent
                medical care.
              </p>
            </section>

            <section>
              <h2>3. Eligibility</h2>
              <p>
                You must be at least 18 years old to use the Service, or have
                consent from a parent or legal guardian.
              </p>
            </section>

            <section>
              <h2>4. User Responsibilities</h2>
              <p>You agree to:</p>
              <ul>
                <li>Provide accurate, current, and complete information</li>
                <li>Use the Service only for lawful purposes</li>
                <li>
                  Not misuse, disrupt, or attempt unauthorized access to the
                  platform
                </li>
                <li>
                  Maintain the confidentiality of your account credentials
                </li>
              </ul>
            </section>

            <section>
              <h2>5. Appointments and Payments</h2>
              <p>Appointments and payment information:</p>
              <ul>
                <li>Appointments are scheduled using Google Calendar</li>
                <li>Online consultations are conducted using Google Meet</li>
                <li>Payments are processed securely through PayPal</li>
                <li>We do not store your payment card details</li>
                <li>Fees are disclosed prior to booking</li>
                <li>
                  Refunds, cancellations, and rescheduling are subject to clinic
                  policies communicated at the time of booking.
                </li>
              </ul>
            </section>

            <section>
              <h2>6. Use of Third-Party Services</h2>
              <p>We utilize third-party platforms including:</p>
              <ul>
                <li>Google Meet</li>
                <li>Google Calendar</li>
                <li>Google Drive</li>
                <li>PayPal</li>
              </ul>
              <p>
                Your use of these services is also governed by their respective
                terms and privacy policies.
              </p>
            </section>

            <section>
              <h2>7. Intellectual Property</h2>
              <p>
                All content, trademarks, logos, text, images, and software
                associated with the Service are the property of Huderma
                Dermatology Clinic and Aesthetics and may not be copied,
                reproduced, or distributed without prior written permission.
              </p>
            </section>

            <section>
              <h2>8. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, Huderma Dermatology
                Clinic and Aesthetics shall not be liable for any indirect,
                incidental, special, or consequential damages arising from the
                use of the Service.
              </p>
            </section>

            <section>
              <h2>9. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your access to the
                Service if you violate these Terms.
              </p>
            </section>

            <section>
              <h2>10. Changes to Terms</h2>
              <p>
                We may update these Terms from time to time. Continued use of
                the Service after changes become effective constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2>11. Contact</h2>
              <p>
                Huderma Dermatology Clinic and Aesthetics
                <br />
                Email: hudermaonline@gmail.com
              </p>
            </section>
          </div>

          {/* Acknowledgment Box */}
          <div className="mt-12 p-8 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Acknowledgment
            </h3>
            <p className="text-muted-foreground mb-4">
              By using Huderma Dermatology Clinic and Aesthetics, you
              acknowledge that you have read, understood, and agree to be bound
              by these Terms of Service. If you do not agree to these terms,
              please do not use our platform.
            </p>
            <p className="text-foreground font-semibold">
              For inquiries: hudermaonline@gmail.com
            </p>
          </div>
        </div>
      </div>

      <HomeFooter />
    </main>
  );
}
