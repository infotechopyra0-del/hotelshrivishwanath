'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Search, Filter, Grid3X3 } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const categories = [
    { id: 1, name: 'Standard Rooms', description: 'Basic comfortable rooms', count: 10, status: 'Active' },
    { id: 2, name: 'Deluxe Rooms', description: 'Enhanced comfort with premium amenities', count: 8, status: 'Active' },
    { id: 3, name: 'Premium Suites', description: 'Luxury suites with exceptional service', count: 5, status: 'Active' },
    { id: 4, name: 'Family Rooms', description: 'Spacious rooms for families', count: 6, status: 'Active' },
    { id: 5, name: 'Business Rooms', description: 'Work-friendly rooms for business travelers', count: 4, status: 'Inactive' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
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
            <h1 className="text-3xl font-serif font-bold text-varanasi-maroon mb-2">Room Categories</h1>
            <p className="text-varanasi-brown">Manage your hotel room categories</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-varanasi-gold text-varanasi-maroon rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Category
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-varanasi-brown/50" />
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-varanasi-gold/20 rounded-lg hover:bg-varanasi-cream/20">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-varanasi-gold/10 rounded-lg">
                  <Grid3X3 className="w-6 h-6 text-varanasi-gold" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  category.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {category.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-varanasi-maroon mb-2">{category.name}</h3>
              <p className="text-varanasi-brown text-sm mb-4">{category.description}</p>
              
              <div className="flex items-center justify-between">
                <span className="text-varanasi-gold font-semibold">{category.count} rooms</span>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Add Category Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 w-full max-w-md mx-4"
            >
              <h2 className="text-2xl font-serif font-bold text-varanasi-maroon mb-6">Add New Category</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Category Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Enter category name"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Enter description"
                  />
                </div>
                
                <div>
                  <label className="block text-varanasi-brown font-semibold mb-2">Status</label>
                  <select className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold">
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
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
                  Add Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}