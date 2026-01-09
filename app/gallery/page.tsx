'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import GallerySection from '@/components/GallerySection'
import RoomsImageSection from '@/components/RoomsImageSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Gallery() {
  return (
    <PageTransition>
      <main>
        <Navbar />
        <Hero
          title="Hotel Gallery"
          subtitle="Explore the beauty, spirituality, and elegance of Shri Vishwanath Hotel and Varanasi"
          backgroundImages={[
            '/images/GangaAartiCeremony.jpg',
            '/images/AncientAlleyways.webp',
            '/images/BengaliTola.jpg',
            '/images/ChowkArea.png',
            '/images/GodowliaMarket.png'
          ]}
        />
        <RoomsImageSection showAll={true} limit={999} />
        <GallerySection showAll={true} limit={999} />
        <Footer />
      </main>
    </PageTransition>
  )
}
