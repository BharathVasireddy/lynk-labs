"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: 'include' // Ensure cookies are included
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else {
        // If 401 or other error, user is not authenticated
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      // First clear user state to prevent UI flicker
      setUser(null);
      
      // Call logout API to clear server-side cookie
      await fetch("/api/auth/logout", {
        method: "POST",
      });
      
      // Force redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Even if API fails, clear user state and redirect
      setUser(null);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
} 