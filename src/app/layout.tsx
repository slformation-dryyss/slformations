import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/auth/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SL Formations",
  description: "SL Formations - Formations Permis, VTC, Taxi et Sécurité",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} antialiased bg-navy-900 text-white`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
