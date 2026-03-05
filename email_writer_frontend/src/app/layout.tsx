import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import { DraftProvider } from "@/lib/draft";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Email Craft Pro",
  description: "Retro-themed AI email writer (generate, edit, copy, export, save history).",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <DraftProvider>
            <AppShell>{children}</AppShell>
          </DraftProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
