import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import localFont from 'next/font/local';

const maiandraGD = localFont({
  src: [
    {
      path: '../public/fonts/MaiandraGD-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
  ],
  display: 'swap', 
  variable: '--font-maiandra-gd', 
});

// const _geist = Geist({ subsets: ['latin'] })
// const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EDUSEPAL - Learn & Get Certificates',
  description: 'Learn new skills and earn professional certificates from industry experts. Access courses in programming, mathematics, and more.',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: [
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={`${maiandraGD.className} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
