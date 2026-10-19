"use client";

import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  initialSeconds?: number;
  expiresAt?: string | Date;
  onExpire?: () => void;
}

export function CountdownTimer({
  initialSeconds = 900, // 15 minutes default
  expiresAt,
  onExpire,
}: CountdownTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(() => {
    if (expiresAt) {
      const diff = Math.floor((new Date(expiresAt).getTime() - Date.now()) / 1000);
      return Math.max(0, diff);
    }
    return initialSeconds;
  });

  useEffect(() => {
    if (secondsRemaining <= 0) {
      onExpire?.();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, onExpire]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 120; // Under 2 minutes

  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium transition-colors ${
        isUrgent
          ? "bg-rose-500/10 text-rose-400 border border-rose-500/30 animate-pulse"
          : "bg-slate-800 text-slate-300 border border-slate-700"
      }`}
    >
      <Clock className={`w-3.5 h-3.5 ${isUrgent ? "text-rose-400" : "text-emerald-400"}`} />
      <span>Session expires in:</span>
      <span className="font-bold text-white tracking-wider">{formattedTime}</span>
    </div>
  );
}
