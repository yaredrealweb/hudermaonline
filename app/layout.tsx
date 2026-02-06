import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hudermaonline - Patient Consultation Platform",
  description:
    "Connect with healthcare professionals for secure online consultations",
  icons: {
    icon: [
      // {
      //   url: "/icon-light-32x32.png",
      //   media: "(prefers-color-scheme: light)",
      // },
      // {
      //   url: "/icon-dark-32x32.png",
      //   media: "(prefers-color-scheme: dark)",
      // },
      {
        url: "/logo.png",
        type: "image/svg+xml",
      },
    ],
    // apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          <LanguageProvider>
            {children}
            <Analytics />
          </LanguageProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}
