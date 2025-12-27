"use client";

import { useTheme } from "next-themes";
import { useStyle } from "@/lib/context/style-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Moon, Sun, Monitor } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { THEME_COLORS, ThemeColor } from "@/lib/config/theme-colors";

export default function DisplaySettingsPage() {
  const { setTheme, theme } = useTheme();
  const { themeColor, textSize, setThemeColor, setTextSize } = useStyle();
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Display</h3>
        <p className="text-sm text-muted-foreground">
          Customize the appearance of the application.
        </p>
      </div>
      <Separator />

      <div className="space-y-8">
        {/* Theme Mode */}
        <div className="space-y-4">
          <div>
            <Label className="text-base">Theme Mode</Label>
            <p className="text-sm text-muted-foreground">
              Select the theme for the dashboard.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Button
              variant="outline"
              className={`h-24 flex-col gap-2 ${
                theme === "light" ? "border-primary border-2" : ""
              }`}
              onClick={() => setTheme("light")}
            >
              <Sun className="h-6 w-6" />
              Light
            </Button>
            <Button
              variant="outline"
              className={`h-24 flex-col gap-2 ${
                theme === "dark" ? "border-primary border-2" : ""
              }`}
              onClick={() => setTheme("dark")}
            >
              <Moon className="h-6 w-6" />
              Dark
            </Button>
            <Button
              variant="outline"
              className={`h-24 flex-col gap-2 ${
                theme === "system" ? "border-primary border-2" : ""
              }`}
              onClick={() => setTheme("system")}
            >
              <Monitor className="h-6 w-6" />
              System
            </Button>
          </div>
        </div>

        <Separator />

        {/* Text Size */}
        <div className="space-y-4">
          <div>
            <Label className="text-base">Text Size</Label>
            <p className="text-sm text-muted-foreground">
              Adjust the font size for better readability.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant={textSize === "small" ? "default" : "outline"}
              onClick={() => {
                setTextSize("small");
                toast.success("Text size set to Small");
              }}
              className="w-24"
            >
              <span className="text-xs">Small</span>
            </Button>
            <Button
              variant={textSize === "medium" ? "default" : "outline"}
              onClick={() => {
                setTextSize("medium");
                toast.success("Text size set to Medium");
              }}
              className="w-24"
            >
              <span className="text-base">Medium</span>
            </Button>
            <Button
              variant={textSize === "large" ? "default" : "outline"}
              onClick={() => {
                setTextSize("large");
                toast.success("Text size set to Large");
              }}
              className="w-24"
            >
              <span className="text-lg">Large</span>
            </Button>
          </div>
        </div>

        <Separator />

        {/* Theme Color */}
        <div className="space-y-4">
          <div>
            <Label className="text-base">Theme Color</Label>
            <p className="text-sm text-muted-foreground">
              Select the primary color for the dashboard.
            </p>
          </div>
          <div className="grid grid-cols-5 gap-4">
            {(Object.keys(THEME_COLORS) as ThemeColor[]).map((color) => (
              <div
                key={color}
                className={`cursor-pointer rounded-md border-2 p-1 transition-all ${
                  themeColor === color
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted"
                }`}
                onClick={() => {
                  setThemeColor(color);
                  toast.success(`Theme color set to ${THEME_COLORS[color].name}`);
                }}
              >
                <div 
                  className={`h-10 w-full rounded-sm ${
                    color === 'blue' ? 'bg-blue-500' :
                    color === 'green' ? 'bg-green-500' :
                    color === 'orange' ? 'bg-orange-500' :
                    color === 'red' ? 'bg-red-500' :
                    'bg-violet-500'
                  }`} 
                />
                <div className="mt-2 text-center text-xs capitalize">
                  {THEME_COLORS[color].name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
