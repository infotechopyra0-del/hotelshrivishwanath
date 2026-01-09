'use client'

import PageTransition from '@/components/PageTransition'
import Hero from '@/components/Hero'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { MapPin, Clock, Users, Star, Camera, Waves, Building, Utensils } from 'lucide-react'

export default function ExploreMore() {
  const attractions = [
    {
      id: 1,
      name: 'Kashi Vishwanath Temple',
      distance: '2.5 km',
      time: '10 min drive',
      description: 'The most sacred Shiva temple in Varanasi, dedicated to Lord Vishwanath.',
      image: '/images/KashiVishwanathTemple.jpg',
      category: 'Spiritual',
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Dasaswamedh Ghat',
      distance: '3.0 km',
      time: '12 min drive',
      description: 'Witness the spectacular Ganga Aarti ceremony every evening.',
      image: '/images/DasaswamedhGhat.jpg',
      category: 'Cultural',
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Assi Ghat',
      distance: '4.2 km',
      time: '15 min drive',
      description: 'Popular spot for sunrise viewing and morning prayers by the Ganges.',
      image: '/images/AssiGhat.jpg',
      category: 'Scenic',
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Sarnath',
      distance: '10 km',
      time: '25 min drive',
      description: 'Buddhist pilgrimage site where Lord Buddha first taught the Dharma.',
      image: '/images/Sarnath.jpeg',
      category: 'Historical',
      rating: 4.6,
    },
    {
      id: 5,
      name: 'BHU Campus',
      distance: '5.8 km',
      time: '18 min drive',
      description: 'Beautiful university campus with the famous Vishwanath Temple.',
      image: '/images/BHUCampus.avif',
      category: 'Educational',
      rating: 4.5,
    },
    {
      id: 6,
      name: 'Ramnagar Fort',
      distance: '14 km',
      time: '35 min drive',
      description: 'Historic fort and palace of the Maharaja of Varanasi.',
      image: '/images/RamnagarFort.jpeg',
      category: 'Heritage',
      rating: 4.4,
    },
  ]

  const experiences = [
    {
      icon: Waves,
      title: 'Ganga Boat Ride',
      description: 'Experience the spiritual essence of Varanasi with a peaceful boat ride on the sacred Ganges.',
      duration: '2-3 hours',
    },
    {
      icon: Camera,
      title: 'Photography Tour',
      description: 'Capture the timeless beauty of ancient ghats, temples, and Varanasi street life.',
      duration: '4-5 hours',
    },
    {
      icon: Building,
      title: 'Heritage Walk',
      description: 'Explore narrow lanes, ancient temples, and traditional markets with local guides.',
      duration: '3-4 hours',
    },
    {
      icon: Utensils,
      title: 'Food Trail',
      description: 'Taste authentic Banarasi cuisine, famous sweets, and street food specialties.',
      duration: '2-3 hours',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <PageTransition>
      <main>
        <Hero
          title="Explore More"
          subtitle="Discover the spiritual heart of Varanasi and create unforgettable memories around our hotel"
          backgroundImages={[
            '/images/BoatsOnTheGanga.avif',
            '/images/RamnagarFort.jpeg',
            '/images/ChunarFort.png',
            '/images/LankaMarket.jpg',
            '/images/ThatheriBazaar.png'
          ]}
        />

        {/* Nearby Attractions */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-varanasi-cream/20">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <span className="text-varanasi-gold text-2xl block mb-3">◆ ◆ ◆</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-6">
                Nearby Attractions
              </h2>
              <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed">
                Explore the spiritual and cultural treasures of Varanasi, all within easy reach from our hotel
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {attractions.map((attraction) => (
                <motion.div
                  key={attraction.id}
                  variants={itemVariants}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  whileHover={{ y: -20, boxShadow: '0 25px 50px rgba(232, 185, 35, 0.25)' }}
                  className="group rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-varanasi-gold/20 hover:border-varanasi-gold/50"
                >
                  {/* Image Container */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={attraction.image}
                      alt={attraction.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-varanasi-gold/90 text-varanasi-maroon px-3 py-1 rounded-full text-sm font-semibold">
                      {attraction.category}
                    </div>
                    <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-varanasi-gold text-varanasi-gold" />
                      <span className="text-xs font-semibold text-varanasi-maroon">{attraction.rating}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-serif text-xl font-bold text-varanasi-maroon mb-2">
                      {attraction.name}
                    </h3>
                    <div className="flex items-center gap-4 mb-3 text-sm text-varanasi-brown">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {attraction.distance}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {attraction.time}
                      </div>
                    </div>
                    <p className="text-varanasi-brown text-sm leading-relaxed">
                      {attraction.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Curated Experiences */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-varanasi-cream to-varanasi-cream-dark">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-20"
            >
              <span className="text-varanasi-gold text-2xl block mb-3">◆ ◆ ◆</span>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-6">
                Curated Experiences
              </h2>
              <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed">
                Immerse yourself in the authentic culture and spirituality of Varanasi with our specially designed experiences
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              {experiences.map((experience, index) => {
                const Icon = experience.icon
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(232, 185, 35, 0.2)' }}
                    className="group p-8 rounded-2xl bg-white border-2 border-varanasi-gold/30 hover:border-varanasi-gold/70 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                  >
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 10 }}
                      className="w-16 h-16 rounded-full bg-gradient-to-br from-varanasi-gold/20 to-varanasi-gold/10 flex items-center justify-center mb-6 group-hover:shadow-lg group-hover:shadow-varanasi-gold/50 border border-varanasi-gold/30"
                    >
                      <Icon className="w-8 h-8 text-varanasi-gold" />
                    </motion.div>

                    <h3 className="font-serif text-2xl font-bold text-varanasi-maroon mb-3">
                      {experience.title}
                    </h3>
                    <p className="text-varanasi-brown mb-4 leading-relaxed">
                      {experience.description}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-varanasi-gold font-semibold">
                      <Clock className="w-4 h-4" />
                      Duration: {experience.duration}
                    </div>

                    <motion.div
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.3 }}
                      className="h-0.5 bg-gradient-to-r from-varanasi-gold to-transparent mt-6"
                    />
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 md:py-24 bg-varanasi-brown text-varanasi-cream">
          <div className="container-custom text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-varanasi-gold">
                Ready to Explore Varanasi?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
                Let our concierge team help you plan the perfect spiritual and cultural journey through the eternal city of Varanasi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/contact"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 glow-box-hover inline-block"
                >
                  Plan Your Experience
                </motion.a>
                <motion.a
                  href="/rooms"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-varanasi-gold text-varanasi-gold rounded-full font-semibold hover:bg-varanasi-gold/20 transition-colors inline-block"
                >
                  Book Your Stay
                </motion.a>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </PageTransition>
  )
}