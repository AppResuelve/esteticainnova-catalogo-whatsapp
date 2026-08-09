import type { Metadata } from "next"
import { Inter } from "next/font/google"
import localFont from "next/font/local"
import "./globals.css"
import { baseMetadata } from "@/lib/metadata"

const resort = localFont({
  src: [
    { path: "../fonts/Fontspring-DEMO-resort-sanslight.otf", weight: "300", style: "normal" },
    { path: "../fonts/Fontspring-DEMO-resort-sansbold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-heading",
  display: "swap",
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const dynamic = 'force-dynamic'

export const metadata: Metadata = baseMetadata as Metadata

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`h-full antialiased ${resort.variable} ${inter.variable}`} data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
