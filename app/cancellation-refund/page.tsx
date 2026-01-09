'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, RefreshCw, Calendar, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react'
import PageTransition from '@/components/PageTransition'

export default function CancellationRefundPolicy() {
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
                <RefreshCw className="w-8 h-8 text-varanasi-gold" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-varanasi-maroon mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="text-varanasi-brown text-lg max-w-2xl mx-auto">
              Our fair and transparent cancellation and refund policies for hotel bookings
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
              
              {/* Cancellation Policy */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-varanasi-gold" />
                  <h2 className="text-2xl font-bold text-varanasi-maroon">Cancellation Policy</h2>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <h3 className="font-semibold text-green-800">Free Cancellation</h3>
                    </div>
                    <p className="text-sm text-green-700 mb-2">
                      <strong>48+ hours before check-in</strong>
                    </p>
                    <p className="text-xs text-green-600">
                      100% refund of booking amount
                    </p>
                  </div>

                  <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <h3 className="font-semibold text-yellow-800">Partial Refund</h3>
                    </div>
                    <p className="text-sm text-yellow-700 mb-2">
                      <strong>24-48 hours before check-in</strong>
                    </p>
                    <p className="text-xs text-yellow-600">
                      50% refund of booking amount
                    </p>
                  </div>

                  <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-800">No Refund</h3>
                    </div>
                    <p className="text-sm text-red-700 mb-2">
                      <strong>Less than 24 hours or No-show</strong>
                    </p>
                    <p className="text-xs text-red-600">
                      No refund applicable
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Refund Process */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-6 h-6 text-varanasi-gold" />
                  <h2 className="text-2xl font-bold text-varanasi-maroon">Refund Process</h2>
                </div>
                
                <div className="bg-varanasi-cream/50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-varanasi-maroon mb-3">Refund Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-varanasi-brown">Credit/Debit Card</span>
                      <span className="font-semibold text-varanasi-maroon">5-7 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-varanasi-brown">Net Banking</span>
                      <span className="font-semibold text-varanasi-maroon">3-5 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-varanasi-brown">UPI/Digital Wallets</span>
                      <span className="font-semibold text-varanasi-maroon">1-3 business days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-varanasi-brown">Cash Payment</span>
                      <span className="font-semibold text-varanasi-maroon">Immediate at hotel</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-varanasi-maroon">How to Request a Refund:</h3>
                  <ol className="space-y-2 text-varanasi-brown">
                    <li className="flex items-start gap-3">
                      <span className="bg-varanasi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">1</span>
                      <span>Contact our front desk or customer service team</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-varanasi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">2</span>
                      <span>Provide your booking ID and cancellation reason</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-varanasi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">3</span>
                      <span>Fill out the cancellation form (if required)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-varanasi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">4</span>
                      <span>Receive confirmation email with refund details</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="bg-varanasi-gold text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">5</span>
                      <span>Refund will be processed to original payment method</span>
                    </li>
                  </ol>
                </div>
              </motion.div>

              {/* Special Circumstances */}
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-varanasi-maroon mb-4">Special Circumstances</h2>
                
                <div className="space-y-4">
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                    <h3 className="font-semibold text-blue-800 mb-2">Medical Emergency</h3>
                    <p className="text-blue-700 text-sm">
                      Full refund available with valid medical certificate, regardless of cancellation time.
                    </p>
                  </div>

                  <div className="bg-purple-50 border-l-4 border-purple-400 p-4">
                    <h3 className="font-semibold text-purple-800 mb-2">Natural Disasters/Force Majeure</h3>
                    <p className="text-purple-700 text-sm">
                      100% refund or free rescheduling for cancellations due to natural disasters, government restrictions, or other force majeure events.
                    </p>
                  </div>

                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4">
                    <h3 className="font-semibold text-orange-800 mb-2">Travel Restrictions</h3>
                    <p className="text-orange-700 text-sm">
                      Full refund available for cancellations due to government-imposed travel restrictions or lockdowns.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Group Bookings */}
              <motion.div variants={itemVariants} className="mb-8">
                <h2 className="text-2xl font-bold text-varanasi-maroon mb-4">Group Bookings (5+ Rooms)</h2>
                <div className="bg-varanasi-cream/50 rounded-lg p-6">
                  <ul className="space-y-2 text-varanasi-brown">
                    <li>• 15 days advance cancellation: 100% refund</li>
                    <li>• 7-14 days advance cancellation: 75% refund</li>
                    <li>• 3-6 days advance cancellation: 50% refund</li>
                    <li>• Less than 3 days: 25% refund</li>
                    <li>• Custom terms may apply for large groups (20+ rooms)</li>
                  </ul>
                </div>
              </motion.div>

              {/* Important Notes */}
              <motion.div variants={itemVariants} className="mb-8">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-varanasi-gold flex-shrink-0 mt-1" />
                  <div>
                    <h2 className="text-2xl font-bold text-varanasi-maroon mb-2">Important Notes</h2>
                    <ul className="space-y-2 text-varanasi-brown text-sm">
                      <li>• Refunds are processed only to the original payment method</li>
                      <li>• Processing fees (if any) are non-refundable</li>
                      <li>• Bank charges for refund transactions are borne by the customer</li>
                      <li>• Partial stays are not eligible for refunds</li>
                      <li>• Festival/peak season bookings may have different cancellation terms</li>
                      <li>• Early check-out does not qualify for refund</li>
                      <li>• All cancellations must be requested via official channels</li>
                    </ul>
                  </div>
                </div>
              </motion.div>

              {/* Contact Information */}
              <motion.div variants={itemVariants}>
                <div className="bg-varanasi-gold/10 border-2 border-varanasi-gold/20 rounded-lg p-6">
                  <h3 className="font-bold text-varanasi-maroon mb-3">For Cancellations & Refunds</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-varanasi-brown">
                    <div>
                      <p><strong>Phone:</strong> +91 6390057777</p>
                      <p><strong>Email:</strong> hotelshrivishwanath@gmail.com</p>
                    </div>
                    <div>
                      <p><strong>Hours:</strong> 24/7 Customer Support</p>
                      <p><strong>Response Time:</strong> Within 24 hours</p>
                    </div>
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