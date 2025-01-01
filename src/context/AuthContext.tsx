"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; path=/; expires=${expires}; HttpOnly; Secure; SameSite=Strict`;
};

const getCookie = (name: string) => {
  if (typeof window !== "undefined") {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
  }
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Strict`;
};

interface AuthContextType {
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = getCookie("auth_token");
    const role = getCookie("role");

    if (token) {
      setUser({ token, role });
    }
  }, []);

  const login = (userData: any) => {
    const { token, role } = userData;

    setUser(userData);
    setCookie("auth_token", token);
    setCookie("role", role);
  };

  const logout = () => {
    setUser(null);
    deleteCookie("auth_token");
    deleteCookie("role");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
