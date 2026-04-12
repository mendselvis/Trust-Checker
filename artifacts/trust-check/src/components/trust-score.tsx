import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TrustScoreProps {
  score: number;
  className?: string;
}

export function TrustScore({ score, className }: TrustScoreProps) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const animation = animate(count, score, {
      duration: 1.5,
      ease: "easeOut",
      onComplete: () => setIsDone(true),
    });

    return animation.stop;
  }, [count, score]);

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div className="relative flex items-center justify-center w-40 h-40">
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-muted/50"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className={cn(
              "transition-colors duration-500",
              score >= 70 ? "text-emerald-500" : score >= 40 ? "text-amber-500" : "text-rose-500"
            )}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: score / 100 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        <div className="flex flex-col items-center">
          <motion.span className="text-5xl font-semibold tracking-tighter tabular-nums">
            {rounded}
          </motion.span>
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase mt-1">
            Trust Score
          </span>
        </div>
      </div>
    </div>
  );
}
