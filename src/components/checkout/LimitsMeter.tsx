"use client";

import React from "react";
import { formatINR } from "@/lib/utils";
import { Flame, Lock, Trophy, Users } from "lucide-react";

interface LimitsMeterProps {
  maxSlots?: number | null;
  usedSlots?: number;
  totalCapPaise?: number | null;
  collectedPaise?: number;
  status: string;
}

export function LimitsMeter({
  maxSlots,
  usedSlots = 0,
  totalCapPaise,
  collectedPaise = 0,
  status,
}: LimitsMeterProps) {
  const isSlotsFull = maxSlots !== null && maxSlots !== undefined && usedSlots >= maxSlots;
  const isCapReached =
    totalCapPaise !== null && totalCapPaise !== undefined && collectedPaise >= totalCapPaise;
  const isLocked = isSlotsFull || isCapReached || status === "SLOTS_EXHAUSTED" || status === "CAP_REACHED";

  const slotPct = maxSlots ? Math.min(100, Math.round((usedSlots / maxSlots) * 100)) : null;
  const capPct = totalCapPaise
    ? Math.min(100, Math.round((collectedPaise / totalCapPaise) * 100))
    : null;

  const remainingSlots = maxSlots ? Math.max(0, maxSlots - usedSlots) : null;

  return (
    <div className="w-full flex flex-col gap-3 p-4 rounded-xl bg-[#f6f9fc] border border-[#e3e8ee]">
      {/* Status Banner */}
      {isLocked ? (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
          <Lock className="w-4 h-4 text-rose-600 shrink-0" />
          <span>
            {isSlotsFull || status === "SLOTS_EXHAUSTED"
              ? "All slots booked. Limit reached — new payments are locked."
              : "Campaign collection target reached. Thank you."}
          </span>
        </div>
      ) : (
        remainingSlots !== null && (
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-amber-700">
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Only {remainingSlots} {remainingSlots === 1 ? "seat" : "seats"} left!</span>
            </span>
            <span className="text-[#64748d] tabular-money">
              {usedSlots} of {maxSlots} booked
            </span>
          </div>
        )
      )}

      {/* Slots Progress Bar (Electric Indigo Fill) */}
      {slotPct !== null && (
        <div className="w-full">
          <div className="h-2 w-full bg-[#e3e8ee] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                isSlotsFull ? "bg-rose-500" : "bg-[#533afd]"
              }`}
              style={{ width: `${slotPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Aggregate Collection Target */}
      {totalCapPaise && (
        <div className="pt-2 border-t border-[#e3e8ee] flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-[#64748d]">
            <Trophy className="w-3.5 h-3.5 text-[#533afd]" />
            <span>Target: <span className="tabular-money">{formatINR(totalCapPaise)}</span></span>
          </div>
          <div className="text-[#0d253d] font-medium tabular-money">
            {formatINR(collectedPaise)} ({capPct}%)
          </div>
        </div>
      )}
    </div>
  );
}
