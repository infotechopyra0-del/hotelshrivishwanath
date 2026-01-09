'use client'

import { motion } from 'framer-motion'
import { Coffee, Wifi, ParkingCircle, Headphones } from 'lucide-react'

const AmenitiesSection = () => {
  const amenities = [
    {
      icon: ParkingCircle,
      title: 'Free Parking',
      description: 'Convenient and secure parking at no extra cost for a stress-free stay.',
    },
    {
      icon: Wifi,
      title: 'High-Speed WiFi',
      description: 'Stay connected with high-speed internet access throughout the hotel.',
    },
    {
      icon: Coffee,
      title: 'Daily Breakfast',
      description: 'Start your day with a delicious and freshly prepared breakfast.',
    },
    {
      icon: Headphones,
      title: '24/7 Support',
      description: 'Our friendly staff is available around the clock to assist you.',
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
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-varanasi-cream via-varanasi-cream-dark to-varanasi-cream">
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
            Discover Our Featured Amenities
          </h2>
          <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed">
            Experience the finest hospitality with our world-class facilities, sacred traditions, and dedicated services
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {amenities.map((amenity, index) => {
            const Icon = amenity.icon
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -15, boxShadow: '0 20px 40px rgba(232, 185, 35, 0.2)' }}
                className="group p-8 rounded-2xl bg-white border-2 border-varanasi-gold/30 hover:border-varanasi-gold/70 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-varanasi-gold/20 to-varanasi-gold/10 flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-varanasi-gold/50 border border-varanasi-gold/30"
                >
                  <Icon className="w-7 h-7 text-varanasi-gold" />
                </motion.div>

                <h3 className="font-semibold text-lg text-varanasi-maroon mb-2">
                  {amenity.title}
                </h3>
                <p className="text-varanasi-brown text-sm leading-relaxed">
                  {amenity.description}
                </p>

                <motion.div
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.3 }}
                  className="h-0.5 bg-gradient-to-r from-varanasi-gold to-transparent mt-4"
                />
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}

export default AmenitiesSection
