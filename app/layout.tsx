import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/context/theme-provder";
import { StructuredData } from "@/components/seo/structured-data";
import { WebVitals } from "@/components/seo/web-vitals";
import AuthProvider from "@/lib/context/auth-provider";
import { Toaster } from "sonner";
import { StyleProvider } from "@/lib/context/style-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "CyberSafe Platform",
  description: "CyberSafe Platform - Empowering Cybercrime Reporting and Awareness",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <head>
        <StructuredData />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/Cybersafe_logo.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-250.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <StyleProvider>
      <body className="bg-background text-foreground">
        <WebVitals />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              {children}
            </main>
          </ThemeProvider>
        </AuthProvider>
        <Toaster position="bottom-right" richColors />
      </body>
      </StyleProvider>
    </html>
  );
}
