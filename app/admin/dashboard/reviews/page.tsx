'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Star, Eye, Trash2, MessageSquare, Calendar } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function ReviewsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const reviews = [
    {
      id: 1,
      customer: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      room: 'Deluxe Room 101',
      rating: 5,
      title: 'Excellent Stay Experience',
      comment: 'Amazing hospitality and clean rooms. The location is perfect for visiting temples and ghats. Staff was very helpful and courteous throughout our stay.',
      date: '2024-11-10',
      status: 'Published',
      helpful: 12
    },
    {
      id: 2,
      customer: 'Priya Sharma',
      email: 'priya@email.com',
      room: 'Premium Suite 201',
      rating: 4,
      title: 'Great Location and Service',
      comment: 'The hotel is perfectly located near the main ghats. Room was spacious and comfortable. Only issue was the noise from the street in the morning.',
      date: '2024-11-09',
      status: 'Published',
      helpful: 8
    },
    {
      id: 3,
      customer: 'Amit Patel',
      email: 'amit@email.com',
      room: 'Standard Room 102',
      rating: 3,
      title: 'Average Experience',
      comment: 'Room was okay but could be better maintained. Service was good but food quality needs improvement.',
      date: '2024-11-08',
      status: 'Pending',
      helpful: 2
    },
    {
      id: 4,
      customer: 'Sunita Gupta',
      email: 'sunita@email.com',
      room: 'Deluxe Room 104',
      rating: 5,
      title: 'Perfect for Spiritual Journey',
      comment: 'The spiritual ambiance of the hotel perfectly complements the sacred atmosphere of Varanasi. Highly recommended for pilgrims.',
      date: '2024-11-07',
      status: 'Published',
      helpful: 15
    },
    {
      id: 5,
      customer: 'Vikash Singh',
      email: 'vikash@email.com',
      room: 'Standard Room 103',
      rating: 2,
      title: 'Disappointing Stay',
      comment: 'Room was not clean upon arrival. AC was not working properly. Service was slow.',
      date: '2024-11-06',
      status: 'Flagged',
      helpful: 1
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Published': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Flagged': return 'bg-red-100 text-red-800'
      case 'Hidden': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getAverageRating = () => {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / reviews.length).toFixed(1)
  }

  return (
    <AdminLayout>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-varanasi-maroon mb-2">Reviews & Ratings</h1>
            <p className="text-varanasi-brown">Manage customer reviews and feedback</p>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-varanasi-maroon">127</h3>
                <p className="text-varanasi-brown text-sm">Total Reviews</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-yellow-600">{getAverageRating()}</h3>
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                </div>
                <p className="text-varanasi-brown text-sm">Average Rating</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-600">89</h3>
                <p className="text-varanasi-brown text-sm">Published</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-yellow-600">18</h3>
                <p className="text-varanasi-brown text-sm">Pending Review</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-varanasi-brown/50" />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
              />
            </div>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">All Status</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending</option>
              <option value="Flagged">Flagged</option>
              <option value="Hidden">Hidden</option>
            </select>
          </div>
        </motion.div>

        {/* Reviews List */}
        <motion.div variants={itemVariants} className="space-y-6">
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              whileHover={{ scale: 1.01 }}
              className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-varanasi-gold rounded-full flex items-center justify-center">
                    <span className="text-varanasi-maroon font-bold">
                      {review.customer.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-varanasi-maroon">{review.customer}</h3>
                    <p className="text-sm text-varanasi-brown">{review.email}</p>
                    <p className="text-sm text-varanasi-brown">{review.room}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                    <span className="text-sm text-varanasi-brown">({review.rating}/5)</span>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(review.status)}`}>
                    {review.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-semibold text-varanasi-maroon mb-2">{review.title}</h4>
                <p className="text-varanasi-brown leading-relaxed">{review.comment}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 text-sm text-varanasi-brown">
                  <span>Posted on {review.date}</span>
                  <span>• {review.helpful} found helpful</span>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                  >
                    View Details
                  </motion.button>
                  {review.status === 'Pending' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                    >
                      Approve
                    </motion.button>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </AdminLayout>
  )
}