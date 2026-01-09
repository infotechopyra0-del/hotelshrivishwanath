import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppChat from '@/components/WhatsAppChat'
import Providers from '@/components/Providers'

export const metadata: Metadata = {
  metadataBase: new URL('https://hotelshrivishwanath.com'),
  title: 'Hotel Shri Vishwanath | Luxury Hotel in Varanasi',
  description: 'Experience exceptional service, world-class amenities, and unforgettable moments at Hotel Shri Vishwanath in Varanasi. Book your luxury stay today.',
  keywords: ['hotel', 'varanasi', 'luxury hotel', 'accommodation', 'rooms', 'booking'],
  authors: [{ name: 'Hotel Shri Vishwanath' }],
  icons: {
    icon: '/images/MainLogo.jpg',
    apple: '/images/MainLogo.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hotelshrivishwanath.com',
    title: 'Hotel Shri Vishwanath | Luxury Hotel in Varanasi',
    description: 'Experience exceptional service, world-class amenities, and unforgettable moments at Hotel Shri Vishwanath.',
    images: [
      {
        url: '/images/MainLogo.jpg',
        width: 1200,
        height: 630,
        alt: 'Hotel Shri Vishwanath',
      },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="google-site-verification" content="s0ksKYjNEdp7CN2wgPmRBxIgiIeo7i59p12XnV3P6uE" />
      </head>
      <body className="bg-varanasi-cream text-varanasi-brown overflow-x-hidden" suppressHydrationWarning>
        <Providers>
          <main className="min-h-screen w-full overflow-x-hidden">
            {children}
          </main>
          <WhatsAppChat />
        </Providers>
      </body>
    </html>
  )
}
