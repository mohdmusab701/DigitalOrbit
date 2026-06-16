import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/frontend/styles/globals.css";
import { ThemeProvider } from '@/frontend/hooks/useTheme';
import Navbar from '@/frontend/components/layout/Navbar';
import Footer from '@/frontend/components/layout/Footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
 title: "DigitalOrbit | Build Smarter. Grow Faster. Orbit Higher.",
 description: "We craft premium digital experiences that help businesses build smarter, grow faster, and orbit higher in the digital space.",
};

export const viewport: Viewport = {
 themeColor: [
 { media: "(prefers-color-scheme: light)", color: "#ffffff" },
 { media: "(prefers-color-scheme: dark)", color: "#0a0e1a" },
 ],
};

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
 <html lang="en" suppressHydrationWarning>
 <body className={`${inter.className} bg-background text-foreground antialiased selection:bg-primary-500/30 transition-colors duration-300`}>
 <ThemeProvider>
 <Navbar />
 <main className="min-h-screen pt-16 lg:pt-20">
 {children}
 </main>
 <Footer />
 </ThemeProvider>
 </body>
 </html>
 );
}
