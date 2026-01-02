"use client";

import { useEffect, useState, useCallback } from "react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

type SystemStatus = {
  status: "online" | "offline" | "checking";
  database: string;
  timestamp?: string;
};

interface SystemStatusIndicatorProps {
  showLabel?: boolean;
  className?: string;
}

export function SystemStatusIndicator({ 
  showLabel = true,
  className 
}: SystemStatusIndicatorProps) {
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    status: "checking",
    database: "unknown",
  });

  const checkHealth = useCallback(async () => {
    try {
      setSystemStatus((prev) => ({ ...prev, status: "checking" }));
      const response = await fetch('/api/system/health', {
        cache: 'no-store',
      });
      const data = await response.json();
      
      setSystemStatus({
        status: data.status === "online" ? "online" : "offline",
        database: data.database || "unknown",
        timestamp: data.timestamp,
      });
    } catch (error) {
      console.error("Health check failed:", error);
      setSystemStatus({
        status: "offline",
        database: "disconnected",
      });
    }
  }, []);

  useEffect(() => {
    // Initial check
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(() => {
      checkHealth();
    }, 30000);

    return () => clearInterval(interval);
  }, [checkHealth]);

  const getStatusColor = () => {
    switch (systemStatus.status) {
      case "online":
        return "text-green-500";
      case "offline":
        return "text-red-500";
      case "checking":
        return "text-yellow-500";
      default:
        return "text-gray-500";
    }
  };

  const getStatusText = () => {
    switch (systemStatus.status) {
      case "online":
        return "System Online";
      case "offline":
        return "System Offline";
      case "checking":
        return "Checking...";
      default:
        return "Unknown";
    }
  };

  return (
    <Badge className={systemStatus.status === "offline" ? "bg-red-500/10 text-red-500 border-red-500/20" : systemStatus.status === "checking" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" : "bg-green-500/10 text-green-500 border-green-500/20" + (className ? ` ${className}` : "")}>
      <Circle 
        className={cn(
          "h-3 w-3 fill-current",
          getStatusColor(),
          systemStatus.status === "checking" && "animate-pulse"
        )} 
      />
      {showLabel && (
        <span className="text-sm font-medium">
          {getStatusText()}
        </span>
      )}
    </Badge>
  );
}
