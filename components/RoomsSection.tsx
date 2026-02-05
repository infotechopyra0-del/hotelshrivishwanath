'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Bed } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Room {
  _id?: string
  id?: string
  image: { url: string; public_id: string } | string
  title: string
  description: string
  category: string
  price: number
  bedType: string
  maxOccupancy: number
  amenities: string[]
  featured: boolean
}

const RoomsSection: React.FC<{ showAll?: boolean }> = ({ showAll = false }) => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRooms()
  }, [])

  const fetchRooms = async () => {
    try {
      console.log('🔄 Fetching rooms...')
      const res = await fetch('/api/rooms')
      if (!res.ok) throw new Error('Failed to fetch rooms')
      const data: Room[] = await res.json()
      
      console.log('📊 Rooms data received:', data.length, data)
      
      // Sort by featured status
      const sortedData = data.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return 0
      })
      
      console.log('✅ Setting rooms:', sortedData.length)
      setRooms(sortedData)
    } catch (error) {
      console.error('❌ Error fetching rooms:', error)
      setRooms([])
    } finally {
      setLoading(false)
    }
  }

  const displayRooms = showAll ? rooms : rooms.slice(0, 3)

  console.log('🎯 Display rooms:', displayRooms.length, displayRooms)

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

  if (loading) {
    return (
      <section className="py-20 md:py-28 bg-gradient-to-b from-varanasi-cream via-varanasi-cream to-varanasi-cream-dark">
        <div className="container-custom">
          {/* Header Skeleton */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <div className="w-16 h-6 bg-varanasi-gold/20 rounded mx-auto mb-3 animate-pulse" />
            <div className="space-y-3 mb-6">
              <div className="w-80 h-12 bg-varanasi-gold/10 rounded mx-auto animate-pulse" />
              <div className="w-64 h-8 bg-varanasi-gold/10 rounded mx-auto animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="w-96 h-5 bg-varanasi-gold/10 rounded mx-auto animate-pulse" />
              <div className="w-80 h-5 bg-varanasi-gold/10 rounded mx-auto animate-pulse" />
            </div>
          </motion.div>

          {/* Rooms Grid Skeleton */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[...Array(showAll ? 6 : 3)].map((_, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * idx }}
                className="rounded-2xl overflow-hidden bg-white shadow-xl border-2 border-varanasi-gold/20"
              >
                {/* Image Skeleton */}
                <div className="relative h-64 bg-varanasi-gold/10 animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-varanasi-gold/5 via-varanasi-gold/10 to-varanasi-gold/5 animate-shimmer" />
                  {/* Featured Badge Skeleton */}
                  {idx === 0 && (
                    <div className="absolute top-4 right-4 w-20 h-6 bg-varanasi-gold/20 rounded-full animate-pulse" />
                  )}
                </div>

                {/* Content Skeleton */}
                <div className="p-6">
                  {/* Category Badge Skeleton */}
                  <div className="mb-3">
                    <div className="w-20 h-6 bg-varanasi-gold/20 rounded-full animate-pulse" />
                  </div>

                  {/* Title Skeleton */}
                  <div className="space-y-2 mb-3">
                    <div className={`h-7 bg-varanasi-gold/10 rounded animate-pulse ${idx % 3 === 0 ? 'w-3/4' : idx % 3 === 1 ? 'w-5/6' : 'w-2/3'}`} />
                    <div className={`h-6 bg-varanasi-gold/10 rounded animate-pulse ${idx % 3 === 0 ? 'w-1/2' : idx % 3 === 1 ? 'w-2/3' : 'w-3/4'}`} />
                  </div>

                  {/* Description Skeleton */}
                  <div className="space-y-2 mb-4">
                    <div className="w-full h-4 bg-varanasi-gold/10 rounded animate-pulse" />
                    <div className="w-4/5 h-4 bg-varanasi-gold/10 rounded animate-pulse" />
                  </div>

                  {/* Room Info Skeleton */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-varanasi-gold/20 rounded animate-pulse" />
                      <div className="w-12 h-4 bg-varanasi-gold/10 rounded animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-4 h-4 bg-varanasi-gold/20 rounded animate-pulse" />
                      <div className="w-16 h-4 bg-varanasi-gold/10 rounded animate-pulse" />
                    </div>
                  </div>

                  {/* Amenities Skeleton */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {[...Array(4)].map((_, amenityIdx) => (
                      <div key={amenityIdx} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-varanasi-gold/20 animate-pulse" />
                        <div className={`h-3 bg-varanasi-gold/10 rounded animate-pulse ${amenityIdx % 2 === 0 ? 'w-16' : 'w-14'}`} />
                      </div>
                    ))}
                  </div>

                  {/* Footer Skeleton */}
                  <div className="flex justify-between items-center pt-4 border-t border-varanasi-gold/10">
                    <div>
                      <div className="w-8 h-3 bg-varanasi-gold/10 rounded animate-pulse mb-1" />
                      <div className="w-20 h-8 bg-varanasi-gold/20 rounded animate-pulse" />
                    </div>
                    <div className="w-24 h-8 bg-varanasi-gold/20 rounded-full animate-pulse" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button Skeleton */}
          {!showAll && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-12"
            >
              <div className="w-32 h-10 bg-varanasi-gold/10 rounded-full animate-pulse mx-auto" />
            </motion.div>
          )}
        </div>
      </section>
    )
  }

  // Add no rooms state
  if (!loading && rooms.length === 0) {
    return (
      <section className="py-20 md:py-28 bg-gradient-to-b from-varanasi-cream via-varanasi-cream to-varanasi-cream-dark">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-varanasi-gold text-2xl block mb-3">◆ ◆ ◆</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-6">
              Our Luxurious Rooms
            </h2>
            <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed mb-8">
              Choose from our carefully curated selection of elegant rooms with Varanasi heritage aesthetics
            </p>
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-varanasi-gold/20 max-w-md mx-auto">
              <p className="text-varanasi-maroon text-lg font-semibold">No rooms available at the moment</p>
              <p className="text-varanasi-brown text-sm mt-2">Please check back later or contact us for availability</p>
            </div>
          </motion.div>
        </div>
      </section>
    )
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayRooms.map((room, idx) => {
            const roomId = room._id || room.id || `room-${idx}`;
            const imageUrl = typeof room.image === 'string' ? room.image : room.image?.url || '';
            const altText = typeof room.title === 'string' && room.title.trim() !== '' ? room.title : `Room ${roomId}`;
            return (
              <motion.div
                key={String(roomId)}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(232, 185, 35, 0.25)' }}
                className="group rounded-2xl overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-varanasi-gold/20 hover:border-varanasi-gold/50"
              >
                {/* Image Container */}
                <Link href={`/rooms/${roomId}`}>
                  <div className="relative h-64 overflow-hidden cursor-pointer">
                    <Image
                      src={imageUrl}
                      alt={altText}
                      fill
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    />
                    {room.featured && (
                      <div className="absolute top-4 right-4 bg-varanasi-gold text-varanasi-maroon px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⭐ Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-varanasi-maroon/20 group-hover:to-varanasi-maroon/40 transition-colors duration-300" />
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-3">
                    <span className="inline-block bg-varanasi-gold/20 text-varanasi-maroon px-3 py-1 rounded-full text-xs font-bold border border-varanasi-gold/30">
                      {room.category}
                    </span>
                  </div>

                  <Link href={`/rooms/${roomId}`}>
                    <h3 className="font-serif text-2xl font-bold text-varanasi-maroon hover:text-varanasi-gold transition-colors cursor-pointer mb-3">
                      {room.title}
                    </h3>
                  </Link>

                  <p className="text-varanasi-brown text-sm mb-4 line-clamp-2">
                    {room.description}
                  </p>

                  {/* Room Info */}
                  <div className="flex items-center gap-4 mb-4 text-xs text-varanasi-brown">
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-varanasi-gold" />
                      <span>{room.maxOccupancy} Guests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed size={14} className="text-varanasi-gold" />
                      <span>{room.bedType}</span>
                    </div>
                  </div>

                  {/* Features */}
                  {room.amenities && room.amenities.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {room.amenities.slice(0, 4).map((amenity, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-varanasi-brown">
                          <div className="w-1.5 h-1.5 rounded-full bg-varanasi-gold" />
                          {amenity}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex justify-between items-center pt-4 border-t border-varanasi-gold/10">
                    <div>
                      <p className="text-xs text-varanasi-brown">From</p>
                      <p className="font-serif text-2xl font-bold text-varanasi-gold">
                        ₹{room.price.toLocaleString()}
                      </p>
                    </div>
                    <Link href={`/rooms/${roomId}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-2 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 glow-box-hover transition-all"
                      >
                        View Details
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {!showAll && rooms.length > 3 && (
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