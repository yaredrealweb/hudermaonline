"use client";

import { useState } from "react";
import {
  Home,
  Calendar,
  FileText,
  MessageSquare,
  Pill,
  Settings,
  Heart,
  MapPin,
  Star,
  Users,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  LogOut,
  Menu,
  Timer,
} from "lucide-react";
import { useGetProfile } from "@/hooks/use-auth-mutation";
import { UserRole } from "@/lib/types";
import { LanguageSwitcher } from "../language-switcher";
import { Button } from "../ui/button";
import { useLanguage } from "@/lib/language-context";
import { signOut } from "@/lib/auth/auth-client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  submenu?: { id: string; label: string; href?: string }[];
  href?: string;
}

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

function Sidebar({ activeTab, onTabChange, isOpen, onToggle }: SidebarProps) {
  const router = useRouter();
  const { data } = useGetProfile();
  const role = data?.role as UserRole;

  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] =
    role === "PATIENT"
      ? [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            href: "/patient/dashboard",
          },
          {
            id: "appointments",
            label: "My appointments",
            icon: Calendar,
            href: "/patient/appointments",
          },
          {
            id: "ratings",
            label: "Rate doctors",
            icon: Star,
            href: "/patient/rating",
          },
          {
            id: "prescriptions",
            label: "Prescriptions",
            icon: Pill,
            href: "/patient/prescriptions",
          },
          {
            id: "medical",
            label: "Medical Reports",
            icon: FileText,
            href: "/patient/medical-reports",
          },
          // { id: "demographics", label: "Patient Demographics", icon: MapPin },
          // { id: "ratings", label: "Rate Doctors", icon: Star },
          {
            id: "messaging",
            label: "Messages",
            icon: MessageSquare,
            href: "/patient/messages",
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            href: "/patient/settings",
          },
        ]
      : [
          {
            id: "dashboard",
            label: "Dashboard",
            icon: Home,
            href: "/doctor/dashboard",
          },
          {
            id: "appointments",
            label: "Appointments",
            icon: Calendar,
            href: "/doctor/appointments",
          },
          {
            id: "availability",
            label: "Availability",
            icon: Timer,
            href: "/doctor/availability",
          },
          {
            id: "patients",
            label: "Patients",
            icon: Users,
            href: "/doctor/patients",
          },
          {
            id: "demography",
            label: "Patient Demography",
            icon: MapPin,
            href: "/doctor/demography",
          },
          {
            id: "prescriptions",
            label: "Prescriptions",
            icon: FileText,
            href: "/doctor/prescriptions",
          },
          {
            id: "medical-reports",
            label: "Medical Reports",
            icon: FileText,
            href: "/doctor/medical-reports",
          },
          {
            id: "messaging",
            label: "Patient Messages",
            icon: MessageSquare,
            href: "/doctor/messages",
          },
          {
            id: "settings",
            label: "Settings",
            icon: Settings,
            href: "/doctor/settings",
          },
          {
            id: "help",
            label: "Patient Testimonials",
            icon: FileText,
            href: "/doctor/testimonials",
          },
        ];

  const LogoIcon = role === "PATIENT" ? Heart : Stethoscope;
  const portalTitle = role === "PATIENT" ? "PATIENT" : "DOCTOR";

  const toggleSubmenu = (itemId: string) => {
    setExpandedMenu(expandedMenu === itemId ? null : itemId);
  };

  const handleItemClick = (itemId: string, hasSubmenu: boolean) => {
    if (hasSubmenu && isOpen) {
      toggleSubmenu(itemId);
    } else {
      onTabChange(itemId);
      setExpandedMenu(null);
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-950 to-slate-900 border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-out shadow-2xl z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      <div className="flex items-center justify-between h-20 px-4 border-b border-slate-700/50 shrink-0">
        <div
          className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${
            isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <LogoIcon className="w-6 h-6 text-white" />
          </div>
          <div className="shrink-0">
            <h2 className="text-sm font-bold text-white">{portalTitle}</h2>
            <p className="text-xs text-slate-400">Portal</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="p-2 hover:bg-slate-800 rounded-lg transition-all duration-300 text-slate-400 hover:text-white shrink-0 ml-auto"
          aria-label="Toggle sidebar"
          title={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => {
          const hasSubmenu = !!item.submenu?.length;
          const isExpanded = expandedMenu === item.id;

          return (
            <div key={item.id}>
              <button
                onClick={() => {
                  handleItemClick(item.id, hasSubmenu);
                  if (item.href && !hasSubmenu) {
                    router.push(item.href);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                  activeTab === item.id ||
                  item.submenu?.some((sub) => sub.id === activeTab)
                    ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                }`}
                title={!isOpen ? item.label : ""}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                {isOpen && (
                  <>
                    <span className="text-sm font-medium flex-1 text-left">
                      {item.label}
                    </span>
                    {hasSubmenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 shrink-0 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </>
                )}
              </button>

              {hasSubmenu && isExpanded && isOpen && (
                <div className="mt-2 ml-4 space-y-1 border-l border-slate-700/50 pl-3">
                  {item.submenu!.map((subitem) => (
                    <button
                      key={subitem.id}
                      onClick={() => onTabChange(subitem.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                        activeTab === subitem.id
                          ? "bg-blue-600/15 text-blue-400 font-medium"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                      }`}
                    >
                      {subitem.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* <div className="border-t border-slate-700/50 p-3 space-y-2 shrink-0 bg-slate-900/50">
        {isOpen && (
          <>
            {role === "PATIENT" ? (
              <>
                <div className="bg-blue-600/15 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-xs text-slate-400 mb-1">
                    Next Consultation
                  </p>
                  <p className="font-semibold text-sm text-white">
                    Dec 15, 2:00 PM
                  </p>
                </div>
                <div className="bg-emerald-600/15 rounded-lg p-3 border border-emerald-500/20">
                  <p className="text-xs text-slate-400 mb-1">
                    Pending Prescriptions
                  </p>
                  <p className="font-semibold text-sm text-white">2 Active</p>
                </div>
              </>
            ) : (
              <>
                <div className="bg-blue-600/15 rounded-lg p-3 border border-blue-500/20">
                  <p className="text-xs text-slate-400 mb-1">
                    Today's Schedule
                  </p>
                  <p className="font-semibold text-sm text-white">
                    5 Appointments
                  </p>
                </div>
                <div className="bg-emerald-600/15 rounded-lg p-3 border border-emerald-500/20">
                  <p className="text-xs text-slate-400 mb-1">
                    Pending Requests
                  </p>
                  <p className="font-semibold text-sm text-white">3 New</p>
                </div>
              </>
            )}
          </>
        )}
      </div> */}
    </aside>
  );
}

export default function UnifiedSidebar(children: {
  children: React.ReactNode;
}) {
  const { data } = useGetProfile();
  const router = useRouter();
  const handleLogout = () => {
    signOut();
    router.push("/auth/login");
  };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const { t } = useLanguage();

  return (
    <div className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 flex overflow-hidden">
      <div className={cn(sidebarOpen ? "block" : "hidden", "md:block")}>
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
      <main
        className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "md:ml-20"
        }`}
      >
        <header className="border-b border-white/10 bg-white/10 backdrop-blur-md shrink-0 z-30">
          <div className="px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {" "}
                <Menu className="w-5 h-5 text-white" />
              </button>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  {t("nav.dashboard")}
                </h1>
                <p className="text-xs sm:text-sm text-slate-300">
                  {data?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSwitcher />
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-white/5 text-xs sm:text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">{t("general.logout")}</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto mt-10 px-3 min-h-screen">
          {children.children}
        </div>
      </main>
    </div>
  );
}
