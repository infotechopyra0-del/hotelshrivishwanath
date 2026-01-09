'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import AmenitiesSection from '@/components/AmenitiesSection'
import AboutSection from '@/components/AboutSection'
import RoomsSection from '@/components/RoomsSection'
import GallerySection from '@/components/GallerySection'
import PartnerPlatformsSection from '@/components/PartnerPlatformsSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <PageTransition>
      <main>
        <Navbar />
        <Hero
          title="Welcome to Hotel Shri Vishwanath"
          subtitle="Experience the divine essence of Varanasi with exceptional luxury and spiritual tranquility."
          backgroundImages={[
            '/images/GhatByEvening.jpg',
            '/images/KashiVishwanathTemple.jpg',
            '/images/VaranasiGhats.jpg',
            '/images/GangaAartiCeremony.jpg',
            '/images/BoatsOnTheGanga.avif',
            '/images/BHUCampus.avif'
          ]}
          cta={{
            text: 'Book Now',
            href: '/contact',
          }}
        />
        <AmenitiesSection />
        <AboutSection />
        <RoomsSection showAll={false} />
        <PartnerPlatformsSection />
        <GallerySection showAll={false} limit={6} />
        <Footer />
      </main>
    </PageTransition>
  )
}
