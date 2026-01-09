'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, Download, Calendar, IndianRupee } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const orders = [
    {
      id: 'BK001',
      customer: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      room: 'Deluxe Room 101',
      checkIn: '2024-11-15',
      checkOut: '2024-11-17',
      nights: 2,
      amount: 5000,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      bookingDate: '2024-11-10'
    },
    {
      id: 'BK002',
      customer: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '+91 98765 43211',
      room: 'Premium Suite 201',
      checkIn: '2024-11-16',
      checkOut: '2024-11-19',
      nights: 3,
      amount: 10500,
      status: 'Pending',
      paymentStatus: 'Pending',
      bookingDate: '2024-11-11'
    },
    {
      id: 'BK003',
      customer: 'Amit Patel',
      email: 'amit@email.com',
      phone: '+91 98765 43212',
      room: 'Standard Room 102',
      checkIn: '2024-11-17',
      checkOut: '2024-11-20',
      nights: 3,
      amount: 6000,
      status: 'Confirmed',
      paymentStatus: 'Paid',
      bookingDate: '2024-11-12'
    },
    {
      id: 'BK004',
      customer: 'Sunita Gupta',
      email: 'sunita@email.com',
      phone: '+91 98765 43213',
      room: 'Deluxe Room 104',
      checkIn: '2024-11-18',
      checkOut: '2024-11-20',
      nights: 2,
      amount: 5000,
      status: 'Cancelled',
      paymentStatus: 'Refunded',
      bookingDate: '2024-11-08'
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
      case 'Confirmed': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Cancelled': return 'bg-red-100 text-red-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      case 'Failed': return 'bg-red-100 text-red-800'
      case 'Refunded': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
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
            <h1 className="text-3xl font-serif font-bold text-varanasi-maroon mb-2">Orders Management</h1>
            <p className="text-varanasi-brown">Manage all booking orders and reservations</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 bg-varanasi-gold text-varanasi-maroon rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Download className="w-5 h-5" />
            Export Orders
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-varanasi-maroon">156</h3>
                <p className="text-varanasi-brown text-sm">Total Orders</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-600">₹4,85,000</h3>
                <p className="text-varanasi-brown text-sm">Total Revenue</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <IndianRupee className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-yellow-600">24</h3>
                <p className="text-varanasi-brown text-sm">Pending Orders</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-varanasi-gold">89%</h3>
                <p className="text-varanasi-brown text-sm">Success Rate</p>
              </div>
              <div className="p-3 bg-varanasi-gold/20 rounded-lg">
                <Calendar className="w-6 h-6 text-varanasi-gold" />
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
                placeholder="Search by order ID, customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
              />
            </div>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">All Status</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Completed">Completed</option>
            </select>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">Payment Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </motion.div>

        {/* Orders Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-varanasi-cream/20">
                <tr>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Order ID</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Customer</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Room</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Check-in</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Nights</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Amount</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Status</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Payment</th>
                  <th className="text-left p-6 text-varanasi-maroon font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t border-varanasi-gold/10 hover:bg-varanasi-cream/10">
                    <td className="p-6">
                      <div className="font-semibold text-varanasi-maroon">{order.id}</div>
                      <div className="text-sm text-varanasi-brown">{order.bookingDate}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-semibold text-varanasi-maroon">{order.customer}</div>
                      <div className="text-sm text-varanasi-brown">{order.email}</div>
                      <div className="text-sm text-varanasi-brown">{order.phone}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-semibold text-varanasi-maroon">{order.room}</div>
                    </td>
                    <td className="p-6">
                      <div className="font-semibold text-varanasi-maroon">{order.checkIn}</div>
                      <div className="text-sm text-varanasi-brown">to {order.checkOut}</div>
                    </td>
                    <td className="p-6">
                      <span className="font-semibold text-varanasi-maroon">{order.nights}</span>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-varanasi-gold">₹{order.amount.toLocaleString()}</span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-6">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </AdminLayout>
  )
}