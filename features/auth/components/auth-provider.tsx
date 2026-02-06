"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}
