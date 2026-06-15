import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/frontend/styles/globals.css";
import { ThemeProvider } from "@/frontend/hooks/useTheme";
import Navbar from "@/frontend/components/layout/Navbar";
import Footer from "@/frontend/components/layout/Footer";
import ChatWidget from "@/frontend/components/ChatWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalorbit.agency"),
  title: {
    default: "DigitalOrbit | Build Smarter. Grow Faster. Orbit Higher.",
    template: "%s | DigitalOrbit",
  },
  description:
    "We craft premium digital experiences that help businesses build smarter, grow faster, and orbit higher in the digital space.",
  keywords: ["Web Development", "Mobile Apps", "UI/UX Design", "AI Solutions", "Digital Marketing"],
  authors: [{ name: "DigitalOrbit" }],
  openGraph: {
    title: "DigitalOrbit | Premium Digital Agency",
    description: "Build smarter, grow faster, and orbit higher with our premium digital services.",
    url: "https://digitalorbit.agency",
    siteName: "DigitalOrbit",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalOrbit | Premium Digital Agency",
    description: "Build smarter, grow faster, and orbit higher with our premium digital services.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} bg-white dark:bg-dark-bg text-slate-900 dark:text-slate-50 antialiased selection:bg-primary-500/30`}
      >
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen pt-16 lg:pt-20">{children}</main>
          <Footer />
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}

