'use client'

import { motion } from 'framer-motion'
import { 
  Users, 
  Bed, 
  Star, 
  ShoppingCart, 
  TrendingUp, 
  Calendar,
  IndianRupee,
  Eye,
  MessageSquare
} from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Bookings', value: '156', change: '+12%', icon: Calendar, color: 'from-blue-500 to-blue-600', bgColor: 'bg-blue-500' },
    { title: 'Total Revenue', value: '₹4,85,000', change: '+8%', icon: IndianRupee, color: 'from-green-500 to-green-600', bgColor: 'bg-green-500' },
    { title: 'Occupied Rooms', value: '24/30', change: '80%', icon: Bed, color: 'from-orange-500 to-orange-600', bgColor: 'bg-orange-500' },
    { title: 'New Customers', value: '48', change: '+15%', icon: Users, color: 'from-purple-500 to-purple-600', bgColor: 'bg-purple-500' },
    { title: 'Average Rating', value: '4.8', change: '+0.2', icon: Star, color: 'from-yellow-500 to-yellow-600', bgColor: 'bg-yellow-500' },
    { title: 'Website Views', value: '12.5K', change: '+25%', icon: Eye, color: 'from-indigo-500 to-indigo-600', bgColor: 'bg-indigo-500' },
  ]

  const recentBookings = [
    { id: 'BK001', customer: 'Rajesh Kumar', room: 'Deluxe Room', checkIn: '2024-11-15', amount: '₹2,500', status: 'Confirmed' },
    { id: 'BK002', customer: 'Priya Sharma', room: 'Premium Suite', checkIn: '2024-11-16', amount: '₹3,500', status: 'Pending' },
    { id: 'BK003', customer: 'Amit Patel', room: 'Standard Room', checkIn: '2024-11-17', amount: '₹2,000', status: 'Confirmed' },
    { id: 'BK004', customer: 'Sunita Gupta', room: 'Deluxe Room', checkIn: '2024-11-18', amount: '₹2,500', status: 'Cancelled' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-varanasi-maroon mb-2">
            Dashboard Overview
          </h1>
          <p className="text-varanasi-brown">Welcome to Hotel Shri Vishwanath Admin Panel</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <h3 className="text-2xl font-bold text-varanasi-maroon mb-1">{stat.value}</h3>
              <p className="text-varanasi-brown text-sm">{stat.title}</p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Bookings */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-varanasi-maroon">Recent Bookings</h2>
              <ShoppingCart className="w-5 h-5 text-varanasi-gold" />
            </div>
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div key={booking.id} className="flex items-center justify-between p-4 bg-varanasi-cream/10 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-varanasi-maroon">{booking.customer}</h4>
                    <p className="text-sm text-varanasi-brown">{booking.room} • {booking.checkIn}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-varanasi-maroon">{booking.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-serif font-bold text-varanasi-maroon">Quick Actions</h2>
              <TrendingUp className="w-5 h-5 text-varanasi-gold" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-varanasi-gold text-varanasi-maroon rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Add New Room
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-varanasi-maroon text-varanasi-cream rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                View Orders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-green-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Generate Report
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 bg-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Manage Coupons
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Revenue Chart Placeholder */}
        <motion.div variants={itemVariants} className="mt-8 bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
          <h2 className="text-xl font-serif font-bold text-varanasi-maroon mb-6">Monthly Revenue Trend</h2>
          <div className="h-64 bg-gradient-to-br from-varanasi-cream/20 to-varanasi-gold/20 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-varanasi-gold mx-auto mb-4" />
              <p className="text-varanasi-brown">Chart visualization will be implemented here</p>
              <p className="text-sm text-varanasi-brown/70 mt-2">Integration with Chart.js or similar library</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
      </>
  )
}