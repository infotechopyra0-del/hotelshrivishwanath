'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Truck, Clock, Shield, AlertCircle } from 'lucide-react'
import PageTransition from '@/components/PageTransition'

export default function ShippingPolicy() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-varanasi-cream to-white pt-24 pb-12">
        <div className="container-custom">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link href="/" className="flex items-center gap-2 text-varanasi-gold hover:text-varanasi-gold-dark transition-colors w-fit">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back to Home</span>
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-varanasi-gold/20 rounded-full">
                <Truck className="w-8 h-8 text-varanasi-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-varanasi-maroon mb-4">
              Shipping Policy
            </h1>
            <p className="text-varanasi-brown text-lg max-w-2xl mx-auto">
              Information about our shipping and delivery services for hotel amenities and packages
            </p>
          </motion.div>

          {/* Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="w-6 h-6 text-varanasi-gold" />
                  <h2 className="text-2xl font-bold text-varanasi-maroon">Shipping Information</h2>
                </div>
                <p className="text-varanasi-brown leading-relaxed mb-4">
                  Hotel Shri Vishwanath offers shipping services for specific amenities and souvenir packages to our guests. 
                  Please note that our primary service is hospitality and accommodation in Varanasi.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-varanasi-gold" />
                  <h2 className="text-2xl font-bold text-varanasi-maroon">Delivery Timeline</h2>
                </div>
                <div className="bg-varanasi-cream/50 rounded-lg p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-varanasi-maroon mb-2">Local Delivery (Varanasi)</h3>
                      <p className="text-varanasi-brown text-sm">Same day or next day delivery for local orders</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-varanasi-maroon mb-2">Domestic Shipping (India)</h3>
                      <p className="text-varanasi-brown text-sm">3-7 business days via courier services</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-varanasi-maroon mb-2">Express Delivery</h3>
                      <p className="text-varanasi-brown text-sm">1-2 business days (available for select items)</p>
                    </div>
                    <div>
                      <h3 className="font-semibold text-varanasi-maroon mb-2">International Shipping</h3>
                      <p className="text-varanasi-brown text-sm">7-21 business days (limited items only)</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-varanasi-maroon mb-4">Shippable Items</h2>
                <ul className="space-y-3 text-varanasi-brown">
                  <li className="flex items-start gap-3">
                    <span className="text-varanasi-gold">•</span>
                    <span>Hotel branded amenities and toiletries</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-varanasi-gold">•</span>
                    <span>Varanasi silk products and souvenirs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-varanasi-gold">•</span>
                    <span>Local handicrafts and spiritual items</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-varanasi-gold">•</span>
                    <span>Gift packages and welcome kits</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-varanasi-gold">•</span>
                    <span>Traditional sweets and packaged food items</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-varanasi-maroon mb-4">Shipping Charges</h2>
                <div className="bg-varanasi-cream/50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between border-b border-varanasi-gold/20 pb-2">
                      <span className="text-varanasi-brown">Local Delivery (Varanasi)</span>
                      <span className="font-semibold text-varanasi-maroon">₹50 - ₹100</span>
                    </div>
                    <div className="flex justify-between border-b border-varanasi-gold/20 pb-2">
                      <span className="text-varanasi-brown">Domestic Shipping (India)</span>
                      <span className="font-semibold text-varanasi-maroon">₹150 - ₹500</span>
                    </div>
                    <div className="flex justify-between border-b border-varanasi-gold/20 pb-2">
                      <span className="text-varanasi-brown">Express Delivery</span>
                      <span className="font-semibold text-varanasi-maroon">₹300 - ₹800</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-varanasi-brown">International Shipping</span>
                      <span className="font-semibold text-varanasi-maroon">₹1000 - ₹3000</span>
                    </div>
                  </div>
                  <p className="text-xs text-varanasi-brown/70 mt-4">
                    *Shipping charges vary based on weight, dimensions, and destination
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-varanasi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-varanasi-maroon mb-2">Important Notes</h2>
                    <ul className="space-y-2 text-varanasi-brown text-sm">
                      <li>• Free shipping on orders above ₹2000 within India</li>
                      <li>• Delivery times may vary during festivals and peak seasons</li>
                      <li>• International shipping is subject to customs regulations</li>
                      <li>• Fragile items are packaged with extra care</li>
                      <li>• Tracking information will be provided via email/SMS</li>
                      <li>• For bulk orders, special shipping rates may apply</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="bg-varanasi-gold/10 border-2 border-varanasi-gold/20 rounded-lg p-6">
                  <h3 className="font-bold text-varanasi-maroon mb-3">Contact for Shipping Inquiries</h3>
                  <div className="space-y-2 text-varanasi-brown">
                    <p><strong>Phone:</strong> +91 6390057777</p>
                    <p><strong>Email:</strong> hotelshrivishwanath@gmail.com</p>
                    <p><strong>Address:</strong> D 53/88 H, Luxa Road, Varanasi, UP 221010</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Last Updated */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-varanasi-brown/60">
              Last updated: November 2025
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}