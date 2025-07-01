import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "./components/Header";
import { Footer } from "./components/Footer";
import AuthWrapper from "./AuthWrapper";
import { Providers } from "./Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cognis - Smarter notes for smarter minds",
  description: "A modern learning platform for computer science students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-primary text-text antialiased`}
      >
        <Providers>
          <AuthWrapper>
            <Header />
            <div className="flex flex-col min-h-[calc(100vh-4.5rem)]">
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </AuthWrapper>
        </Providers>
      </body>
    </html>
  );
}
