import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

export const metadata: Metadata = {
  title: 'Mockify — AI Image Generator',
  description: 'Generate AI mockups and images in your browser with Puter.js. No API keys required.',
  generator: 'Mockify',
  openGraph: {
    title: 'Mockify — AI Image Generator',
    description: 'Generate AI mockups and images in your browser with Puter.js. No API keys required.',
    siteName: 'Mockify',
  },
  twitter: {
    title: 'Mockify — AI Image Generator',
    description: 'Generate AI mockups and images in your browser with Puter.js. No API keys required.',
  },
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://js.puter.com/v2/" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
