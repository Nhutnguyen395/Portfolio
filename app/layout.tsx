import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono, Instrument_Serif, Gupter } from "next/font/google";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const serif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

// sturdier serif for headings that need weight (project titles)
const display = Gupter({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-gupter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Nhut Nguyen",
  description: "A living 3D index of scale, cinema & personal artifacts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable} ${display.variable} h-full`}>
      <body className="gallery-grid relative min-h-screen w-full overflow-x-hidden selection:bg-neutral-900 selection:text-white select-none bg-gallery text-ink font-mono antialiased">
        {children}
      </body>
    </html>
  );
}