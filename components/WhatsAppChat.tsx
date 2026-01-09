'use client'

import { useEffect, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)

  // Hotel's WhatsApp number (from contact info)
  const whatsappNumber = '916390057777'
  const message = `Hello! I'm interested in booking a room at Hotel Shri Vishwanath. Could you please help me with availability and pricing?`

  const openWhatsApp = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      {/* WhatsApp Float Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 2, duration: 0.5, type: 'spring' }}
      >
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              onClick={() => setIsOpen(true)}
              className="group relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <MessageCircle className="w-7 h-7 text-white" />
              
              {/* Pulse Animation */}
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-75"></div>
              
              {/* Tooltip */}
              <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                Chat with us on WhatsApp
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
              </div>
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ scale: 0, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0, opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="bg-green-500 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Hotel Shri Vishwanath</h3>
                  <p className="text-xs opacity-90">Available 24/7</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Content */}
            <div className="p-6 bg-gray-50">
              <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600 text-sm">👋</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-800 mb-2">
                      Hi there! Welcome to Hotel Shri Vishwanath. How can we help you today?
                    </p>
                    <p className="text-xs text-gray-500">
                      • Room bookings & availability
                    </p>
                    <p className="text-xs text-gray-500">
                      • Pricing & packages
                    </p>
                    <p className="text-xs text-gray-500">
                      • Local attractions & services
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <motion.button
                  onClick={openWhatsApp}
                  className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <MessageCircle className="w-4 h-4" />
                  Start WhatsApp Chat
                </motion.button>
                
                <motion.a
                  href="tel:+916390057777"
                  className="w-full bg-varanasi-gold hover:bg-varanasi-gold-dark text-varanasi-maroon py-2 px-4 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  📞 Call Directly
                </motion.a>
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                We typically reply within a few minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
