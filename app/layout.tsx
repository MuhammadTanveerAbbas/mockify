import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Mockify  AI Image Generator',
  description: 'Generate stunning AI mockups and images instantly with Mockify.',
  generator: 'Mockify',
  openGraph: {
    title: 'Mockify  AI Image Generator',
    description: 'Generate stunning AI mockups and images instantly with Mockify.',
    siteName: 'Mockify',
  },
  twitter: {
    title: 'Mockify  AI Image Generator',
    description: 'Generate stunning AI mockups and images instantly with Mockify.',
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
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
