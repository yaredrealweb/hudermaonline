"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/lib/types";

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, userRole, isLoading, user } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }
      if (user && user.emailVerified === false) {
        router.push(
          "/auth/verify-email?email=" + encodeURIComponent(user.email)
        );
        return;
      }
      if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
        router.push("/unauthorized");
      }
    }
  }, [
    isAuthenticated,
    userRole,
    isLoading,
    requiredRoles,
    redirectTo,
    router,
    user,
  ]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }
  if (user && user.emailVerified === false) {
    return null;
  }
  if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
    return null;
  }
  return <>{children}</>;
}
