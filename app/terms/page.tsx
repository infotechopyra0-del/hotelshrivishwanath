'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import { motion } from 'framer-motion'

export default function TermsPage() {
  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By making a reservation or using our services at Hotel Shri Vishwanath, you agree to be bound by these terms and conditions. These terms apply to all guests, visitors, and users of our website and services."
    },
    {
      title: "2. Reservations and Bookings",
      content: "All reservations are subject to availability and confirmation. We reserve the right to cancel or modify bookings due to circumstances beyond our control. Advance payment may be required to secure your reservation. Room rates are subject to change without prior notice."
    },
    {
      title: "3. Check-in and Check-out",
      content: "Standard check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in or late check-out may be available upon request and subject to additional charges. Valid government-issued photo identification is required at check-in for all guests."
    },
    {
      title: "4. Payment Policy",
      content: "Payment is due at the time of booking or upon arrival as specified in your reservation. We accept cash, credit cards, and digital payments. All rates are inclusive of applicable taxes unless otherwise stated. Additional services will be charged separately."
    },
    {
      title: "5. Cancellation Policy",
      content: "Cancellation policies vary by rate type and booking period. Standard bookings may be cancelled up to 24-48 hours before arrival without penalty. Non-refundable rates cannot be cancelled or modified. Special event periods may have different cancellation terms."
    },
    {
      title: "6. Guest Responsibilities",
      content: "Guests are responsible for their personal belongings and behavior. Any damage to hotel property will be charged to the guest. Smoking is prohibited in all rooms and indoor areas. Guests must comply with all hotel policies and local laws."
    },
    {
      title: "7. Liability Limitations",
      content: "Hotel Shri Vishwanath's liability is limited to the cost of accommodation. We are not responsible for loss, theft, or damage to personal property. The hotel is not liable for any indirect, consequential, or incidental damages."
    },
    {
      title: "8. Force Majeure",
      content: "We are not liable for any failure to perform due to circumstances beyond our control, including but not limited to natural disasters, government actions, strikes, or other events of force majeure."
    },
    {
      title: "9. Privacy and Data Protection",
      content: "Guest information is collected and used in accordance with our Privacy Policy. We are committed to protecting your personal data and will not share it with third parties without your consent, except as required by law."
    },
    {
      title: "10. Modifications to Terms",
      content: "These terms and conditions may be updated from time to time. Continued use of our services constitutes acceptance of any modifications. The most current version will always be available on our website."
    }
  ]

  return (
    <PageTransition>
      <main>
        <Hero
          title="Terms & Conditions"
          subtitle="Please read our terms and conditions carefully before making a reservation"
          backgroundImages={[
            '/images/BharatMataTemple.jpg',
            '/images/Sarnath.png',
            '/images/BlueLassi.jpg',
            '/images/GodowliaChowk.png'
          ]}
        />

        <section className="py-16 md:py-24 bg-varanasi-cream">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <span className="text-varanasi-gold text-2xl block mb-2">◆ ◆ ◆</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-4">
                Terms & Conditions
              </h2>
              <p className="text-varanasi-brown text-lg max-w-3xl mx-auto">
                These terms and conditions outline the rules and regulations for the use of Hotel Shri Vishwanath's services.
              </p>
              <p className="text-sm text-varanasi-brown/70 mt-4">
                Last updated: October 2025
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="mb-8 p-6 bg-white rounded-2xl shadow-sm border border-varanasi-gold/10"
                >
                  <h3 className="font-semibold text-xl text-varanasi-maroon mb-4">
                    {section.title}
                  </h3>
                  <p className="text-varanasi-brown leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-12 p-6 bg-varanasi-maroon/5 rounded-2xl text-center"
            >
              <h3 className="font-semibold text-lg text-varanasi-maroon mb-3">
                Questions About Our Terms?
              </h3>
              <p className="text-varanasi-brown mb-4">
                If you have any questions about these Terms & Conditions, please contact us.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+916390057777"
                  className="px-6 py-2 bg-varanasi-gold text-varanasi-maroon rounded-full font-semibold hover:bg-varanasi-gold-dark transition-colors"
                >
                  Call: +91 6390057777
                </a>
                <a
                  href="mailto:hotelshrivishwanath@gmail.com"
                  className="px-6 py-2 border-2 border-varanasi-gold text-varanasi-maroon rounded-full font-semibold hover:bg-varanasi-gold hover:text-white transition-colors"
                >
                  Email Us
                </a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}