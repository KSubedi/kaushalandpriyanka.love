import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Kaushal & Priyanka",
  description: "Join us as we begin our journey together as the Subedis",
  openGraph: {
    title: "Kaushal & Priyanka's Wedding",
    description: "Join us as we begin our journey together as the Subedis",
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
    description: "Join us as we begin our journey together as the Subedis",
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
