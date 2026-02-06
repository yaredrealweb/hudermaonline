import { LanguageSwitcher } from "@/components/language-switcher";
import Logo from "@/components/ui/logo";
import { Mail, Stethoscope, Users, Lock } from "lucide-react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center">
        <div className="hidden md:flex flex-col justify-center space-y-6 lg:space-y-8">
          <div>
            <Logo />
            <p className="text-lg lg:text-xl text-slate-300 font-light mb-2">
              Healthcare Consultation Platform
            </p>
            <p className="text-sm lg:text-base text-slate-400">
              Secure online consultations, anytime, anywhere
            </p>
          </div>

          <div className="space-y-4 lg:space-y-6">
            {[
              {
                icon: Mail,
                title: "Secure Communication",
                desc: "End-to-end encrypted consultations",
              },
              {
                icon: Users,
                title: "Expert Doctors",
                desc: "Connect with verified healthcare professionals",
              },
              {
                icon: Lock,
                title: "Privacy First",
                desc: "Your health data is completely confidential",
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-3 lg:gap-4">
                <div className="shrink-0">
                  <div className="flex items-center justify-center h-8 w-8 lg:h-10 lg:w-10 rounded-lg bg-blue-600/20">
                    <item.icon className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm lg:text-base">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs lg:text-sm">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
