"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  TextSize,
  TEXT_SIZE_CONFIG,
  DEFAULT_TEXT_SIZE,
} from "@/lib/config/theme-colors";

interface StyleContextType {
  textSize: TextSize;
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
  const [textSize, setTextSizeState] = useState<TextSize>(DEFAULT_TEXT_SIZE);
  const [mounted, setMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedSize = localStorage.getItem("text-size") as TextSize | null;

    if (savedSize && savedSize in TEXT_SIZE_CONFIG) {
      setTextSizeState(savedSize);
    }
    setMounted(true);
  }, []);

  // Apply text size CSS variables
  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const sizeConfig = TEXT_SIZE_CONFIG[textSize];

    root.style.fontSize = sizeConfig.base;
    root.style.setProperty("--text-scale", sizeConfig.scale);
  }, [textSize, mounted]);


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
        textSize,
        setTextSize,
      }}
    >
      {children}
    </StyleContext.Provider>
  );
}
