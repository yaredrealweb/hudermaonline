"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mail,
  Lock,
  User,
  Stethoscope,
  Users,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/language-context";
import { LanguageSwitcher } from "@/components/language-switcher";

interface EnhancedSignInProps {
  onAuth: (user: { id: string; role: "patient" | "doctor" }) => void;
}

export default function EnhancedSignIn({ onAuth }: EnhancedSignInProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<"patient" | "doctor">("patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    name?: string;
  }>({});
  const { t } = useLanguage();

  const validateEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    return value.length >= 8;
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!email) {
      newErrors.email = t("signIn.invalidEmail");
    } else if (!validateEmail(email)) {
      newErrors.email = t("signIn.invalidEmail");
    }

    if (!password) {
      newErrors.password = t("signIn.passwordTooShort");
    } else if (!validatePassword(password)) {
      newErrors.password = t("signIn.passwordTooShort");
    }

    if (mode === "register" && !name) {
      newErrors.name = "Full name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const userId = `${role}_${Date.now()}`;
    onAuth({ id: userId, role });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <LanguageSwitcher />
      </div>

      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-4 sm:gap-6 lg:gap-12 items-center">
        {/* Left side - Branding & Features - Hidden on mobile, shown on md and up */}
        <div className="hidden md:flex flex-col justify-center space-y-6 lg:space-y-8">
          <div>
            <div className="flex items-center gap-3 mb-6 lg:mb-8">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">
                {t("signIn.title")}
              </h1>
            </div>
            <p className="text-lg lg:text-xl text-slate-300 font-light mb-2">
              {t("signIn.subtitle")}
            </p>
            <p className="text-sm lg:text-base text-slate-400">
              Secure online consultations, anytime, anywhere
            </p>
          </div>

          {/* Features */}
          <div className="space-y-4 lg:space-y-6">
            <div className="flex gap-3 lg:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 lg:h-10 lg:w-10 rounded-lg bg-blue-600/20">
                  <Mail className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm lg:text-base">
                  Secure Communication
                </h3>
                <p className="text-slate-400 text-xs lg:text-sm">
                  End-to-end encrypted consultations
                </p>
              </div>
            </div>

            <div className="flex gap-3 lg:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 lg:h-10 lg:w-10 rounded-lg bg-blue-600/20">
                  <Users className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm lg:text-base">
                  Expert Doctors
                </h3>
                <p className="text-slate-400 text-xs lg:text-sm">
                  Connect with verified healthcare professionals
                </p>
              </div>
            </div>

            <div className="flex gap-3 lg:gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-8 w-8 lg:h-10 lg:w-10 rounded-lg bg-blue-600/20">
                  <Lock className="h-5 w-5 lg:h-6 lg:w-6 text-blue-400" />
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm lg:text-base">
                  Privacy First
                </h3>
                <p className="text-slate-400 text-xs lg:text-sm">
                  Your health data is completely confidential
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form - Responsive on all screen sizes */}
        <div className="w-full max-w-md">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
                {mode === "login"
                  ? t("signIn.signInTab")
                  : t("signIn.registerTab")}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                {mode === "login"
                  ? "Sign in to your account to continue"
                  : "Join Hudermaonline to get started"}
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6 sm:mb-8">
              <Label className="text-white font-semibold mb-2 sm:mb-3 block text-sm sm:text-base">
                {t("signIn.selectRole")}
              </Label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setRole("patient")}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
                    role === "patient"
                      ? "bg-blue-600 text-white border-2 border-blue-600"
                      : "bg-white/10 text-slate-300 border-2 border-white/20 hover:bg-white/20"
                  }`}
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">
                    {t("signIn.patient")}
                  </span>
                  <span className="sm:hidden">Patient</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`py-2 sm:py-3 px-3 sm:px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-xs sm:text-sm ${
                    role === "doctor"
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

            {/* Form */}
            <form onSubmit={handleAuth} className="space-y-4 sm:space-y-5">
              {mode === "register" && (
                <div>
                  <Label
                    htmlFor="name"
                    className="text-white mb-2 block text-sm"
                  >
                    {t("signIn.fullName")}
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name)
                          setErrors({ ...errors, name: undefined });
                      }}
                      className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 pl-10 focus:bg-white/20 focus:border-blue-400 text-sm"
                      required
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.name}
                    </p>
                  )}
                </div>
              )}

              <div>
                <Label
                  htmlFor="email"
                  className="text-white mb-2 block text-sm"
                >
                  {t("signIn.email")}
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email)
                        setErrors({ ...errors, email: undefined });
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 pl-10 focus:bg-white/20 focus:border-blue-400 text-sm"
                    required
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="text-white mb-2 block text-sm"
                >
                  {t("signIn.password")}
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password)
                        setErrors({ ...errors, password: undefined });
                    }}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-500 pl-10 focus:bg-white/20 focus:border-blue-400 text-sm"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
                {mode === "register" && password && password.length > 0 && (
                  <p className="text-slate-400 text-xs mt-2">
                    {validatePassword(password)
                      ? "✓ Password is strong"
                      : "Password must be at least 8 characters"}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 sm:py-2.5 rounded-lg transition-all mt-4 sm:mt-6 text-sm sm:text-base"
              >
                {mode === "login" ? t("signIn.signIn") : t("signIn.signUp")}
              </Button>
            </form>

            {/* Toggle Auth Mode */}
            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === "login" ? "register" : "login");
                  setErrors({});
                }}
                className="text-slate-400 hover:text-blue-400 transition-colors text-xs sm:text-sm"
              >
                {mode === "login"
                  ? t("signIn.dontHaveAccount")
                  : "Already have an account? "}
                <span className="text-blue-400 font-semibold">
                  {mode === "login" ? t("signIn.createOne") : "Sign in"}
                </span>
              </button>
            </div>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/10">
              <p className="text-slate-500 text-xs text-center">
                By continuing, you agree to our Terms of Service and Privacy
                Policy
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
