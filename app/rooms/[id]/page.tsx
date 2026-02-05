'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Star,
  Users,
  Bed,
  Maximize,
  Eye,
  Building,
  Check,
  ArrowLeft,
  Heart,
  Share2,
  Calendar,
  DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'

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
  roomSize: string
  amenities: string[]
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE'
  isAvailable: boolean
  featured: boolean
  order: number
  viewType: string
  floor: string
  createdAt?: string
  updatedAt?: string
}

export default function RoomDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const roomId = typeof params?.id === 'string' ? params.id : ''
  console.log('RoomDetailsPage: roomId', roomId)

  const [room, setRoom] = useState<Room | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (roomId) {
      fetchRoomDetails()
    }
  }, [roomId])

  const fetchRoomDetails = async () => {
    try {
      console.log('Fetching room details for:', roomId)
      const res = await fetch(`/api/rooms/${roomId}`)
      console.log('API response status:', res.status)
      if (!res.ok) throw new Error('Failed to fetch room details')
      const data = await res.json()
      console.log('Fetched room data:', data)
      setRoom(data)
    } catch (error) {
      console.error('Error fetching room:', error)
      toast.error('Failed to load room details')
    } finally {
      setLoading(false)
    }
  }

  const handleBookNow = () => {
    if (!room) return

    // Check if user is authenticated
    if (status === 'loading') {
      toast.error('Please wait...')
      return
    }

    if (!session) {
      toast.error('Please login to book a room')
      // Store room data and redirect to login
      localStorage.setItem('selectedRoom', JSON.stringify({
        id: room._id || room.id,
        title: room.title,
        price: room.price,
        category: room.category,
        image: typeof room.image === 'string' ? room.image : room.image.url,
        maxOccupancy: room.maxOccupancy,
      }))
      router.push('/auth/signin')
      return
    }
    
    // Store room details in localStorage for checkout page
    localStorage.setItem('selectedRoom', JSON.stringify({
      id: room._id || room.id,
      title: room.title,
      price: room.price,
      category: room.category,
      image: typeof room.image === 'string' ? room.image : room.image.url,
      maxOccupancy: room.maxOccupancy,
    }))
    
    // Navigate to checkout page
    router.push('/checkout')
  }

  const handleShare = async () => {
    const url = window.location.href
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: room?.title,
          text: `Check out this amazing room: ${room?.title}`,
          url: url,
        })
        toast.success('Shared successfully!')
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard!')
    }
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites')
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-b from-varanasi-cream via-white to-varanasi-cream">
          {/* Back Button Skeleton */}
          <div className="container-custom pt-24 pb-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-varanasi-gold/20 rounded animate-pulse" />
              <div className="w-12 h-5 bg-varanasi-gold/20 rounded animate-pulse" />
            </motion.div>
          </div>

          <div className="container-custom pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Image Section Skeleton */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                {/* Main Image Skeleton */}
                <div className="relative h-96 lg:h-[500px] rounded-2xl bg-varanasi-gold/10 border-4 border-varanasi-gold/30 animate-pulse overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-varanasi-gold/5 via-varanasi-gold/10 to-varanasi-gold/5 animate-shimmer" />
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex gap-4">
                  <div className="flex-1 h-12 bg-varanasi-gold/10 rounded-xl animate-pulse" />
                  <div className="flex-1 h-12 bg-varanasi-gold/10 rounded-xl animate-pulse" />
                </div>
              </motion.div>

              {/* Details Section Skeleton */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                {/* Category Badge Skeleton */}
                <div className="w-24 h-8 bg-varanasi-gold/20 rounded-full animate-pulse" />

                {/* Title Skeleton */}
                <div className="space-y-3">
                  <div className="w-3/4 h-12 bg-varanasi-gold/10 rounded animate-pulse" />
                  <div className="w-1/2 h-8 bg-varanasi-gold/10 rounded animate-pulse" />
                </div>

                {/* Description Skeleton */}
                <div className="space-y-2">
                  <div className="w-full h-5 bg-varanasi-gold/10 rounded animate-pulse" />
                  <div className="w-4/5 h-5 bg-varanasi-gold/10 rounded animate-pulse" />
                  <div className="w-3/5 h-5 bg-varanasi-gold/10 rounded animate-pulse" />
                </div>

                {/* Price Skeleton */}
                <div className="bg-varanasi-gold/5 border-2 border-varanasi-gold/30 rounded-2xl p-6">
                  <div className="flex items-end gap-3">
                    <div className="space-y-2">
                      <div className="w-20 h-4 bg-varanasi-gold/20 rounded animate-pulse" />
                      <div className="w-32 h-12 bg-varanasi-gold/20 rounded animate-pulse" />
                    </div>
                    <div className="w-16 h-4 bg-varanasi-gold/20 rounded animate-pulse mb-2" />
                  </div>
                </div>

                {/* Room Specifications Skeleton */}
                <div className="grid grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className={`bg-white rounded-xl p-4 border-2 border-varanasi-gold/20 shadow-sm ${i === 3 ? 'col-span-2' : ''}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-6 h-6 bg-varanasi-gold/20 rounded animate-pulse" />
                        <div className="w-20 h-4 bg-varanasi-gold/10 rounded animate-pulse" />
                      </div>
                      <div className="w-24 h-6 bg-varanasi-gold/10 rounded animate-pulse" />
                    </div>
                  ))}
                </div>

                {/* Amenities Skeleton */}
                <div className="bg-white rounded-2xl p-6 border-2 border-varanasi-gold/20 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-6 h-6 bg-varanasi-gold/20 rounded animate-pulse" />
                    <div className="w-20 h-6 bg-varanasi-gold/10 rounded animate-pulse" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[...Array(6)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-varanasi-gold/20 animate-pulse" />
                        <div className={`h-4 bg-varanasi-gold/10 rounded animate-pulse ${i % 3 === 0 ? 'w-24' : i % 3 === 1 ? 'w-20' : 'w-28'}`} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability Status Skeleton */}
                <div className="p-4 rounded-xl border-2 border-varanasi-gold/20 bg-white">
                  <div className="w-40 h-5 bg-varanasi-gold/10 rounded animate-pulse" />
                </div>
                
                {/* Book Now Buttons Skeleton */}
                <div className="space-y-4 pt-4">
                  <div className="w-full h-16 bg-varanasi-gold/20 rounded-2xl animate-pulse" />
                  <div className="w-full h-16 bg-varanasi-gold/10 rounded-2xl animate-pulse" />
                </div>

                {/* Additional Info Skeleton */}
                <div className="bg-varanasi-cream/50 rounded-xl p-4 border border-varanasi-gold/20">
                  <div className="w-3/4 h-4 bg-varanasi-gold/10 rounded animate-pulse mx-auto" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-varanasi-cream via-white to-varanasi-cream">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-varanasi-maroon mb-4">Room Not Found</h2>
          <button
            onClick={() => router.push('/rooms')}
            className="px-6 py-3 bg-varanasi-gold text-varanasi-maroon rounded-full font-semibold hover:shadow-lg transition-all"
          >
            Back to Rooms
          </button>
        </div>
      </div>
    )
  }

  const imageUrl = typeof room.image === 'string' ? room.image : room.image.url

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-varanasi-cream via-white to-varanasi-cream">
        {/* Back Button */}
        <div className="container-custom pt-24 pb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-varanasi-maroon hover:text-varanasi-gold transition-colors font-semibold"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        <div className="container-custom pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              {/* Main Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden shadow-2xl border-4 border-varanasi-gold/30">
                <Image
                  src={imageUrl}
                  alt={room.title}
                  fill
                  className="object-cover"
                  priority
                />
                {room.featured && (
                  <div className="absolute top-4 right-4 bg-varanasi-gold text-varanasi-maroon px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                    <Star size={16} className="fill-varanasi-maroon" />
                    Featured
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={toggleFavorite}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                    isFavorite
                      ? 'bg-red-100 text-red-600 border-2 border-red-600'
                      : 'bg-white text-varanasi-maroon border-2 border-varanasi-maroon hover:bg-varanasi-maroon/5'
                  }`}
                >
                  <Heart size={20} className={isFavorite ? 'fill-red-600' : ''} />
                  {isFavorite ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-varanasi-maroon border-2 border-varanasi-maroon rounded-xl font-semibold hover:bg-varanasi-maroon/5 transition-all"
                >
                  <Share2 size={20} />
                  Share
                </button>
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Category Badge */}
              <div>
                <span className="inline-block bg-varanasi-gold/20 text-varanasi-maroon px-4 py-2 rounded-full text-sm font-bold border border-varanasi-gold">
                  {room.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon">
                {room.title}
              </h1>

              {/* Description */}
              <p className="text-varanasi-brown text-lg leading-relaxed">
                {room.description}
              </p>

              {/* Price */}
              <div className="bg-gradient-to-r from-varanasi-gold/10 to-varanasi-gold/5 border-2 border-varanasi-gold/30 rounded-2xl p-6">
                <div className="flex items-end gap-3">
                  <div>
                    <p className="text-varanasi-brown text-sm">Starting from</p>
                    <p className="font-serif text-5xl font-bold text-varanasi-gold">
                      ₹{room.price.toLocaleString()}
                    </p>
                  </div>
                  <p className="text-varanasi-brown text-sm mb-2">per night</p>
                </div>
              </div>

              {/* Room Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 border-2 border-varanasi-gold/20 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={24} className="text-varanasi-gold" />
                    <span className="text-varanasi-brown text-sm">Max Occupancy</span>
                  </div>
                  <p className="font-bold text-varanasi-maroon text-xl">
                    {room.maxOccupancy} Guests
                  </p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-varanasi-gold/20 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Bed size={24} className="text-varanasi-gold" />
                    <span className="text-varanasi-brown text-sm">Bed Type</span>
                  </div>
                  <p className="font-bold text-varanasi-maroon text-xl">
                    {room.bedType}
                  </p>
                </div>

                {room.roomSize && (
                  <div className="bg-white rounded-xl p-4 border-2 border-varanasi-gold/20 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                      <Maximize size={24} className="text-varanasi-gold" />
                      <span className="text-varanasi-brown text-sm">Room Size</span>
                    </div>
                    <p className="font-bold text-varanasi-maroon text-xl">
                      {room.roomSize}
                    </p>
                  </div>
                )}

                {room.floor && (
                  <div className="bg-white rounded-xl p-4 border-2 border-varanasi-gold/20 shadow-sm col-span-2">
                    <div className="flex items-center gap-3 mb-2">
                      <Building size={24} className="text-varanasi-gold" />
                      <span className="text-varanasi-brown text-sm">Floor</span>
                    </div>
                    <p className="font-bold text-varanasi-maroon text-xl">
                      {room.floor}
                    </p>
                  </div>
                )}
              </div>

              {/* Amenities */}
              {room.amenities && room.amenities.length > 0 && (
                <div className="bg-white rounded-2xl p-6 border-2 border-varanasi-gold/20 shadow-sm">
                  <h3 className="font-serif text-2xl font-bold text-varanasi-maroon mb-4 flex items-center gap-2">
                    <Check size={24} className="text-varanasi-gold" />
                    Amenities
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-varanasi-brown"
                      >
                        <div className="w-2 h-2 rounded-full bg-varanasi-gold" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability Status */}
              <div
                className={`p-4 rounded-xl border-2 ${
                  room.isAvailable && room.status === 'ACTIVE'
                    ? 'bg-green-50 border-green-500'
                    : 'bg-red-50 border-red-500'
                }`}
              >
                <p
                  className={`font-semibold ${
                    room.isAvailable && room.status === 'ACTIVE'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}
                >
                  {room.isAvailable && room.status === 'ACTIVE'
                    ? '✓ Available for Booking'
                    : '✗ Currently Unavailable'}
                </p>
              </div>

              {/* Book Now Button */}
              <div className="space-y-4 pt-4">
                <motion.button
                  onClick={handleBookNow}
                  disabled={!room.isAvailable || room.status !== 'ACTIVE'}
                  whileHover={{ scale: room.isAvailable && room.status === 'ACTIVE' ? 1.02 : 1 }}
                  whileTap={{ scale: room.isAvailable && room.status === 'ACTIVE' ? 0.98 : 1 }}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                    room.isAvailable && room.status === 'ACTIVE'
                      ? 'bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon hover:shadow-xl hover:shadow-varanasi-gold/50'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {room.isAvailable && room.status === 'ACTIVE'
                    ? 'Book Now'
                    : 'Currently Unavailable'}
                </motion.button>

                {/* WhatsApp Inquiry */}
                <motion.a
                  href={`https://wa.me/916390057777?text=Hello!%20I%27m%20interested%20in%20booking%20${encodeURIComponent(
                    room.title
                  )}%20at%20Hotel%20Shri%20Vishwanath.%20Could%20you%20please%20help%20me%20with%20availability%20and%20pricing%20for%20₹${room.price.toLocaleString()}%20per%20night%3F`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-4 bg-white border-2 border-varanasi-maroon text-varanasi-maroon rounded-2xl font-bold text-lg hover:bg-varanasi-maroon/5 transition-all flex items-center justify-center gap-2"
                >
                  💬 Inquire on WhatsApp
                </motion.a>
              </div>

              {/* Additional Info */}
              <div className="bg-varanasi-cream/50 rounded-xl p-4 border border-varanasi-gold/20">
                <p className="text-sm text-varanasi-brown text-center">
                  <span className="font-semibold">Free cancellation</span> up to 24 hours before check-in
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}