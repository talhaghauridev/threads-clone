"use client";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";
import { usePathname } from "next/navigation";
import React, { memo, useMemo } from "react";

const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return useMemo(
    () => (
      <>
        {pathname === "/onboarding" ? (
          <div className="w-full max-w-full  bg-dark-1">{children}</div>
        ) : (
          <>
            <Topbar />

            <main className="flex flex-row">
              <LeftSidebar />
              <section className="main-container">
                <div className="w-full max-w-4xl">{children}</div>
              </section>
              <RightSidebar />
            </main>

            <Bottombar />
          </>
        )}
      </>
    ),
    [pathname]
  );
};

export default memo(AppProvider);
