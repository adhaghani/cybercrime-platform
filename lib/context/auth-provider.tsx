"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import { Role } from "@/lib/types";

interface Claims {
  ACCOUNT_ID?: string; // accountId
  EMAIL?: string;
  ROLE?: Role;
  NAME?: string;
  CONTACT_NUMBER?: string;
  AVATAR_URL?: string;
  ACCOUNT_TYPE?: string;
  // student specific fields
  STUDENT_ID?: string;
  PROGRAM?: string;
  SEMESTER?: number;
  YEAR_OF_STUDY?: number;
  // Staff specific fields
  STAFF_ID?: string;
  DEPARTMENT?: string;
  POSITION?: string;
  CREATED_AT?: string;
  UPDATED_AT?: string;
}

type AuthContextValue = {
  claims: Claims | null;
  isAuthenticated: boolean;
  setClaims: (c: Claims | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export default function AuthProvider({
  children,
  initialClaims = null,
}: {
  children: React.ReactNode;
  initialClaims?: Claims | null;
}) {
  const [claims, setClaims] = useState<Claims | null>(initialClaims);

  // No sessionStorage - auth state is managed by HttpOnly cookies server-side
  const updateClaims = useCallback((newClaims: Claims | null) => {
    setClaims(newClaims);
  }, []);

  const value: AuthContextValue = useMemo(() => ({
    claims: claims,
    isAuthenticated: !!claims && Object.keys(claims).length > 0,
    setClaims: updateClaims,
  }), [claims, updateClaims]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
