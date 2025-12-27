"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  ThemeColor,
  TextSize,
  THEME_COLORS,
  TEXT_SIZE_CONFIG,
  DEFAULT_THEME_COLOR,
  DEFAULT_TEXT_SIZE,
} from "@/lib/config/theme-colors";

interface StyleContextType {
  themeColor: ThemeColor;
  textSize: TextSize;
  setThemeColor: (color: ThemeColor) => void;
  setTextSize: (size: TextSize) => void;
}

const StyleContext = createContext<StyleContextType | undefined>(undefined);

export function useStyle() {
  const context = useContext(StyleContext);
  if (!context) {
    throw new Error("useStyle must be used within StyleProvider");
  }
  return context;
}

export function StyleProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [themeColor, setThemeColorState] = useState<ThemeColor>(DEFAULT_THEME_COLOR);
  const [textSize, setTextSizeState] = useState<TextSize>(DEFAULT_TEXT_SIZE);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("theme-color") as ThemeColor | null;
    const savedSize = localStorage.getItem("text-size") as TextSize | null;

    if (savedColor && savedColor in THEME_COLORS) {
      setThemeColorState(savedColor);
    }
    if (savedSize && savedSize in TEXT_SIZE_CONFIG) {
      setTextSizeState(savedSize);
    }
    setMounted(true);
  }, []);

  // Apply theme color CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const isDark = resolvedTheme === "dark";
    const colorConfig = THEME_COLORS[themeColor];
    const colors = isDark ? colorConfig.dark : colorConfig.light;

    // Override primary and secondary colors
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--secondary", colors.secondary);
    root.style.setProperty("--secondary-foreground", colors.secondaryForeground);
    root.style.setProperty("--accent", colors.accent);
    root.style.setProperty("--accent-foreground", colors.accentForeground);
    root.style.setProperty("--sidebar-primary", colors.sidebarPrimary);
    root.style.setProperty("--sidebar-accent", colors.sidebarAccent);
    root.style.setProperty("--ring", colors.ring);
  }, [themeColor, resolvedTheme, mounted]);

  // Apply text size CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const sizeConfig = TEXT_SIZE_CONFIG[textSize];

    root.style.fontSize = sizeConfig.base;
    root.style.setProperty("--text-scale", sizeConfig.scale);
  }, [textSize, mounted]);

  const setThemeColor = (color: ThemeColor) => {
    setThemeColorState(color);
    localStorage.setItem("theme-color", color);
  };

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem("text-size", size);
  };

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <StyleContext.Provider
      value={{
        themeColor,
        textSize,
        setThemeColor,
        setTextSize,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
}
