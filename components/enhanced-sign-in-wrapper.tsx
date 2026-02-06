"use client"

import EnhancedSignIn from "@/components/enhanced-sign-in"

interface EnhancedSignInWrapperProps {
  onAuth: (user: { id: string; role: "patient" | "doctor" }) => void
}

export function EnhancedSignInWrapper({ onAuth }: EnhancedSignInWrapperProps) {
  return <EnhancedSignIn onAuth={onAuth} />
}
