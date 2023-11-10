import { cn } from "@/lib/utils";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jumba Developers",
  description: "Construction in Africa, Simplified",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(GeistSans.className, "dark")}>{children}</body>
    </html>
  );
}
