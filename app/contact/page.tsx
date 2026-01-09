'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import ContactForm from '@/components/ContactForm'
import ContactInfo from '@/components/ContactInfo'
import MapSection from '@/components/MapSection'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function Contact() {
  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 6390057777',
      href: 'tel:+916390057777',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'hotelshrivishwanath@gmail.com',
      href: 'mailto:hotelshrivishwanath@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'D 53/88 H, Luxa Road, Varanasi, UP 221010',
      href: '#',
    },
  ]

  return (
    <PageTransition>
      <main>
        <Hero
          title="Contact Us"
          subtitle="Get in touch with us for bookings, inquiries, and spiritual retreats"
          backgroundImages={[
            '/images/DasaswamedhGhat.jpg',
            '/images/NepaliTemple.jpg',
            '/images/DurgaKundTemple.jpg',
            '/images/TulsiManasMandir.png',
            '/images/SankatMochanHanumanTemple.png'
          ]}
        />

        <section className="py-16 md:py-24 bg-varanasi-cream">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <ContactInfo contactInfo={contactInfo} />
              <ContactForm />
            </div>
          </div>
        </section>

        <MapSection />
      </main>
    </PageTransition>
  )
}
