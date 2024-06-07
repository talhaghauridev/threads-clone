import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Topbar from "@/components/shared/TopBar";
import LeftSidebar from "@/components/shared/LeftSidebar";
import Bottombar from "@/components/shared/BottomBar";
import {dark} from "@clerk/themes"
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Threads",
  description: "A Nextjs 15 Meta Nextjs Application ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
    appearance={{
      baseTheme: dark,
    }}
    >
      <html lang="en">
        <body className={inter.className}>
          <Topbar />

          <main className="flex flex-row">
            <LeftSidebar />
            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>
            {/* @ts-ignore */}
            {/* <RightSidebar /> */}
          </main>

          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
