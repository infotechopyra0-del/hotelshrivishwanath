'use client'

import { motion } from 'framer-motion'
import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import AboutSection from '@/components/AboutSection'
import { Utensils, Users, Award, Droplets } from 'lucide-react'

export default function About() {
  const features = [ 
    {
      icon: Award,
      title: 'Ghat Visits',
      description: 'Explore the sacred ghats of Varanasi including Dashashwamedh, Manikarnika, and Assi Ghat with guided tours.',
    },
    {
      icon: Utensils,
      title: 'Boat Rides',
      description: 'Experience magical sunrise and sunset boat rides on the holy Ganges river with traditional wooden boats.',
    },
    {
      icon: Droplets,
      title: 'Temple Sightseeing',
      description: 'Visit ancient temples including Kashi Vishwanath, Sankat Mochan, and other spiritual landmarks.',
    },
    {
      icon: Users,
      title: 'Cultural Tours',
      description: 'Discover Varanasi\'s rich heritage with guided tours to silk weaving centers, local markets, and historic sites.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <PageTransition>
      <main>
        <Hero
        title="About Our Hotel"
        subtitle="Discover the story of excellence, tradition, and spiritual elegance rooted in Varanasi"
        backgroundImages={[
          '/images/KashiVishwanathTemple.jpg',
          '/images/TempleArchitecture.jpg',
          '/images/BharatKalaBhavan.jpeg',
          '/images/Sarnath.jpeg',
          '/images/ManMandirObservatory.png'
        ]}
      />

      <AboutSection full={true} />

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-varanasi-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-varanasi-gold text-2xl block mb-2">◆ ◆ ◆</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-4">
              Why Choose Shri Vishwanath
            </h2>
            <p className="text-varanasi-brown text-lg max-w-2xl mx-auto">
              Discover what sets us apart in the world of luxury hospitality
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow border border-varanasi-gold/10"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-varanasi-gold to-varanasi-gold-dark flex items-center justify-center mb-4 glow-box-hover"
              >
                <Icon className="w-6 h-6 text-varanasi-maroon" />
              </motion.div>
              <h3 className="font-semibold text-lg text-varanasi-maroon mb-2">
                {feature.title}
              </h3>
              <p className="text-varanasi-brown text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
              )
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 md:py-24 bg-varanasi-brown text-varanasi-cream">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          >
            {[
              { number: '20+', label: 'Years of Service' },
              { number: '500+', label: 'Happy Guests' },
              { number: '50+', label: 'Room Varieties' },
              { number: '24/7', label: 'Guest Support' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <motion.h3
                  className="font-serif text-5xl font-bold text-varanasi-gold mb-2"
                  whileInView={{ scale: 1.1 }}
                  viewport={{ once: true }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-varanasi-cream/80">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      </main>
    </PageTransition>
  )
}
