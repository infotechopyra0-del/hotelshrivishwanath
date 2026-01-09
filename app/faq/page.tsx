'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import FAQSection from '@/components/FAQSection'
import type { Metadata } from 'next'

export default function FAQPage() {
  return (
    <PageTransition>
      <main>
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
      </main>
    </PageTransition>
  )
}