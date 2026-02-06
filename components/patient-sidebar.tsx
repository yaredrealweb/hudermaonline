"use client"

import { useState } from "react"
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
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react"

interface PatientSidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  isOpen: boolean
  onToggle: () => void
}

export default function PatientSidebar({ activeTab, onTabChange, isOpen, onToggle }: PatientSidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, submenu: null },
    { id: "consultations", label: "My Consultations", icon: Calendar, submenu: null },
    { id: "prescriptions", label: "Prescriptions", icon: Pill, submenu: null },
    {
      id: "medical",
      label: "Medical Records",
      icon: FileText,
      submenu: [
        { id: "reports", label: "Lab Reports" },
        { id: "history", label: "Medical History" },
        { id: "documents", label: "Documents" },
      ],
    },
    { id: "demographics", label: "Patient Demographics", icon: MapPin, submenu: null },
    { id: "ratings", label: "Rate Doctors", icon: Star, submenu: null },
    { id: "messaging", label: "Messages", icon: MessageSquare, submenu: null },
    { id: "settings", label: "Settings", icon: Settings, submenu: null },
  ]

  const handleNavClick = (itemId: string) => {
    onTabChange(itemId)
    setExpandedMenu(null)
  }

  const toggleSubmenu = (itemId: string) => {
    setExpandedMenu(expandedMenu === itemId ? null : itemId)
  }

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-slate-950 to-slate-900 border-r border-slate-700/50 flex flex-col transition-all duration-300 ease-out shadow-2xl z-50 ${
        isOpen ? "w-64" : "w-20"
      }`}
    >
      {/* Header with Logo */}
      <div className="flex items-center justify-between h-20 px-4 border-b border-slate-700/50 flex-shrink-0">
        <div
          className={`flex items-center gap-3 transition-all duration-300 overflow-hidden ${
            isOpen ? "opacity-100 w-auto" : "opacity-0 w-0"
          }`}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div className="flex-shrink-0">
            <h2 className="text-sm font-bold text-white">Patient</h2>
            <p className="text-xs text-slate-400">Portal</p>
          </div>
        </div>

        <button
          onClick={onToggle}
          className="p-2 hover:bg-slate-800 rounded-lg transition-all duration-300 text-slate-400 hover:text-white flex-shrink-0 ml-auto"
          aria-label="Toggle sidebar"
          title={isOpen ? "Collapse" : "Expand"}
        >
          {isOpen ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                handleNavClick(item.id)
                if (item.submenu && isOpen) {
                  toggleSubmenu(item.id)
                }
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                activeTab === item.id
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
              }`}
              title={!isOpen ? item.label : ""}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && (
                <>
                  <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
                  {item.submenu && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                        expandedMenu === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </>
              )}
            </button>

            {/* Submenu */}
            {item.submenu && expandedMenu === item.id && isOpen && (
              <div className="mt-2 ml-4 space-y-1 border-l border-slate-700/50 pl-3">
                {item.submenu.map((subitem) => (
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
        ))}
      </nav>

      {/* Quick Info Section */}
      <div className="border-t border-slate-700/50 p-3 space-y-2 flex-shrink-0 bg-slate-900/50">
        {isOpen && (
          <>
            <div className="bg-blue-600/15 rounded-lg p-3 border border-blue-500/20">
              <p className="text-xs text-slate-400 mb-1">Next Consultation</p>
              <p className="font-semibold text-sm text-white">Dec 15, 2:00 PM</p>
            </div>
            <div className="bg-emerald-600/15 rounded-lg p-3 border border-emerald-500/20">
              <p className="text-xs text-slate-400 mb-1">Pending Prescriptions</p>
              <p className="font-semibold text-sm text-white">2 Active</p>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
