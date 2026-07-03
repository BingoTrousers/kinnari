import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Mulish } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "KINNARI — Fine Thai Dining",
  description: "A refined reimagining of Thai cuisine, in the heart of Aldermere Quarter.",
  openGraph: {
    title: "KINNARI — Fine Thai Dining",
    description: "A refined reimagining of Thai cuisine, in the heart of Aldermere Quarter.",
    type: "website",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#17140f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${mulish.variable}`} data-scroll-behavior="smooth">
      <body
        style={{
          background: "#17140f",
          color: "#ece7de",
          fontFamily: "var(--font-mulish), sans-serif",
          overflowX: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}
