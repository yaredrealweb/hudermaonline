"use client";

import {
  Home,
  Calendar,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface DoctorSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export default function DoctorSidebar({
  activeTab,
  onTabChange,
  isOpen,
  onToggle,
}: DoctorSidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "appointments", label: "Appointments", icon: Calendar },
    { id: "patients", label: "Patients", icon: Users },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "messaging", label: "Patient Messages", icon: MessageSquare },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "help", label: "Patient Testimonials", icon: FileText },
  ];

  const handleNavClick = (itemId: string) => {
    onTabChange(itemId);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-linear-to-b from-slate-950 to-slate-900 border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-out shadow-2xl z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-slate-700/50 shrink-0">
        <div
          className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${
            isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
            <Stethoscope className="w-6 h-6 text-white" />
          </div>
          <div className="shrink-0">
            <h2 className="text-sm font-bold text-white">Doctor</h2>
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

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => handleNavClick(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
              activeTab === item.id
                ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
            }`}
            title={!isOpen ? item.label : ""}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            {isOpen && (
              <span className="text-sm font-medium flex-1 text-left">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats Section */}
      <div className="border-t border-slate-700/50 p-3 space-y-2 shrink-0 bg-slate-900/50">
        {isOpen && (
          <>
            <div className="bg-blue-600/15 rounded-lg p-3 border border-blue-500/20">
              <p className="text-xs text-slate-400 mb-1">Today's Schedule</p>
              <p className="font-semibold text-sm text-white">5 Appointments</p>
            </div>
            <div className="bg-emerald-600/15 rounded-lg p-3 border border-emerald-500/20">
              <p className="text-xs text-slate-400 mb-1">Pending Requests</p>
              <p className="font-semibold text-sm text-white">3 New</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
