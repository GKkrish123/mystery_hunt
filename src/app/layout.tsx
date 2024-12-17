import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { TRPCReactProvider } from "@/trpc/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth-provider";

export const metadata: Metadata = {
  title: "GKrish Mysteryverse",
  description: "A realm of endless mysteries waiting to be uncovered.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body className="relative h-screen max-w-[3500px]">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          storageKey="mystery-theme"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <TRPCReactProvider>
              {children}
              <Toaster position="bottom-center" />
            </TRPCReactProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
