'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Edit2, Trash2, Search, Upload, X, Bed, Users, Wifi, Coffee, Utensils } from 'lucide-react'
import AdminLayout from '@/components/admin/AdminLayout'
import { fileToBase64, validateImageFile } from '@/lib/cloudinary'

interface Room {
  _id: string
  name: string
  description: string
  category: 'Standard' | 'Deluxe' | 'Premium Suite'
  price: number
  maxOccupancy: number
  size: number
  images: {
    url: string
    publicId: string
    caption?: string
  }[]
  amenities: string[]
  status: 'Available' | 'Occupied' | 'Maintenance' | 'Out of Service'
  roomNumber: string
  floor: number
  bedType: 'Single' | 'Double' | 'Queen' | 'King' | 'Twin'
  hasBalcony: boolean
  hasKitchen: boolean
  hasAC: boolean
  hasWiFi: boolean
  rating: number
  totalRatings: number
  createdAt: string
  updatedAt: string
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    maxOccupancy: '',
    size: '',
    roomNumber: '',
    floor: '',
    bedType: '',
    hasBalcony: false,
    hasKitchen: false,
    hasAC: true,
    hasWiFi: true,
    amenities: [] as string[],
    status: 'Available'
  })
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])

  // Fetch rooms
  const fetchRooms = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/rooms')
      const data = await response.json()
      
      if (data.success) {
        setRooms(data.data.rooms)
      } else {
        console.error('Failed to fetch rooms:', data.error)
      }
    } catch (error) {
      console.error('Error fetching rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRooms()
  }, [])

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    // Validate files
    const validFiles: File[] = []
    const previews: string[] = []
    
    for (const file of files) {
      const validation = validateImageFile(file)
      if (validation.isValid) {
        validFiles.push(file)
        previews.push(URL.createObjectURL(file))
      } else {
        alert(`Invalid file ${file.name}: ${validation.error}`)
      }
    }
    
    setSelectedImages(validFiles)
    setImagePreviews(previews)
  }

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedImages.length === 0) {
      alert('Please select at least one image')
      return
    }

    setUploading(true)

    try {
      // Convert images to base64
      const imagePromises = selectedImages.map(async (file) => ({
        base64: await fileToBase64(file),
        caption: file.name
      }))
      
      const images = await Promise.all(imagePromises)

      const roomData = {
        ...formData,
        price: parseFloat(formData.price),
        maxOccupancy: parseInt(formData.maxOccupancy),
        size: parseFloat(formData.size),
        floor: parseInt(formData.floor),
        images
      }

      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roomData)
      })

      const data = await response.json()

      if (data.success) {
        alert('Room created successfully!')
        setShowAddModal(false)
        resetForm()
        fetchRooms()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error creating room:', error)
      alert('Failed to create room')
    } finally {
      setUploading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      price: '',
      maxOccupancy: '',
      size: '',
      roomNumber: '',
      floor: '',
      bedType: '',
      hasBalcony: false,
      hasKitchen: false,
      hasAC: true,
      hasWiFi: true,
      amenities: [],
      status: 'Available'
    })
    setSelectedImages([])
    setImagePreviews([])
  }

  // Delete room
  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return

    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        alert('Room deleted successfully!')
        fetchRooms()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      console.error('Error deleting room:', error)
      alert('Failed to delete room')
    }
  }

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || room.category === categoryFilter
    const matchesStatus = !statusFilter || room.status === statusFilter
    
    return matchesSearch && matchesCategory && matchesStatus
  })

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
      case 'Available': return 'bg-green-100 text-green-800'
      case 'Occupied': return 'bg-red-100 text-red-800'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800'
      case 'Out of Service': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'free wifi':
      case 'wifi':
        return <Wifi className="w-4 h-4" />
      case 'kitchenette':
      case 'kitchen':
        return <Utensils className="w-4 h-4" />
      case 'balcony':
        return <Coffee className="w-4 h-4" />
      default:
        return <Bed className="w-4 h-4" />
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
            <h1 className="text-3xl font-serif font-bold text-varanasi-maroon mb-2">Rooms Management</h1>
            <p className="text-varanasi-brown">Manage all hotel rooms and their availability</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-varanasi-gold text-varanasi-maroon rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Room
          </motion.button>
        </motion.div>

        {/* Search and Filter */}
        <motion.div variants={itemVariants} className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-varanasi-brown/50" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
              />
            </div>
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
            >
              <option value="">All Categories</option>
              <option value="Standard">Standard</option>
              <option value="Deluxe">Deluxe</option>
              <option value="Premium Suite">Premium Suite</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
            >
              <option value="">All Status</option>
              <option value="Available">Available</option>
              <option value="Occupied">Occupied</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-varanasi-gold"></div>
          </div>
        )}

        {/* Rooms Grid */}
        {!loading && (
          <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <motion.div
                key={room._id}
                whileHover={{ scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg border border-varanasi-gold/20 overflow-hidden"
              >
                <div className="relative h-48">
                  <Image
                    src={room.images[0]?.url || '/images/placeholder-room.jpg'}
                    alt={room.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(room.status)}`}>
                      {room.status}
                    </span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-varanasi-maroon">
                      Room {room.roomNumber}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-varanasi-maroon">{room.name}</h3>
                    <span className="text-sm text-varanasi-brown bg-varanasi-cream/50 px-2 py-1 rounded">
                      {room.category}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <span className="text-2xl font-bold text-varanasi-gold">₹{room.price}</span>
                    <span className="text-sm text-varanasi-brown">/night</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm text-varanasi-brown">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {room.maxOccupancy}
                    </div>
                    <div className="flex items-center gap-1">
                      <Bed className="w-4 h-4" />
                      {room.bedType}
                    </div>
                    <div>{room.size} sq ft</div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-varanasi-brown mb-2">Amenities:</p>
                    <div className="flex flex-wrap gap-1">
                      {room.amenities.slice(0, 4).map((amenity) => (
                        <span
                          key={amenity}
                          className="text-xs bg-varanasi-gold/20 text-varanasi-maroon px-2 py-1 rounded-full flex items-center gap-1"
                        >
                          {getAmenityIcon(amenity)}
                          {amenity}
                        </span>
                      ))}
                      {room.amenities.length > 4 && (
                        <span className="text-xs bg-varanasi-cream text-varanasi-brown px-2 py-1 rounded-full">
                          +{room.amenities.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-green-600 hover:bg-green-100 rounded-lg transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      onClick={() => handleDelete(room._id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredRooms.length === 0 && (
          <div className="text-center py-20">
            <Bed className="w-16 h-16 text-varanasi-gold mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-varanasi-maroon mb-2">No rooms found</h3>
            <p className="text-varanasi-brown">No rooms match your current filters.</p>
          </div>
        )}

        {/* Add Room Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-xl p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-varanasi-maroon">Add New Room</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false)
                    resetForm()
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Room Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                      placeholder="Enter room name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Room Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.roomNumber}
                      onChange={(e) => setFormData({...formData, roomNumber: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                      placeholder="e.g., 101, A-205"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Category *</label>
                    <select 
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    >
                      <option value="">Select Category</option>
                      <option value="Standard">Standard</option>
                      <option value="Deluxe">Deluxe</option>
                      <option value="Premium Suite">Premium Suite</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Price per Night (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                      placeholder="Enter price"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Max Occupancy *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="10"
                      value={formData.maxOccupancy}
                      onChange={(e) => setFormData({...formData, maxOccupancy: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                      placeholder="Number of guests"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Room Size (sq ft) *</label>
                    <input
                      type="number"
                      required
                      min="50"
                      step="0.01"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                      placeholder="Room size"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Floor *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.floor}
                      onChange={(e) => setFormData({...formData, floor: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                      placeholder="Floor number"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-varanasi-brown font-semibold mb-2">Bed Type *</label>
                    <select
                      required
                      value={formData.bedType}
                      onChange={(e) => setFormData({...formData, bedType: e.target.value})}
                      className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    >
                      <option value="">Select Bed Type</option>
                      <option value="Single">Single</option>
                      <option value="Double">Double</option>
                      <option value="Queen">Queen</option>
                      <option value="King">King</option>
                      <option value="Twin">Twin</option>
                    </select>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-varanasi-brown font-semibold mb-2">Description *</label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                    placeholder="Enter room description"
                  />
                </div>

                {/* Room Features */}
                <div className="mb-6">
                  <label className="block text-varanasi-brown font-semibold mb-3">Room Features</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasAC}
                        onChange={(e) => setFormData({...formData, hasAC: e.target.checked})}
                        className="w-4 h-4 text-varanasi-gold"
                      />
                      <span>Air Conditioning</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasWiFi}
                        onChange={(e) => setFormData({...formData, hasWiFi: e.target.checked})}
                        className="w-4 h-4 text-varanasi-gold"
                      />
                      <span>Free WiFi</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasBalcony}
                        onChange={(e) => setFormData({...formData, hasBalcony: e.target.checked})}
                        className="w-4 h-4 text-varanasi-gold"
                      />
                      <span>Balcony</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hasKitchen}
                        onChange={(e) => setFormData({...formData, hasKitchen: e.target.checked})}
                        className="w-4 h-4 text-varanasi-gold"
                      />
                      <span>Kitchenette</span>
                    </label>
                  </div>
                </div>

                {/* Images */}
                <div className="mb-6">
                  <label className="block text-varanasi-brown font-semibold mb-2">Room Images *</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="w-full p-3 border border-varanasi-gold/20 rounded-lg focus:outline-none focus:border-varanasi-gold"
                  />
                  {imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={150}
                            height={100}
                            className="rounded-lg object-cover w-full h-24"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false)
                      resetForm()
                    }}
                    className="flex-1 py-3 border border-varanasi-gold/20 text-varanasi-brown rounded-lg hover:bg-varanasi-cream/20"
                    disabled={uploading}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={uploading}
                    className="flex-1 py-3 bg-varanasi-gold text-varanasi-maroon font-semibold rounded-lg hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-varanasi-maroon"></div>
                        Uploading...
                      </>
                    ) : (
                      'Add Room'
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </motion.div>
    </AdminLayout>
  )
}