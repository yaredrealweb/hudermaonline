import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { HomeFooter } from "@/components/home-footer";
import Logo from "@/components/ui/logo";

export const metadata = {
  title: "Privacy Policy - Huderma Dermatology Clinic and Aesthetics",
  description:
    "Privacy Policy for Huderma Dermatology Clinic and Aesthetics - How we collect, use, disclose, and protect your information.",
};

export default function PrivacyPolicyPage() {
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
            PRIVACY POLICY
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
              <h2>1. Introduction</h2>
              <p>
                Huderma Dermatology Clinic and Aesthetics is committed to
                protecting the privacy and confidentiality of your personal and
                medical information. This Privacy Policy explains how we
                collect, use, disclose, and protect your information when you
                use our website, mobile application, and online consultation
                services.
              </p>
            </section>

            <section>
              <h2>2. Information We Collect</h2>
              <p>We may collect the following types of information:</p>
              <ul>
                <li>
                  Personal information such as name, email address, and phone
                  number
                </li>
                <li>Medical and consultation information</li>
                <li>Appointment scheduling information</li>
                <li>Payment confirmation details processed via PayPal</li>
                <li>
                  Technical and usage data relating to app performance and
                  security
                </li>
              </ul>
            </section>

            <section>
              <h2>3. How We Use Your Information</h2>
              <p>We use your information to:</p>
              <ul>
                <li>Provide medical treatment and dermatology consultations</li>
                <li>Maintain medical records</li>
                <li>Schedule appointments and follow-ups</li>
                <li>Process payments securely</li>
                <li>Communicate with you</li>
                <li>Improve service performance, security, and reliability</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section>
              <h2>4. Sharing and Disclosure of Information</h2>
              <p>Your information may be shared:</p>
              <ul>
                <li>With healthcare professionals involved in your care</li>
                <li>
                  With trusted service providers supporting our operations (such
                  as secure storage or scheduling systems)
                </li>
                <li>When required by law or public health authorities</li>
              </ul>
              <p>
                We do not sell your personal or medical information and do not
                use your medical information for marketing purposes without your
                consent.
              </p>
            </section>

            <section>
              <h2>5. Third-Party Services</h2>
              <p>We use the following third-party services:</p>
              <ul>
                <li>Google Meet (video consultations)</li>
                <li>Google Calendar (appointment scheduling)</li>
                <li>Google Drive (secure document storage)</li>
                <li>PayPal (payment processing)</li>
              </ul>
              <p>These services operate under their own privacy policies.</p>
            </section>

            <section>
              <h2>6. Data Security</h2>
              <p>
                We implement administrative, technical, and physical safeguards,
                including secure systems and restricted access controls, to
                protect your personal and medical information.
              </p>
            </section>

            <section>
              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li>Access and obtain copies of your medical records</li>
                <li>Request correction of inaccurate information</li>
                <li>Request restrictions on certain uses or disclosures</li>
                <li>Request confidential communications</li>
                <li>
                  Request access, correction, or deletion of personal data by
                  contacting us
                </li>
              </ul>
            </section>

            <section>
              <h2>8. Cookies and Analytics</h2>
              <p>
                Our website may use cookies or analytics tools to improve user
                experience and analyze traffic. By continuing to use our
                website, you agree to our use of cookies as described in this
                policy.
              </p>
            </section>

            <section>
              <h2>9. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically. The updated
                version will apply to all information we maintain once
                published.
              </p>
            </section>

            <section>
              <h2>10. Contact for Privacy Matters</h2>
              <p>
                Privacy Officer
                <br />
                Huderma Dermatology Clinic and Aesthetics
                <br />
                Email: hudermaonline@gmail.com
              </p>
            </section>
          </div>

          {/* Contact Box */}
          <div className="mt-12 p-8 bg-card border border-border rounded-lg">
            <h3 className="text-xl font-bold text-foreground mb-3">
              Questions About Our Privacy Practices?
            </h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions or concerns about this Privacy Policy or
              our privacy practices, please contact our Privacy Officer.
            </p>
            <p className="text-foreground font-semibold">
              Email: hudermaonline@gmail.com
            </p>
          </div>
        </div>
      </div>

      <HomeFooter />
    </main>
  );
}
