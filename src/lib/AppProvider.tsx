"use client";
import { usePathname } from "next/navigation";
import React, { memo, useMemo } from "react";
import { cn } from "./utils";
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return useMemo(
    () => (
      <div
        className={cn(
          "w-full max-w-full",
          pathname === "/onboarding" ? "hide-body" : " bg-dark-1'"
        )}
      >
        {children}
      </div>
    ),
    [pathname, children]
  );
};

export default memo(AppProvider);
