import React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import "../styles/globals.css";
import AppProvider from "@/lib/AppProvider";
import Bottombar from "@/components/shared/Bottombar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import RightSidebar from "@/components/shared/RightSidebar";
import Topbar from "@/components/shared/Topbar";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Next.js 13 Meta Threads application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={`${inter.className} bg-dark-1 `}>
          <AppProvider>
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
          </AppProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
