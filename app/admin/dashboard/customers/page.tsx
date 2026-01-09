'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Plus, Edit2, Trash2, Users, Mail, Phone, MapPin } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const customers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@email.com',
      phone: '+91 98765 43210',
      location: 'Mumbai, Maharashtra',
      totalBookings: 5,
      totalSpent: 25000,
      lastVisit: '2024-11-10',
      status: 'Active',
      joinDate: '2023-08-15'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@email.com',
      phone: '+91 98765 43211',
      location: 'Delhi, Delhi',
      totalBookings: 3,
      totalSpent: 15000,
      lastVisit: '2024-11-11',
      status: 'Active',
      joinDate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit@email.com',
      phone: '+91 98765 43212',
      location: 'Ahmedabad, Gujarat',
      totalBookings: 2,
      totalSpent: 8000,
      lastVisit: '2024-10-15',
      status: 'Inactive',
      joinDate: '2024-03-10'
    },
    {
      id: 4,
      name: 'Sunita Gupta',
      email: 'sunita@email.com',
      phone: '+91 98765 43213',
      location: 'Kolkata, West Bengal',
      totalBookings: 7,
      totalSpent: 35000,
      lastVisit: '2024-11-08',
      status: 'VIP',
      joinDate: '2023-05-22'
    },
    {
      id: 5,
      name: 'Vikash Singh',
      email: 'vikash@email.com',
      phone: '+91 98765 43214',
      location: 'Patna, Bihar',
      totalBookings: 1,
      totalSpent: 2500,
      lastVisit: '2024-09-20',
      status: 'Active',
      joinDate: '2024-09-18'
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
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Inactive': return 'bg-red-100 text-red-800'
      case 'VIP': return 'bg-purple-100 text-purple-800'
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
            <h1 className="text-3xl font-serif font-bold text-varanasi-maroon mb-2">Customers Management</h1>
            <p className="text-varanasi-brown">Manage customer information and relationships</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-varanasi-gold text-varanasi-maroon rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Customer
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-varanasi-maroon">248</h3>
                <p className="text-varanasi-brown text-sm">Total Customers</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-600">185</h3>
                <p className="text-varanasi-brown text-sm">Active Customers</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-purple-600">12</h3>
                <p className="text-varanasi-brown text-sm">VIP Customers</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-varanasi-gold">₹15,200</h3>
                <p className="text-varanasi-brown text-sm">Avg. Spend</p>
              </div>
              <div className="p-3 bg-varanasi-gold/20 rounded-lg">
                <Users className="w-6 h-6 text-varanasi-gold" />
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
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
              />
            </div>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="VIP">VIP</option>
            </select>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">Sort By</option>
              <option value="name">Name</option>
              <option value="totalSpent">Total Spent</option>
              <option value="lastVisit">Last Visit</option>
              <option value="joinDate">Join Date</option>
            </select>
          </div>
        </motion.div>

        {/* Customers Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {customers.map((customer) => (
            <motion.div
              key={customer.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-varanasi-gold rounded-full flex items-center justify-center">
                    <span className="text-varanasi-maroon font-bold text-lg">
                      {customer.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-varanasi-maroon">{customer.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(customer.status)}`}>
                      {customer.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-varanasi-brown">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">{customer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-varanasi-brown">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{customer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-varanasi-brown">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{customer.location}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-varanasi-maroon">{customer.totalBookings}</div>
                  <div className="text-xs text-varanasi-brown">Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-varanasi-gold">₹{customer.totalSpent.toLocaleString()}</div>
                  <div className="text-xs text-varanasi-brown">Total Spent</div>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-sm text-varanasi-brown">Last Visit: {customer.lastVisit}</div>
                <div className="text-sm text-varanasi-brown">Member since: {customer.joinDate}</div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 py-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                >
                  <Edit2 className="w-4 h-4 mx-auto" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex-1 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 mx-auto" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Customer Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 w-full max-w-2xl"
            >
              <h2 className="text-2xl font-serif font-bold text-varanasi-maroon mb-6">Add New Customer</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Phone Number</label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Enter phone number"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Status</label>
                  <select className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="VIP">VIP</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-varanasi-brown font-semibold mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Enter location (City, State)"
                  />
                </div>
              </div>
              
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-varanasi-gold/20 text-varanasi-brown rounded-lg hover:bg-varanasi-cream/20"
                >
                  Cancel
                </button>
                <button className="flex-1 py-3 bg-varanasi-gold text-varanasi-maroon font-semibold rounded-lg hover:shadow-lg">
                  Add Customer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}