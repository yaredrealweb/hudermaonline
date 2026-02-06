"use client";

import { Label } from "@/components/ui/label";
import { useLanguage } from "@/lib/language-context";
import { UserRole } from "@/lib/types";
import { Stethoscope, User } from "lucide-react";

interface RoleSelectorProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function RoleSelector({ role, setRole }: RoleSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="mb-6 sm:mb-8">
      <Label className="text-white font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
        {t("signIn.selectRole")}
      </Label>
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={() => setRole("PATIENT")}
          className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
            role === "PATIENT"
              ? "bg-blue-600 text-white border-2 border-blue-600"
              : "bg-white/10 text-slate-300 border-2 border-white/20 hover:bg-white/20"
          }`}
        >
          <User className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t("signIn.patient")}</span>
          <span className="sm:hidden">Patient</span>
        </button>

        <button
          type="button"
          onClick={() => setRole("DOCTOR")}
          className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
            role === "DOCTOR"
              ? "bg-blue-600 text-white border-2 border-blue-600"
              : "bg-white/10 text-slate-300 border-2 border-white/20 hover:bg-white/20"
          }`}
        >
          <Stethoscope className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="hidden sm:inline">{t("signIn.doctor")}</span>
          <span className="sm:hidden">Doctor</span>
        </button>
      </div>
    </div>
  );
}
