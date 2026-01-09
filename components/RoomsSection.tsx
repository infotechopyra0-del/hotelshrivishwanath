'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Star, Users, DoorOpen } from 'lucide-react'

interface Room {
  id: number
  name: string
  price: number
  description: string
  image: string
  features: string[]
  rating: number
  reviews: number
}

interface RoomsSectionProps {
  rooms?: Room[]
  showAll?: boolean
}

const RoomsSection: React.FC<RoomsSectionProps> = ({ 
  rooms = [
    {
      id: 1,
      name: 'Standard Room',
      price: 2000,
      description: 'Includes the essential amenities needed for a comfortable stay with warm Varanasi-inspired interiors.',
      image: '/images/Rooms1.jpg',
      features: ['Free WiFi', 'AC', 'Private Bathroom', 'TV'],
      rating: 4.5,
      reviews: 128,
    },
    {
      id: 2,
      name: 'Deluxe Room',
      price: 2500,
      description: 'Designed to offer upgraded comfort with elegant Varanasi heritage decor and modern amenities.',
      image: '/images/Rooms3.jpg',
      features: ['Free WiFi', 'AC', 'Work Desk', 'Room Service'],
      rating: 4.8,
      reviews: 245,
    },
    {
      id: 3,
      name: 'Super deluxe Room',
      price: 3500,
      description: 'Experience luxury with spacious premium suite featuring royal Banarasi aesthetics and exclusive amenities.',
      image: '/images/Rooms2.jpg',
      features: ['Free WiFi', 'Living Area', 'Premium Toiletries', 'Ganga View'],
      rating: 5.0,
      reviews: 89,
    }
  ],
  showAll = false,
}) => {
  const displayRooms = showAll ? rooms : rooms.slice(0, 3)

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
    <section className="py-20 md:py-28 bg-gradient-to-b from-varanasi-cream via-varanasi-cream to-varanasi-cream-dark">
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
            Our Luxurious Rooms
          </h2>
          <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed">
            Choose from our carefully curated selection of elegant rooms with Varanasi heritage aesthetics
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayRooms.map((room) => {
            // Generate WhatsApp message based on room type
            const getWhatsAppMessage = () => {
              if (room.name === 'Standard Room') {
                return `Hello!%20I%27m%20interested%20in%20booking%20a%20Standard%20Room%20at%20Hotel%20Shri%20Vishwanath.%20Could%20you%20please%20help%20me%20with%20availability%20and%20pricing%20for%20₹2,000%20per%20night%3F`
              } else if (room.name === 'Deluxe Room') {
                return `Hello!%20I%27m%20interested%20in%20booking%20a%20Deluxe%20Room%20at%20Hotel%20Shri%20Vishwanath.%20Could%20you%20please%20help%20me%20with%20availability%20and%20pricing%20for%20₹2,500%20per%20night%3F`
              } else if (room.name === 'Super deluxe Room') {
                return `Hello!%20I%27m%20interested%20in%20booking%20a%20Super%20Deluxe%20Room%20(Premium%20Suite)%20at%20Hotel%20Shri%20Vishwanath.%20Could%20you%20please%20help%20me%20with%20availability%20and%20VIP%20pricing%20for%20₹3,500%20per%20night%3F`
              }
              return `Hello!%20I%27m%20interested%20in%20booking%20a%20room%20at%20Hotel%20Shri%20Vishwanath.%20Could%20you%20please%20help%20me%20with%20availability%20and%20pricing%3F`
            }
            
            return (
              <motion.div
                key={room.id}
                variants={itemVariants}
                whileHover={{ y: -20, boxShadow: '0 25px 50px rgba(232, 185, 35, 0.25)' }}
                className="group rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-varanasi-gold/20 hover:border-varanasi-gold/50"
              >
                {/* Image Container */}
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={room.image}
                    alt={room.name}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-varanasi-maroon/20 group-hover:to-varanasi-maroon/40 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-2xl font-bold text-varanasi-maroon">
                      {room.name}
                    </h3>
                    <div className="flex items-center gap-1 bg-varanasi-gold/10 px-3 py-1 rounded-full border border-varanasi-gold/30">
                      <Star className="w-4 h-4 fill-varanasi-gold text-varanasi-gold" />
                      <span className="text-sm font-semibold text-varanasi-gold">
                        {room.rating}
                      </span>
                    </div>
                  </div>

                  <p className="text-varanasi-brown text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {room.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-varanasi-brown">
                        <div className="w-1.5 h-1.5 rounded-full bg-varanasi-gold" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-varanasi-gold/10">
                    <div>
                      <p className="text-xs text-varanasi-brown">From</p>
                      <p className="font-serif text-2xl font-bold text-varanasi-gold">
                        ₹{room.price}
                      </p>
                    </div>
                    <motion.a
                      href={`https://wa.me/916390057777?text=${getWhatsAppMessage()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 glow-box-hover transition-all"
                    >
                      Book Now
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {!showAll && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/rooms">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white border-2 border-varanasi-maroon text-varanasi-maroon rounded-full font-semibold hover:bg-varanasi-maroon/5 transition-colors"
              >
                View All Rooms
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default RoomsSection
