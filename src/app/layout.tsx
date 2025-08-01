import type { Metadata } from "next";
import { Inter, DM_Sans, Roboto } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";
import AppLayout from "./components/AppLayout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HyperVent",
  description: "HyperVent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-title" content="HyperVent" />
      </head>
      <body
        className={`${inter.variable} ${"areaFont.variable"} ${
          roboto.variable
        } ${dmSans.variable} antialiased`}
      >
        <NuqsAdapter><AppLayout>{children}</AppLayout></NuqsAdapter>
      </body>
    </html>
  );
}
