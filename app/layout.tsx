import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kaushalandpriyanka.love"),
  title: "Kaushal & Priyanka's Wedding",
  description: "Join us in celebrating our special day!",
  openGraph: {
    title: "Kaushal & Priyanka's Wedding",
    description: "Join us in celebrating our special day!",
    url: "https://kaushalandpriyanka.love",
    siteName: "Kaushal & Priyanka's Wedding",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kaushal & Priyanka's Wedding",
    description: "Join us in celebrating our special day!",
    images: ["/api/og"],
  },
  icons: {
    icon: [
      {
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased ${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
