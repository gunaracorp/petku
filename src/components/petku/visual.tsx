"use client";

import { Star, StarHalf } from "lucide-react";
import { cn } from "@/lib/utils";

export const COLOR_GRADIENTS: Record<string, string> = {
  orange: "from-orange-100 to-amber-200",
  rose: "from-rose-100 to-pink-200",
  amber: "from-amber-100 to-yellow-200",
  emerald: "from-emerald-100 to-teal-200",
  lime: "from-lime-100 to-green-200",
  teal: "from-teal-100 to-cyan-200",
};

export function ProductVisual({
  emoji,
  color,
  size = "md",
  className,
}: {
  emoji: string;
  color: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}) {
  const sizes = {
    sm: "h-14 w-14 text-3xl rounded-xl",
    md: "h-24 w-24 text-5xl rounded-2xl",
    lg: "h-32 w-32 text-7xl rounded-3xl",
    xl: "h-40 w-40 text-8xl rounded-3xl",
  };
  return (
    <div
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center bg-gradient-to-br select-none",
        COLOR_GRADIENTS[color] ?? COLOR_GRADIENTS.orange,
        sizes[size],
        className
      )}
    >
      <span className="drop-shadow-sm">{emoji}</span>
    </div>
  );
}

export function Stars({ rating, className }: { rating: number; className?: string }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.4;
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Rating ${rating} dari 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full)
          return <Star key={i} className="size-3.5 fill-amber-400 text-amber-400" />;
        if (i === full && half)
          return (
            <span key={i} className="relative inline-flex">
              <Star className="size-3.5 text-amber-400" />
              <StarHalf className="absolute inset-0 size-3.5 fill-amber-400 text-amber-400" />
            </span>
          );
        return <Star key={i} className="size-3.5 text-amber-400" />;
      })}
    </span>
  );
}
