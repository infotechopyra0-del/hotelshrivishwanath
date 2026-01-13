'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, Clock, CreditCard, X, CheckCircle, XCircle } from 'lucide-react'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'

interface Booking {
  _id: string
  bookingId: string
  room: {
    _id: string
    roomNumber: string
    roomType: string
    images?: string[]
  }
  checkIn: string
  checkOut: string
  guests: {
    adults: number
    children: number
    infants: number
  }
  totalAmount: number
  paymentStatus: string
  bookingStatus: string
  nights: number
  totalGuests: number
  specialRequests?: string
  createdAt: string
}

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'current' | 'past'>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings/my-bookings')
      const data = await response.json()
      
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      case 'Checked-In':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'Checked-Out':
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      case 'Cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      default:
        return 'bg-varanasi-gold/20 text-varanasi-gold border-varanasi-gold/30'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'text-green-400'
      case 'Pending':
        return 'text-yellow-400'
      case 'Failed':
        return 'text-red-400'
      default:
        return 'text-gray-400'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const filteredBookings = bookings.filter(booking => {
    const today = new Date()
    const checkIn = new Date(booking.checkIn)
    const checkOut = new Date(booking.checkOut)

    if (filter === 'upcoming') {
      return checkIn > today && booking.bookingStatus === 'Confirmed'
    } else if (filter === 'current') {
      return checkIn <= today && checkOut >= today && booking.bookingStatus === 'Checked-In'
    } else if (filter === 'past') {
      return checkOut < today || booking.bookingStatus === 'Checked-Out'
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3B1F0D] via-[#4A1810] to-[#6B1A1A] pt-24">
        {/* Navbar */}
        <Navbar />
      {/* Decorative elements */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="fixed top-32 right-8 w-48 h-48 bg-varanasi-gold rounded-full blur-3xl opacity-20 pointer-events-none"
      />
      <motion.div
        animate={{ opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        className="fixed bottom-20 left-8 w-72 h-72 bg-varanasi-gold rounded-full blur-3xl opacity-15 pointer-events-none"
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="mb-4">
            <span className="text-4xl text-varanasi-gold opacity-60">◆</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-varanasi-cream mb-4">
            My Bookings
          </h1>
          <p className="text-lg text-varanasi-cream/80 max-w-2xl mx-auto">
            Manage and track all your reservations
          </p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {['all', 'upcoming', 'current', 'past'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab as any)}
              className={`px-6 py-2.5 rounded-full font-semibold capitalize transition-all duration-300 ${
                filter === tab
                  ? 'bg-varanasi-gold text-[#3B1F0D] shadow-lg shadow-varanasi-gold/50'
                  : 'bg-varanasi-cream/10 text-varanasi-cream hover:bg-varanasi-cream/20 border border-varanasi-gold/30'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Bookings Grid */}
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="w-16 h-16 border-4 border-varanasi-gold border-t-transparent rounded-full"
            />
          </div>
        ) : filteredBookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-semibold text-varanasi-cream mb-2">
              No bookings found
            </h3>
            <p className="text-varanasi-cream/70">
              {filter === 'all' ? 'You haven\'t made any bookings yet.' : `No ${filter} bookings.`}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedBooking(booking)}
                className="bg-gradient-to-br from-varanasi-cream/10 to-varanasi-cream/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-varanasi-gold/20 hover:border-varanasi-gold/50 transition-all duration-300 cursor-pointer hover:shadow-xl hover:shadow-varanasi-gold/20 group"
              >
                {/* Room Image */}
                <div className="relative h-48 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3B1F0D]/80 z-10" />
                  <img
                    src={booking.room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'}
                    alt={booking.room.roomType}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-varanasi-cream mb-1">
                      {booking.room.roomType}
                    </h3>
                    <p className="text-sm text-varanasi-gold font-semibold">
                      Booking ID: {booking.bookingId}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-varanasi-cream/80">
                      <Calendar className="w-5 h-5 text-varanasi-gold" />
                      <div className="text-sm">
                        <div>{formatDate(booking.checkIn)} - {formatDate(booking.checkOut)}</div>
                        <div className="text-xs text-varanasi-cream/60">{booking.nights} Night{booking.nights > 1 ? 's' : ''}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-varanasi-cream/80">
                      <Users className="w-5 h-5 text-varanasi-gold" />
                      <span className="text-sm">
                        {booking.guests.adults} Adult{booking.guests.adults > 1 ? 's' : ''}
                        {booking.guests.children > 0 && `, ${booking.guests.children} Child${booking.guests.children > 1 ? 'ren' : ''}`}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-varanasi-cream/80">
                      <CreditCard className="w-5 h-5 text-varanasi-gold" />
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-sm font-semibold">₹{booking.totalAmount.toLocaleString('en-IN')}</span>
                        <span className={`text-xs font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-varanasi-gold/20 hover:bg-varanasi-gold/30 text-varanasi-gold font-semibold rounded-lg transition-all duration-300 border border-varanasi-gold/50">
                    View Details
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBooking(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-gradient-to-br from-[#3B1F0D] to-[#6B1A1A] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-varanasi-gold/30 shadow-2xl"
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-[#3B1F0D] to-[#6B1A1A] p-6 border-b border-varanasi-gold/20 flex items-center justify-between z-10">
              <div>
                <h2 className="text-2xl font-bold text-varanasi-cream">Booking Details</h2>
                <p className="text-varanasi-gold text-sm">{selectedBooking.bookingId}</p>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-2 hover:bg-varanasi-cream/10 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-varanasi-cream" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Room Image */}
              <div className="relative h-64 rounded-xl overflow-hidden">
                <img
                  src={selectedBooking.room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'}
                  alt={selectedBooking.room.roomType}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Status Badges */}
              <div className="flex flex-wrap gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(selectedBooking.bookingStatus)}`}>
                  {selectedBooking.bookingStatus}
                </span>
                <span className={`px-4 py-2 rounded-full text-sm font-semibold bg-varanasi-cream/10 border border-varanasi-gold/30 ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                  Payment: {selectedBooking.paymentStatus}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-varanasi-cream/5 p-4 rounded-xl border border-varanasi-gold/10">
                  <div className="text-varanasi-gold text-sm mb-1">Room Type</div>
                  <div className="text-varanasi-cream font-semibold">{selectedBooking.room.roomType}</div>
                </div>

                <div className="bg-varanasi-cream/5 p-4 rounded-xl border border-varanasi-gold/10">
                  <div className="text-varanasi-gold text-sm mb-1">Room Number</div>
                  <div className="text-varanasi-cream font-semibold">{selectedBooking.room.roomNumber}</div>
                </div>

                <div className="bg-varanasi-cream/5 p-4 rounded-xl border border-varanasi-gold/10">
                  <div className="text-varanasi-gold text-sm mb-1">Check-in</div>
                  <div className="text-varanasi-cream font-semibold">{formatDate(selectedBooking.checkIn)}</div>
                </div>

                <div className="bg-varanasi-cream/5 p-4 rounded-xl border border-varanasi-gold/10">
                  <div className="text-varanasi-gold text-sm mb-1">Check-out</div>
                  <div className="text-varanasi-cream font-semibold">{formatDate(selectedBooking.checkOut)}</div>
                </div>

                <div className="bg-varanasi-cream/5 p-4 rounded-xl border border-varanasi-gold/10">
                  <div className="text-varanasi-gold text-sm mb-1">Guests</div>
                  <div className="text-varanasi-cream font-semibold">
                    {selectedBooking.guests.adults} Adult{selectedBooking.guests.adults > 1 ? 's' : ''}
                    {selectedBooking.guests.children > 0 && `, ${selectedBooking.guests.children} Child${selectedBooking.guests.children > 1 ? 'ren' : ''}`}
                  </div>
                </div>

                <div className="bg-varanasi-cream/5 p-4 rounded-xl border border-varanasi-gold/10">
                  <div className="text-varanasi-gold text-sm mb-1">Total Nights</div>
                  <div className="text-varanasi-cream font-semibold">{selectedBooking.nights} Night{selectedBooking.nights > 1 ? 's' : ''}</div>
                </div>
              </div>

              {/* Special Requests */}
              {selectedBooking.specialRequests && (
                <div className="bg-varanasi-cream/5 p-4 rounded-xl border border-varanasi-gold/10">
                  <div className="text-varanasi-gold text-sm mb-2">Special Requests</div>
                  <div className="text-varanasi-cream">{selectedBooking.specialRequests}</div>
                </div>
              )}

              {/* Total Amount */}
              <div className="bg-gradient-to-r from-varanasi-gold/20 to-varanasi-gold/10 p-6 rounded-xl border border-varanasi-gold/30">
                <div className="flex items-center justify-between">
                  <span className="text-varanasi-cream text-lg">Total Amount</span>
                  <span className="text-varanasi-gold text-2xl font-bold">
                    ₹{selectedBooking.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Booked Date */}
              <div className="text-center text-varanasi-cream/60 text-sm">
                Booked on {formatDate(selectedBooking.createdAt)}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default MyBookingsPage;