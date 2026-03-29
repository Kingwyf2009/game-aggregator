import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FreeGameZone - Play Free Online Games",
  description:
    "Play hundreds of free online games including action, puzzle, racing and more. New games added daily!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 text-white min-h-screen`}>
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition">
              🎮 FreeGameZone
            </Link>
            <nav className="hidden md:flex gap-6 text-sm text-gray-300">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <Link href="/games" className="hover:text-white transition">All Games</Link>
              <Link href="/new" className="hover:text-white transition">New Games</Link>
            </nav>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800 py-8 text-center text-gray-500 text-sm">
          <p>© 2026 FreeGameZone · Free Online Games · New games added daily</p>
        </footer>
      </body>
    </html>
  );
}
