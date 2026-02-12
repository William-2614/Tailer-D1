import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Tailer - Transparent Betting Platform',
  description: 'A social platform where bettors post verified bet slips before games start. AI-verified, transparent, and immutable.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-gray-800 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tailer</h1>
            <div className="space-x-4">
              <a href="/" className="hover:text-gray-300">Home</a>
              <a href="/bets" className="hover:text-gray-300">Bets</a>
              <a href="/creators" className="hover:text-gray-300">Creators</a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}
