'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Star, Users, Award } from 'lucide-react'

export default function PartnerPlatformsSection() {
  const platforms = [
    {
      name: 'Booking.com',
      logo: '🛏️',
      description: 'World\'s largest accommodation booking platform with guaranteed best prices',
      rating: '4.6',
      reviews: '3,200+',
      url: 'https://www.booking.com/hotel/in/shri-vishwanath-varanasi.html',
      color: 'from-blue-600 to-blue-700',
      features: ['Free Cancellation', 'No Booking Fees', 'Instant Confirmation']
    },
    {
      name: 'Agoda',
      logo: '🏨',
      description: 'Asia\'s leading travel booking platform with exclusive member deals',
      rating: '4.5',
      reviews: '2,500+',
      url: 'https://www.agoda.com/partners/partnersearch.aspx?hid=hotelshrivishwanath',
      color: 'from-red-500 to-red-600',
      features: ['Best Price Guarantee', 'Instant Confirmation', 'Flexible Booking']
    },
    {
      name: 'Expedia',
      logo: '✈️',
      description: 'Complete travel solutions with hotel and flight packages',
      rating: '4.4',
      reviews: '1,900+',
      url: 'https://www.expedia.co.in/Varanasi-Hotels-Hotel-Shri-Vishwanath.h123456.Hotel-Information',
      color: 'from-yellow-500 to-orange-500',
      features: ['Package Deals', 'Rewards Program', 'Travel Insurance']
    },
    {
      name: 'TripAdvisor',
      logo: '🦉',
      description: 'World\'s largest travel community with honest reviews and insights',
      rating: '4.3',
      reviews: '1,800+',
      url: 'https://www.tripadvisor.in/Hotel_Review-g297684-d23455454-Reviews-Hotel_Shri_Vishwanath-Varanasi_Varanasi_District_Uttar_Pradesh.html',
      color: 'from-green-500 to-green-600',
      features: ['Verified Reviews', 'Travel Community', 'Local Insights']
    },
    {
      name: 'Hotels.com',
      logo: '🏢',
      description: 'Trusted hotel booking with rewards program and secret prices',
      rating: '4.2',
      reviews: '1,600+',
      url: 'https://www.hotels.com/ho123456/hotel-shri-vishwanath-varanasi-india/',
      color: 'from-purple-500 to-purple-600',
      features: ['Secret Prices', 'Rewards Nights', 'Price Match']
    },
    {
      name: 'MakeMyTrip',
      logo: '🇮🇳',
      description: 'India\'s leading travel portal with local expertise and support',
      rating: '4.1',
      reviews: '2,100+',
      url: 'https://www.makemytrip.com/hotels/hotel-shri-vishwanath-varanasi',
      color: 'from-orange-500 to-red-500',
      features: ['Local Support', 'EMI Options', 'Travel Protection']
    },
    {
      name: 'Goibibo',
      logo: '🚀',
      description: 'Smart travel booking with instant discounts and cashbacks',
      rating: '4.0',
      reviews: '1,400+',
      url: 'https://www.goibibo.com/hotels/hotel-shri-vishwanath-varanasi',
      color: 'from-teal-500 to-cyan-500',
      features: ['Instant Discounts', 'goCash Rewards', 'Quick Booking']
    },
    {
      name: 'Cleartrip',
      logo: '🎯',
      description: 'Simple and transparent booking with no hidden charges',
      rating: '4.2',
      reviews: '1,200+',
      url: 'https://www.cleartrip.com/hotels/hotel-shri-vishwanath-varanasi',
      color: 'from-indigo-500 to-blue-600',
      features: ['No Hidden Fees', 'Easy Cancellation', 'Transparent Pricing']
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-varanasi-cream/30 to-white">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-varanasi-gold text-2xl block mb-3">◆ ◆ ◆</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-6">
            Book on Partner Platforms
          </h2>
          <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your preferred booking platform and enjoy exclusive deals and trusted service
          </p>
        </motion.div>

        {/* Platforms Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-varanasi-gold/10"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${platform.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
              
              <div className="p-8">
                {/* Platform Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{platform.logo}</div>
                    <div>
                      <h3 className="text-2xl font-bold text-varanasi-maroon">{platform.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-varanasi-gold">{platform.rating}</span>
                        </div>
                        <span className="text-varanasi-brown text-sm">({platform.reviews} reviews)</span>
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-5 h-5 text-varanasi-gold group-hover:text-varanasi-gold-dark transition-colors" />
                </div>

                {/* Description */}
                <p className="text-varanasi-brown mb-6 leading-relaxed">
                  {platform.description}
                </p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-varanasi-maroon mb-3">Features:</h4>
                  <ul className="space-y-2">
                    {platform.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm text-varanasi-brown">
                        <div className="w-1.5 h-1.5 bg-varanasi-gold rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <motion.a
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`block w-full py-3 px-6 bg-gradient-to-r ${platform.color} text-white rounded-lg font-semibold text-center transition-all hover:shadow-lg`}
                >
                  Book on {platform.name}
                </motion.a>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-varanasi-gold/10 rounded-2xl p-8 border-2 border-varanasi-gold/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center">
              <Award className="w-8 h-8 text-varanasi-gold mb-3" />
              <h3 className="font-bold text-varanasi-maroon mb-1">Trusted Partner</h3>
              <p className="text-varanasi-brown text-sm">Verified and certified by leading travel platforms</p>
            </div>
            <div className="flex flex-col items-center">
              <Users className="w-8 h-8 text-varanasi-gold mb-3" />
              <h3 className="font-bold text-varanasi-maroon mb-1">12,000+ Bookings</h3>
              <p className="text-varanasi-brown text-sm">Successfully served guests through all partner platforms</p>
            </div>
            <div className="flex flex-col items-center">
              <Star className="w-8 h-8 text-varanasi-gold mb-3" />
              <h3 className="font-bold text-varanasi-maroon mb-1">Excellent Rating</h3>
              <p className="text-varanasi-brown text-sm">Consistently high ratings across all platforms</p>
            </div>
          </div>
        </motion.div>

        {/* Direct Booking Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-center mt-12"
        >
          <div className="bg-varanasi-maroon/5 rounded-2xl p-8 border border-varanasi-gold/20">
            <h3 className="text-2xl font-bold text-varanasi-maroon mb-4">
              💡 Pro Tip: Book Direct for Extra Benefits
            </h3>
            <p className="text-varanasi-brown mb-4">
              While our partner platforms offer great convenience, booking directly with us provides additional perks:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span className="bg-varanasi-gold/20 text-varanasi-maroon px-3 py-1 rounded-full">Best Rate Guarantee</span>
              <span className="bg-varanasi-gold/20 text-varanasi-maroon px-3 py-1 rounded-full">Free Upgrades</span>
              <span className="bg-varanasi-gold/20 text-varanasi-maroon px-3 py-1 rounded-full">Welcome Amenities</span>
              <span className="bg-varanasi-gold/20 text-varanasi-maroon px-3 py-1 rounded-full">Flexible Cancellation</span>
            </div>
            <motion.a
              href="/booking"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block mt-6 px-8 py-3 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 transition-all"
            >
              Book Direct & Save More
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}