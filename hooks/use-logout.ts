"use client";

import { useRouter } from "next/navigation";
import { logout as apiLogout } from "@/lib/api/auth";
import { useAuth } from "@/lib/context/auth-provider";

export function useLogout() {
  const router = useRouter();
  const { setClaims } = useAuth();

  const logout = async () => {
    await apiLogout();
    setClaims(null);
    router.push("/auth/login");
  };

  return { logout };
}
