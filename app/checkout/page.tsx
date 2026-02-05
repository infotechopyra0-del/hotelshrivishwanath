'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
// Razorpay types (for TypeScript)
declare global {
  interface Window {
    Razorpay: any;
  }
}

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-sdk')) return resolve(true);
      const script = document.createElement('script');
      script.id = 'razorpay-sdk';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import {
  Calendar,
  Users,
  CreditCard,
  Mail,
  Phone,
  User,
  MapPin,
  MessageSquare,
  ArrowLeft,
  Check,
  Clock,
  DollarSign,
} from 'lucide-react'
import { toast } from 'sonner'

interface SelectedRoom {
  id: string
  title: string
  price: number
  category: string
  image: string
  maxOccupancy: number
}

interface BookingForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  specialRequests: string
  address: string
  city: string
  state: string
  pincode: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [selectedRoom, setSelectedRoom] = useState<SelectedRoom | null>(null)
  const [loading, setLoading] = useState(false)
  const [nights, setNights] = useState(1)
  const [formData, setFormData] = useState<BookingForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    specialRequests: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  })

  useEffect(() => {
    // Get room details from localStorage
    const roomData = localStorage.getItem('selectedRoom')
    if (roomData) {
      setSelectedRoom(JSON.parse(roomData))
    } else {
      toast.error('No room selected')
      router.push('/rooms')
    }
  }, [router])

  // Auto-fill user data if logged in
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/profile')
          if (response.ok) {
            const userData = await response.json()
            setFormData(prev => ({
              ...prev,
              firstName: userData.firstName || prev.firstName,
              lastName: userData.lastName || prev.lastName,
              email: userData.email || prev.email,
              phone: userData.phone || prev.phone,
              address: userData.address || prev.address,
              city: userData.city || prev.city,
              state: userData.state || prev.state,
              pincode: userData.pincode || prev.pincode,
            }))
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }
    }
    
    fetchUserData()
  }, [session])

  // Check authentication status
  useEffect(() => {
    if (!session) {
      toast.error('Please login to access checkout')
      router.push('/auth/signin')
      return
    }
  }, [session, router])

  useEffect(() => {
    // Calculate nights between check-in and check-out
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn)
      const checkOut = new Date(formData.checkOut)
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
      setNights(diffDays || 1)
    }
  }, [formData.checkIn, formData.checkOut])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName) {
      toast.error('Please enter your full name')
      return false
    }
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('Please enter a valid email')
      return false
    }
    if (!formData.phone || formData.phone.length < 10) {
      toast.error('Please enter a valid phone number')
      return false
    }
    if (!formData.checkIn || !formData.checkOut) {
      toast.error('Please select check-in and check-out dates')
      return false
    }
    if (new Date(formData.checkIn) >= new Date(formData.checkOut)) {
      toast.error('Check-out date must be after check-in date')
      return false
    }
    if (new Date(formData.checkIn) < new Date()) {
      toast.error('Check-in date cannot be in the past')
      return false
    }
    if (!formData.guests || formData.guests < 1) {
      toast.error('Please select number of guests')
      return false
    }
    if (selectedRoom && formData.guests > selectedRoom.maxOccupancy) {
      toast.error(`Maximum ${selectedRoom.maxOccupancy} guests allowed for this room`)
      return false
    }
    if (!formData.address || !formData.city || !formData.state) {
      toast.error('Please complete your address details')
      return false
    }
    return true
  }


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error('Failed to load payment gateway.');
        setLoading(false);
        return;
      }

      // 2. Create order on backend
      const amount = selectedRoom ? (selectedRoom.price * nights + Math.round(selectedRoom.price * nights * 0.12)) : 0;
      const orderRes = await fetch('/api/razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount }),
      });
      const orderData = await orderRes.json();
      
      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }
      
      if (!orderData.id) {
        console.error('Order creation response:', orderData);
        throw new Error('Order creation failed - invalid response format');
      }

      // 3. Open Razorpay modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Hotel Shri Vishwanath',
        description: `Booking for ${selectedRoom?.title}`,
        image: '/images/Rooms1.jpg',
        order_id: orderData.id,
        handler: async function (response: any) {
          // 4. On payment success, save booking
          try {
            const bookingPayload = {
              roomId: selectedRoom?.id,
              ...formData,
              nights,
              totalAmount: amount,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              paymentSignature: response.razorpay_signature,
            };
            const saveRes = await fetch('/api/bookings', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bookingPayload),
            });
            if (!saveRes.ok) throw new Error('Booking save failed');
            toast.success('Booking confirmed!');
            localStorage.removeItem('selectedRoom');
            setTimeout(() => router.push('/'), 2000);
          } catch (err) {
            toast.error('Payment succeeded but booking failed. Please contact support.');
          }
        },
        prefill: {
          name: formData.firstName + ' ' + formData.lastName,
          email: formData.email,
          contact: formData.phone,
        },
        theme: { color: '#BFA14A' },
        modal: {
          ondismiss: () => setLoading(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Booking error:', error);
      toast.error('Failed to process booking. Please try again.');
      setLoading(false);
    }
  };

  if (!selectedRoom) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-varanasi-cream via-white to-varanasi-cream">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-varanasi-gold border-t-transparent"></div>
          <p className="mt-4 text-varanasi-brown font-semibold">Loading...</p>
        </div>
      </div>
    )
  }

  const subtotal = selectedRoom.price * nights
  const taxes = Math.round(subtotal * 0.12) // 12% tax
  const total = subtotal + taxes

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-varanasi-cream via-white to-varanasi-cream py-24">
        <div className="container-custom">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-varanasi-maroon hover:text-varanasi-gold transition-colors font-semibold mb-8"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-4">
              Complete Your Booking
            </h1>
            <p className="text-varanasi-brown text-lg">
              Just a few steps away from your dream stay
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-varanasi-gold/20">
                  <h2 className="font-serif text-2xl font-bold text-varanasi-maroon mb-6 flex items-center gap-2">
                    <User size={24} className="text-varanasi-gold" />
                    Personal Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                        placeholder="John"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                        placeholder="Doe"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        Email *
                      </label>
                      <div className="relative">
                        <Mail
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-varanasi-gold"
                        />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-11 pr-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        Phone *
                      </label>
                      <div className="relative">
                        <Phone
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-varanasi-gold"
                        />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-11 pr-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-varanasi-gold/20">
                  <h2 className="font-serif text-2xl font-bold text-varanasi-maroon mb-6 flex items-center gap-2">
                    <MapPin size={24} className="text-varanasi-gold" />
                    Address Details
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        Address *
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                        placeholder="Street address"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                          placeholder="City"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                          State *
                        </label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                          placeholder="State"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                          placeholder="123456"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-varanasi-gold/20">
                  <h2 className="font-serif text-2xl font-bold text-varanasi-maroon mb-6 flex items-center gap-2">
                    <Calendar size={24} className="text-varanasi-gold" />
                    Booking Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        Check-in Date *
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={formData.checkIn}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        Check-out Date *
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={formData.checkOut}
                        onChange={handleInputChange}
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                        required
                        className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                        Number of Guests *
                      </label>
                      <div className="relative">
                        <Users
                          size={20}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-varanasi-gold"
                        />
                        <input
                          type="number"
                          name="guests"
                          value={formData.guests}
                          onChange={handleInputChange}
                          min="1"
                          max={selectedRoom.maxOccupancy}
                          required
                          className="w-full pl-11 pr-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold text-varanasi-brown mb-2">
                      Special Requests
                    </label>
                    <textarea
                      name="specialRequests"
                      value={formData.specialRequests}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-3 border-2 border-varanasi-gold/30 rounded-xl focus:outline-none focus:border-varanasi-gold resize-none"
                      placeholder="Any special requirements or requests..."
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg transition-all ${
                    loading
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon hover:shadow-xl hover:shadow-varanasi-gold/50'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent"></div>
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <Check size={20} />
                      Confirm Booking
                    </span>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-varanasi-gold/20 sticky top-24">
                <h2 className="font-serif text-2xl font-bold text-varanasi-maroon mb-6">
                  Booking Summary
                </h2>

                {/* Room Image */}
                <div className="relative h-48 rounded-xl overflow-hidden mb-4 border-2 border-varanasi-gold/30">
                  <Image
                    src={selectedRoom.image}
                    alt={selectedRoom.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Room Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-bold text-lg text-varanasi-maroon">
                      {selectedRoom.title}
                    </h3>
                    <p className="text-sm text-varanasi-brown">
                      {selectedRoom.category}
                    </p>
                  </div>

                  {formData.checkIn && formData.checkOut && (
                    <div className="flex items-center gap-2 text-sm text-varanasi-brown">
                      <Clock size={16} className="text-varanasi-gold" />
                      <span>{nights} Night{nights > 1 ? 's' : ''}</span>
                    </div>
                  )}

                  {formData.guests > 0 && (
                    <div className="flex items-center gap-2 text-sm text-varanasi-brown">
                      <Users size={16} className="text-varanasi-gold" />
                      <span>{formData.guests} Guest{formData.guests > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="border-t-2 border-varanasi-gold/20 pt-4 space-y-3">
                  <div className="flex justify-between text-varanasi-brown">
                    <span>
                      ₹{selectedRoom.price.toLocaleString()} × {nights} night{nights > 1 ? 's' : ''}
                    </span>
                    <span className="font-semibold">
                      ₹{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-varanasi-brown">
                    <span>Taxes & Fees (12%)</span>
                    <span className="font-semibold">₹{taxes.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 border-varanasi-gold/20 pt-3 flex justify-between items-center">
                    <span className="font-bold text-lg text-varanasi-maroon">
                      Total
                    </span>
                    <span className="font-serif text-2xl font-bold text-varanasi-gold">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-varanasi-cream/50 rounded-xl p-4 border border-varanasi-gold/20">
                  <p className="text-xs text-varanasi-brown text-center">
                    <span className="font-semibold">Free cancellation</span> up to 24 hours before check-in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}