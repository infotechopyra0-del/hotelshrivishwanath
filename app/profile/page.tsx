'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, User, Mail, Phone, MapPin, Calendar, CreditCard, Save, Loader2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    idType: 'Aadhar',
    idNumber: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      zipCode: ''
    },
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    },
    preferences: {
      roomType: '',
      bedType: '',
      floorPreference: '',
      dietaryRequirements: [],
      specialRequests: ''
    },
    profileImage: '/images/userdefault.jpeg'
  })

  const fileInputRef = useRef<HTMLInputElement>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  const headerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1
    }
  }

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchProfileData()
    }
  }, [status, router])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache'
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setProfileData(result.data)
        } else {
          toast.error('Failed to fetch profile data')
        }
      } else if (response.status === 401) {
        toast.error('Session expired, please login again')
        router.push('/')
      } else {
        toast.error('Failed to fetch profile data')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast.error('An error occurred while fetching profile data')
    }
  }

  const handleImageUpload = async (e:any) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB')
      return
    }

    setUploading(true)

    try {
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result as string
        
        try {
          setProfileData(prev => ({ ...prev, profileImage: imageDataUrl }))
          
          const response = await fetch('/api/profile/update-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageUrl: imageDataUrl })
          })

          if (response.ok) {
            toast.success('Profile image updated successfully!')
            setTimeout(() => {
              fetchProfileData()
            }, 1000)
          } else {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Failed to save image')
          }
        } catch (error) {
          toast.error('Failed to update profile image')
          setProfileData(prev => ({ ...prev, profileImage: '/images/userdefault.jpeg' }))
        }
      }
      
      reader.readAsDataURL(file)
    } catch (error) {
      toast.error('Failed to process image')
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setProfileData({
        ...profileData,
        [parent]: {
          ...(profileData as any)[parent],
          [child]: value
        }
      })
    } else {
      setProfileData({ ...profileData, [field]: value })
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        toast.success('Profile updated successfully!')
      } else {
        toast.error('Failed to update profile')
      }
    } catch (error) {
      toast.error('An error occurred')
      console.error('Update error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    <Navbar />
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 pt-24 pb-12 px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6"
          variants={headerVariants}
        >
          <div className="h-32 bg-gradient-to-r from-amber-600 via-orange-600 to-red-700"></div>
          <div className="relative px-6 pb-6">
            <div className="flex flex-col items-center -mt-16">
              <div className="relative group">
                <motion.div 
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={profileData.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute bottom-0 right-0 bg-amber-600 hover:bg-amber-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {uploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <motion.h1 
                className="mt-4 text-2xl font-bold text-amber-900"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                {profileData.name}
              </motion.h1>
              <motion.p 
                className="text-orange-600 font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                {profileData.email}
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Profile Details */}
        <motion.div 
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          variants={itemVariants}
        >
          <motion.h2 
            className="text-2xl font-bold text-amber-900 mb-6 flex items-center gap-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <User className="w-6 h-6" />
            Personal Information
          </motion.h2>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Full Name</label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Date of Birth</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                <input
                  type="date"
                  value={profileData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Gender</label>
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">ID Type</label>
              <select
                value={profileData.idType}
                onChange={(e) => handleInputChange('idType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              >
                <option value="Aadhar">Aadhar</option>
                <option value="Passport">Passport</option>
                <option value="Driving License">Driving License</option>
                <option value="Voter ID">Voter ID</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amber-900 mb-2">ID Number</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-orange-400" />
                <input
                  type="text"
                  value={profileData.idNumber}
                  onChange={(e) => handleInputChange('idNumber', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </motion.div>

          <motion.h3 
            className="text-xl font-bold text-amber-900 mt-8 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            <MapPin className="w-5 h-5" />
            Address
          </motion.h3>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amber-900 mb-2">Street</label>
              <input
                type="text"
                value={profileData.address.street}
                onChange={(e) => handleInputChange('address.street', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">City</label>
              <input
                type="text"
                value={profileData.address.city}
                onChange={(e) => handleInputChange('address.city', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">State</label>
              <input
                type="text"
                value={profileData.address.state}
                onChange={(e) => handleInputChange('address.state', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Country</label>
              <input
                type="text"
                value={profileData.address.country}
                onChange={(e) => handleInputChange('address.country', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">ZIP Code</label>
              <input
                type="text"
                value={profileData.address.zipCode}
                onChange={(e) => handleInputChange('address.zipCode', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>
          </motion.div>

          <motion.h3 
            className="text-xl font-bold text-amber-900 mt-8 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            Emergency Contact
          </motion.h3>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={itemVariants}
          >
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Name</label>
              <input
                type="text"
                value={profileData.emergencyContact.name}
                onChange={(e) => handleInputChange('emergencyContact.name', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Phone</label>
              <input
                type="tel"
                value={profileData.emergencyContact.phone}
                onChange={(e) => handleInputChange('emergencyContact.phone', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Relation</label>
              <input
                type="text"
                value={profileData.emergencyContact.relation}
                onChange={(e) => handleInputChange('emergencyContact.relation', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>
          </motion.div>

          <motion.h3 
            className="text-xl font-bold text-amber-900 mt-8 mb-4"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            Preferences
          </motion.h3>

          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={itemVariants}
          >
            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Room Type</label>
              <input
                type="text"
                value={profileData.preferences.roomType}
                onChange={(e) => handleInputChange('preferences.roomType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Bed Type</label>
              <input
                type="text"
                value={profileData.preferences.bedType}
                onChange={(e) => handleInputChange('preferences.bedType', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Floor Preference</label>
              <input
                type="text"
                value={profileData.preferences.floorPreference}
                onChange={(e) => handleInputChange('preferences.floorPreference', e.target.value)}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-900 mb-2">Dietary Requirements</label>
              <input
                type="text"
                value={profileData.preferences.dietaryRequirements.join(', ')}
                onChange={(e) => handleInputChange('preferences.dietaryRequirements', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Vegetarian, Vegan, etc."
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amber-900 mb-2">Special Requests</label>
              <textarea
                value={profileData.preferences.specialRequests}
                onChange={(e) => handleInputChange('preferences.specialRequests', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-amber-500 focus:outline-none transition-colors resize-none"
              />
            </div>
          </motion.div>

          <motion.div 
            className="mt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.6 }}
          >
            <motion.button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-600 via-orange-600 to-red-700 hover:from-amber-700 hover:via-orange-700 hover:to-red-800 text-white font-bold py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0, 0, 0, 0.2)" }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Changes
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>

    {/* Footer */}
    <Footer />
    </>
  )
}