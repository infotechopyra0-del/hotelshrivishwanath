'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Filter, Percent, Copy, Calendar, Tag } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function CouponsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const coupons = [
    {
      id: 1,
      code: 'WELCOME25',
      name: 'Welcome Offer',
      description: 'New customer welcome discount',
      type: 'Percentage',
      value: 25,
      minAmount: 2000,
      maxDiscount: 1000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 100,
      usedCount: 45,
      status: 'Active'
    },
    {
      id: 2,
      code: 'FESTIVE50',
      name: 'Festival Special',
      description: 'Special discount for festival season',
      type: 'Fixed',
      value: 500,
      minAmount: 3000,
      maxDiscount: 500,
      startDate: '2024-11-01',
      endDate: '2024-11-30',
      usageLimit: 50,
      usedCount: 12,
      status: 'Active'
    },
    {
      id: 3,
      code: 'EARLY20',
      name: 'Early Bird Discount',
      description: 'Book 30 days in advance',
      type: 'Percentage',
      value: 20,
      minAmount: 2500,
      maxDiscount: 750,
      startDate: '2024-01-15',
      endDate: '2024-06-15',
      usageLimit: 75,
      usedCount: 75,
      status: 'Expired'
    },
    {
      id: 4,
      code: 'WEEKEND15',
      name: 'Weekend Special',
      description: 'Weekend stay discount',
      type: 'Percentage',
      value: 15,
      minAmount: 1500,
      maxDiscount: 500,
      startDate: '2024-10-01',
      endDate: '2024-12-31',
      usageLimit: 200,
      usedCount: 89,
      status: 'Active'
    },
    {
      id: 5,
      code: 'VIP1000',
      name: 'VIP Member Discount',
      description: 'Exclusive discount for VIP members',
      type: 'Fixed',
      value: 1000,
      minAmount: 5000,
      maxDiscount: 1000,
      startDate: '2024-01-01',
      endDate: '2024-12-31',
      usageLimit: 20,
      usedCount: 8,
      status: 'Active'
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
      case 'Expired': return 'bg-red-100 text-red-800'
      case 'Inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
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
            <h1 className="text-3xl font-serif font-bold text-varanasi-maroon mb-2">Coupons & Discounts</h1>
            <p className="text-varanasi-brown">Manage promotional codes and discount offers</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-varanasi-gold text-varanasi-maroon rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Create Coupon
          </motion.button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-varanasi-maroon">{coupons.length}</h3>
                <p className="text-varanasi-brown text-sm">Total Coupons</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Tag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-green-600">
                  {coupons.filter(c => c.status === 'Active').length}
                </h3>
                <p className="text-varanasi-brown text-sm">Active Coupons</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Percent className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-yellow-600">229</h3>
                <p className="text-varanasi-brown text-sm">Total Redemptions</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Calendar className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-varanasi-gold">₹45,670</h3>
                <p className="text-varanasi-brown text-sm">Total Savings</p>
              </div>
              <div className="p-3 bg-varanasi-gold/20 rounded-lg">
                <Percent className="w-6 h-6 text-varanasi-gold" />
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
                placeholder="Search coupons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
              />
            </div>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">All Types</option>
              <option value="Percentage">Percentage</option>
              <option value="Fixed">Fixed Amount</option>
            </select>
            <select className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </motion.div>

        {/* Coupons Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {coupons.map((coupon) => (
            <motion.div
              key={coupon.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 overflow-hidden"
            >
              {/* Coupon Header */}
              <div className="bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <Percent className="w-4 h-4 text-varanasi-maroon" />
                    </div>
                    <span className="text-varanasi-maroon font-bold text-lg">{coupon.code}</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    onClick={() => copyToClipboard(coupon.code)}
                    className="p-2 bg-white/20 rounded-lg text-varanasi-maroon hover:bg-white/30"
                  >
                    <Copy className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Coupon Content */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-varanasi-maroon mb-1">{coupon.name}</h3>
                    <p className="text-sm text-varanasi-brown">{coupon.description}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(coupon.status)}`}>
                    {coupon.status}
                  </span>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-varanasi-brown text-sm">Discount:</span>
                    <span className="font-semibold text-varanasi-maroon">
                      {coupon.type === 'Percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-varanasi-brown text-sm">Min Amount:</span>
                    <span className="font-semibold text-varanasi-maroon">₹{coupon.minAmount}</span>
                  </div>
                  
                  {coupon.type === 'Percentage' && (
                    <div className="flex justify-between items-center">
                      <span className="text-varanasi-brown text-sm">Max Discount:</span>
                      <span className="font-semibold text-varanasi-maroon">₹{coupon.maxDiscount}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center">
                    <span className="text-varanasi-brown text-sm">Usage:</span>
                    <span className="font-semibold text-varanasi-maroon">
                      {coupon.usedCount}/{coupon.usageLimit}
                    </span>
                  </div>
                </div>

                {/* Usage Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-varanasi-brown mb-1">
                    <span>Usage Progress</span>
                    <span>{Math.round((coupon.usedCount / coupon.usageLimit) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-varanasi-gold h-2 rounded-full transition-all"
                      style={{ width: `${(coupon.usedCount / coupon.usageLimit) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-sm text-varanasi-brown">
                    Valid: {coupon.startDate} to {coupon.endDate}
                  </div>
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
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Coupon Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-serif font-bold text-varanasi-maroon mb-6">Create New Coupon</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Coupon Code</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="e.g., WELCOME25"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Coupon Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="e.g., Welcome Offer"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-varanasi-brown font-semibold mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Coupon description..."
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Discount Type</label>
                  <select className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
                    <option value="Percentage">Percentage</option>
                    <option value="Fixed">Fixed Amount</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Discount Value</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="25 or 500"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Minimum Amount (₹)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="2000"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Usage Limit</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="100"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Start Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">End Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
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
                  Create Coupon
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}