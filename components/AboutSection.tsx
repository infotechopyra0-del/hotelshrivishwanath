'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

interface AboutSectionProps {
  full?: boolean
}

const AboutSection: React.FC<AboutSectionProps> = ({ full = false }) => {
  const highlights = [
    'Exceptional Service Excellence',
    'World-Class Amenities',
    'Prime Location in Varanasi',
    'Spiritual & Cultural Hub',
    'Modern Comfort & Luxury',
    'Unforgettable Experiences',
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-varanasi-cream/20">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block text-varanasi-gold font-semibold text-sm mb-2 uppercase tracking-wider">
              ◆ About Us ◆
            </span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-6">
              We Provide The Best Hospitality In Varanasi
            </h2>
            <p className="text-varanasi-brown text-lg mb-6 leading-relaxed">
              Experience Unmatched Comfort and Exceptional Hospitality in the Heart of Varanasi.
              Hotel Shri Vishwanath seamlessly blends modern luxury with the spiritual essence
              of India's holiest city.
            </p>
            <p className="text-varanasi-brown mb-8 leading-relaxed">
              Nestled in the sacred land of Banaras, our hotel celebrates the rich heritage,
              spirituality, and cultural significance of this ancient city. Every detail of our
              accommodations is designed to provide you with comfort, elegance, and a touch of
              traditional Indian hospitality blessed by the eternal Ganga.
            </p>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-3 mb-8"
            >
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 text-varanasi-gold flex-shrink-0" />
                  <span className="text-varanasi-brown font-medium">{highlight}</span>
                </motion.div>
              ))}
            </motion.div>

            {!full && (
              <Link href="/about">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 glow-box-hover"
                >
                  Know About Us
                </motion.button>
              </Link>
            )}
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl border-2 border-varanasi-gold/20">
              <Image
                src="/images/VaranasiTemple.jpeg"
                alt="Varanasi Temple Architecture"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-varanasi-maroon/40 to-transparent" />
            </div>

            {/* Floating Card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-2xl max-w-xs border border-varanasi-gold/20"
            >
              <p className="text-sm text-varanasi-brown mb-2">Guest Rating</p>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-varanasi-gold text-lg">★</span>
                  ))}
                </div>
                <span className="font-bold text-varanasi-maroon">4.9/5</span>
              </div>
              <p className="text-xs text-varanasi-brown">Based on 500+ reviews</p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
