'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import { motion } from 'framer-motion'

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as when you make a reservation, create an account, or contact us. This includes your name, email address, phone number, address, payment information, and preferences. We also automatically collect certain information when you use our website, including IP address, browser type, and usage data."
    },
    {
      title: "2. How We Use Your Information",
      content: "We use your information to provide and improve our services, process reservations and payments, communicate with you about your stay, send promotional materials (with your consent), comply with legal obligations, and protect our rights and property. We may also use aggregated data for analytics and business insights."
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: "We do not sell or rent your personal information to third parties. We may share your information with service providers who help us operate our business, such as payment processors and booking platforms. We may also disclose information when required by law or to protect our rights and safety."
    },
    {
      title: "4. Cookies and Tracking Technologies",
      content: "Our website uses cookies and similar technologies to enhance your experience, analyze usage patterns, and provide personalized content. You can control cookie settings through your browser preferences. Some features of our website may not function properly if cookies are disabled."
    },
    {
      title: "5. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security."
    },
    {
      title: "6. Data Retention",
      content: "We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. Guest records are typically maintained for tax and accounting purposes as required by law."
    },
    {
      title: "7. Your Rights and Choices",
      content: "You have the right to access, update, or delete your personal information. You may also opt out of promotional communications and request that we limit the use of your data. For guests in certain jurisdictions, additional rights may apply under local privacy laws."
    },
    {
      title: "8. Third-Party Links",
      content: "Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these external sites. We encourage you to read the privacy policies of any third-party sites you visit."
    },
    {
      title: "9. International Data Transfers",
      content: "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place to protect your personal information in accordance with applicable laws."
    },
    {
      title: "10. Changes to This Policy",
      content: "We may update this privacy policy from time to time to reflect changes in our practices or applicable laws. We will notify you of any material changes by posting the updated policy on our website or by other appropriate means."
    }
  ]

  return (
    <PageTransition>
      <main>
        <Hero
          title="Privacy Policy"
          subtitle="Your privacy is important to us. Learn how we collect, use, and protect your information"
          backgroundImages={[
            '/images/AnnapurnaTemple.jpg',
            '/images/KaalBhairavTemple.png',
            '/images/BharatMataTemple.jpg',
            '/images/VaranasiTemple.jpeg'
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
                Privacy Policy
              </h2>
              <p className="text-varanasi-brown text-lg max-w-3xl mx-auto">
                Hotel Shri Vishwanath is committed to protecting your privacy and ensuring the security of your personal information.
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
              className="mt-12 grid md:grid-cols-2 gap-6"
            >
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-varanasi-gold/10">
                <h3 className="font-semibold text-lg text-varanasi-maroon mb-3">
                  Data Protection Officer
                </h3>
                <p className="text-varanasi-brown text-sm mb-3">
                  For privacy-related inquiries or to exercise your rights under applicable privacy laws.
                </p>
                <a
                  href="mailto:privacy@hotelshrivishwanath.com"
                  className="text-varanasi-gold font-semibold hover:text-varanasi-gold-dark transition-colors"
                >
                  privacy@hotelshrivishwanath.com
                </a>
              </div>

              <div className="p-6 bg-white rounded-2xl shadow-sm border border-varanasi-gold/10">
                <h3 className="font-semibold text-lg text-varanasi-maroon mb-3">
                  Contact for Privacy Concerns
                </h3>
                <p className="text-varanasi-brown text-sm mb-3">
                  Have questions about how we handle your personal information?
                </p>
                <div className="flex flex-col gap-2">
                  <a
                    href="tel:+916390057777"
                    className="text-varanasi-gold font-semibold hover:text-varanasi-gold-dark transition-colors"
                  >
                    📞 +91 6390057777
                  </a>
                  <a
                    href="mailto:hotelshrivishwanath@gmail.com"
                    className="text-varanasi-gold font-semibold hover:text-varanasi-gold-dark transition-colors"
                  >
                    ✉️ hotelshrivishwanath@gmail.com
                  </a>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mt-8 p-6 bg-varanasi-maroon/5 rounded-2xl"
            >
              <h3 className="font-semibold text-lg text-varanasi-maroon mb-3 text-center">
                🔒 Your Trust is Sacred to Us
              </h3>
              <p className="text-varanasi-brown text-center text-sm leading-relaxed">
                Just as Varanasi is a sacred place of trust and devotion, we treat your privacy with the utmost respect and security. 
                Your personal information is protected with the same care we provide to our guests during their stay.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}