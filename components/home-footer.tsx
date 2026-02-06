"use client";

import Link from "next/link";
import Logo from "./ui/logo";

export function HomeFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Footer Content */}
        <div className="grid md:grid-cols-3 gap-20 mb-12">
          {/* Brand */}
          <div>
            <Logo />
            <p className="text-muted-foreground text-sm">
              Secure online consultations with healthcare professionals,
              anytime, anywhere.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#features"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Features
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/25 pt-4">
          {/* Bottom Section */}
          <div className="flex flex-col md:flex-row justify-center items-center">
            <p className="text-muted-foreground text-base text-center">
              © {currentYear} Hudermaonline. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
