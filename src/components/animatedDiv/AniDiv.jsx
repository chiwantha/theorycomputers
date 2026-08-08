import { cn } from "@/lib/utils";
import React from "react";

const AniDiv = ({ children, className, delayIndex = 0 }) => {
  return (
    <div
      style={{
        animationDelay: `${delayIndex * 100}ms`,
      }}
      className={cn("animate-fade-up opacity-0", className)}
    >
      {children}
    </div>
  );
};

export default AniDiv;
