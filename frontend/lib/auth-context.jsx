"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const bootstrap = async () => {
      const token = typeof window !== "undefined" && localStorage.getItem("preclinic_token");
      const cached = typeof window !== "undefined" && localStorage.getItem("preclinic_admin");

      if (cached) {
        try {
          setAdmin(JSON.parse(cached));
        } catch {
          /* ignore */
        }
      }

      if (token) {
        try {
          const { data } = await authApi.me();
          setAdmin(data.admin);
          localStorage.setItem("preclinic_admin", JSON.stringify(data.admin));
        } catch {
          localStorage.removeItem("preclinic_token");
          localStorage.removeItem("preclinic_admin");
          setAdmin(null);
        }
      }
      setLoading(false);
    };
    bootstrap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authApi.login({ email, password });
    localStorage.setItem("preclinic_token", data.token);
    localStorage.setItem("preclinic_admin", JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const register = useCallback(async (payload) => {
    const { data } = await authApi.register(payload);
    localStorage.setItem("preclinic_token", data.token);
    localStorage.setItem("preclinic_admin", JSON.stringify(data.admin));
    setAdmin(data.admin);
    return data.admin;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("preclinic_token");
    localStorage.removeItem("preclinic_admin");
    setAdmin(null);
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ admin, setAdmin, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
