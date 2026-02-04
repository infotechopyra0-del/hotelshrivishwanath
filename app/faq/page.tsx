'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import FAQSection from '@/components/FAQSection'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function FAQPage() {
  return (
    <PageTransition>
      <main>
        <Navbar />
        <Hero
          title="Frequently Asked Questions"
          subtitle="Find answers to common questions about our services, amenities, and booking policies"
          backgroundImages={[
            '/images/VaranasiGhats.jpg',
            '/images/HanumanGhat.jpg',
            '/images/KedarGhat.jpg',
            '/images/tulsighat.jpeg',
            '/images/ManikarnikaGhat.jpeg'
          ]}
        />

        <FAQSection />
        <Footer />
      </main>
    </PageTransition>
  )
}