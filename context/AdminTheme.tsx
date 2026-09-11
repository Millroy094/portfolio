"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface AdminThemeContextType {
  theme: Theme;
  isDark: boolean;
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function AdminThemeProvider({ children }: { children: React.ReactNode }) {
  const [state] = useState<{ theme: Theme; mounted: boolean }>(() => {
    // Initialize from localStorage on first render
    if (typeof window === "undefined") {
      return { theme: "dark", mounted: false };
    }
    const savedTheme = localStorage.getItem("adminTheme") as Theme | null;
    return { theme: savedTheme ?? "dark", mounted: true };
  });

  useEffect(() => {
    // Save theme to localStorage whenever it changes
    localStorage.setItem("adminTheme", state.theme);
  }, [state.theme]);

  if (!state.mounted) return null;

  return (
    <AdminThemeContext.Provider value={{ theme: state.theme, isDark: state.theme === "dark" }}>
      {children}
    </AdminThemeContext.Provider>
  );
}

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (!context) {
    throw new Error("useAdminTheme must be used within AdminThemeProvider");
  }
  return context;
}
