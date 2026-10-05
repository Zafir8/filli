import type { Metadata, Viewport } from "next";
import { DM_Sans, Noto_Sans_Sinhala, Noto_Sans_Tamil, Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({ variable: "--font-playfair", subsets: ["latin"], style: ["normal", "italic"] });
// fillicafe.com uses ARS Maquette Pro (licensed); DM Sans is the closest free match.
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], weight: ["400", "500", "700", "900"] });
const sinhala = Noto_Sans_Sinhala({ variable: "--font-sinhala", subsets: ["sinhala"], weight: ["500"] });
const tamil = Noto_Sans_Tamil({ variable: "--font-tamil", subsets: ["tamil"], weight: ["500"] });

export const metadata: Metadata = {
  title: "FiLLi Cafe — Coming to Sri Lanka",
  description:
    "Dubai's original Zafran Chai is coming to Sri Lanka. Signature chai, global street bites, and a place where every cup starts a conversation.",
  openGraph: {
    title: "FiLLi Cafe — Coming to Sri Lanka",
    description: "Dubai's original Zafran Chai is on its way to Sri Lanka.",
    images: ["/img/filli-emblem.png"],
  },
};

export const viewport: Viewport = { themeColor: "#fff4ca" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable} ${sinhala.variable} ${tamil.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
