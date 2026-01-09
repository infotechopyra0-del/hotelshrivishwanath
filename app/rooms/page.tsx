'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import RoomsSection from '@/components/RoomsSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Rooms() {
  return (
    <PageTransition>
      <main>
        <Navbar />
        <Hero
          title="Our Luxurious Rooms"
          subtitle="Choose from our carefully curated selection of elegant rooms with Varanasi heritage aesthetics"
          backgroundImages={[
            '/images/DasaswamedhGhat.jpg',
            '/images/VaranasiTemple.jpeg',
            '/images/AnnapurnaTemple.jpg',
            '/images/BharatMataTemple.jpg',
            '/images/AssiGhat.jpg'
          ]}
        />
        <RoomsSection showAll={true} />
        <Footer />
      </main>
    </PageTransition>
  )
}
