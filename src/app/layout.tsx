import './globals.css'
import { Inter } from 'next/font/google'
import { initializeApp } from "firebase/app";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ResQ Admin',
  description: 'ResQ Admin Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
