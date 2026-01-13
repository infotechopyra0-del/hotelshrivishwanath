'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft, Search, MapPin } from 'lucide-react'

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  }

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [-2, 2, -2]
    }
  }

  const quickLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/about', label: 'About Us', icon: Search },
    { href: '/rooms', label: 'Our Rooms', icon: MapPin },
    { href: '/contact', label: 'Contact', icon: MapPin },
  ]

  return (
    <div className="h-screen w-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Images Rotation for 404 page */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          backgroundImage: "linear-gradient(135deg, rgba(59, 31, 13, 0.8) 0%, rgba(107, 26, 26, 0.6) 100%), url('/images/VaranasiTemple.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />
      {/* Decorative elements */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-20 right-20 w-32 h-32 bg-varanasi-gold rounded-full blur-3xl opacity-25"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        className="absolute bottom-20 left-20 w-40 h-40 bg-varanasi-gold rounded-full blur-3xl opacity-20"
      />

      <div className="container-custom relative z-10 px-4 py-8 max-h-full overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center text-varanasi-cream max-w-6xl mx-auto"
        >
          {/* Spiritual ornament */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.div
              variants={floatingVariants}
              animate="animate"
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="inline-block"
            >
              <span className="text-6xl text-varanasi-gold opacity-80">◆</span>
            </motion.div>
          </motion.div>

          {/* 404 Number */}
          <motion.div variants={itemVariants} className="mb-4 md:mb-8">
            <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-varanasi-gold glow-gold mb-2 md:mb-4">
              404
            </h1>
            <div className="w-16 md:w-24 h-1 bg-gradient-to-r from-transparent via-varanasi-gold to-transparent mx-auto"></div>
          </motion.div>

          {/* Message */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-12">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-varanasi-cream mb-2 md:mb-4">
              Path Not Found in Sacred Varanasi
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-varanasi-cream/90 max-w-2xl mx-auto leading-relaxed px-4">
              Like a lost pilgrim in the ancient lanes of Kashi, this page seems to have wandered away. 
              Let us guide you back to the sacred paths of Hotel Shri Vishwanath.
            </p>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-12">
            <h3 className="text-varanasi-gold font-semibold mb-4 md:mb-6 text-base md:text-lg">
              Find Your Way Back
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto px-4">
              {quickLinks.map((link, index) => {
                const Icon = link.icon
                return (
                  <Link key={index} href={link.href}>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-3 md:p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-varanasi-gold/30 hover:border-varanasi-gold/70 hover:bg-white/20 transition-all cursor-pointer"
                    >
                      <Icon className="w-5 h-5 md:w-6 md:h-6 text-varanasi-gold mx-auto mb-1 md:mb-2" />
                      <p className="text-xs md:text-sm font-medium text-varanasi-cream">{link.label}</p>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center px-4">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full font-bold text-base md:text-lg shadow-xl hover:shadow-2xl glow-box-hover inline-flex items-center gap-2 md:gap-3"
              >
                <Home className="w-4 h-4 md:w-5 md:h-5" />
                Return Home
              </motion.div>
            </Link>
            <motion.button
              onClick={() => window.history.back()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 md:px-8 py-3 md:py-4 border-2 border-varanasi-gold text-varanasi-gold rounded-full font-bold text-base md:text-lg hover:bg-varanasi-gold/20 transition-colors inline-flex items-center gap-2 md:gap-3 backdrop-blur-sm"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
              Go Back
            </motion.button>
          </motion.div>

          {/* Spiritual Quote */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 md:mt-16 pt-6 md:pt-8 border-t border-varanasi-gold/20"
          >
            <p className="text-varanasi-cream/70 italic text-base md:text-lg font-light px-4">
              "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
            </p>
            <p className="text-varanasi-gold/80 text-xs md:text-sm mt-2">
              May all beings be happy, may all beings be healthy
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity }
        }}
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-varanasi-gold rounded-full opacity-60"
      />
      <motion.div
        animate={{ 
          rotate: -360,
          scale: [1, 0.8, 1]
        }}
        transition={{ 
          rotate: { duration: 25, repeat: Infinity, ease: "linear" },
          scale: { duration: 4, repeat: Infinity, delay: 1 }
        }}
        className="absolute top-3/4 right-1/3 w-1 h-1 bg-varanasi-gold rounded-full opacity-40"
      />
      <motion.div
        animate={{ 
          y: [0, -20, 0],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          delay: 2
        }}
        className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-varanasi-gold rounded-full"
      />
    </div>
  )
}