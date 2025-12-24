"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Role } from "@/lib/types";

interface Claims {
  sub?: string; // accountId
  email?: string;
  role?: Role;
  user_metadata?: {
    name?: string;
    contactNumber?: string;
    avatarUrl?: string;
    // Student specific fields
    studentId?: string;
    program?: string;
    semester?: number;
    yearOfStudy?: number;
    // Staff specific fields
    staffId?: string;
    department?: string;
    position?: string;
    [key: string]: string | number | boolean | null | undefined;
  };
  created_at?: string;
  updated_at?: string;
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

  // Load claims from sessionStorage on mount
  useEffect(() => {
    // Skip sessionStorage loading if we already have initialClaims
    if (initialClaims !== null) return;

    const savedClaims = sessionStorage.getItem("user-claims");
    if (savedClaims) {
      try {
        const parsedClaims = JSON.parse(savedClaims);
        setClaims(parsedClaims);
      } catch (error) {
        console.error("Failed to parse saved claims:", error);
        sessionStorage.removeItem("user-claims");
      }
    }
  }, [initialClaims]);

  // Save claims to sessionStorage whenever they change
  const updateClaims = (newClaims: Claims | null) => {
    setClaims(newClaims);
    if (newClaims && Object.keys(newClaims).length > 0) {
      sessionStorage.setItem("user-claims", JSON.stringify(newClaims));
    } else {
      sessionStorage.removeItem("user-claims");
    }
  };

  const value: AuthContextValue = {
    claims: claims,
    isAuthenticated: !!claims && Object.keys(claims).length > 0,
    setClaims: updateClaims,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
