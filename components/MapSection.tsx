'use client'

import { motion } from 'framer-motion'
import { MapPin, Navigation, Phone, Mail } from 'lucide-react'

export const MapSection = () => {
  const location = {
    name: "Hotel Shri Vishwanath",
    address: "Hotel Shri Vishwanath, Varanasi, Uttar Pradesh 221005",
    coordinates: "25.308503,82.9979617", // Actual Hotel Shri Vishwanath coordinates
    phone: "+91 6390057777",
    email: "hotelshrivishwanath@gmail.com"
  }

  return (
    <section className="py-16 md:py-24 bg-varanasi-cream">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="text-varanasi-gold text-2xl block mb-2">◆ ◆ ◆</span>
          <h2 className="font-serif text-4xl font-bold text-varanasi-maroon mb-4">
            Visit Us
          </h2>
          <p className="text-varanasi-brown">Find our exact location in Varanasi</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Location Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border-2 border-varanasi-gold/20"
          >
            <h3 className="text-2xl font-bold text-varanasi-maroon mb-6">Location Details</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-varanasi-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-varanasi-maroon">Address</h4>
                  <p className="text-varanasi-brown text-sm leading-relaxed">{location.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-varanasi-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-varanasi-maroon">Phone</h4>
                  <a href={`tel:${location.phone}`} className="text-varanasi-brown text-sm hover:text-varanasi-gold transition-colors">
                    {location.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-varanasi-gold flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-varanasi-maroon">Email</h4>
                  <a href={`mailto:${location.email}`} className="text-varanasi-brown text-sm hover:text-varanasi-gold transition-colors">
                    {location.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <motion.a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-lg font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 transition-all"
              >
                <Navigation className="w-4 h-4" />
                Get Directions
              </motion.a>

              <motion.a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 w-full py-2 border-2 border-varanasi-gold text-varanasi-gold rounded-lg font-semibold hover:bg-varanasi-gold/10 transition-all"
              >
                <MapPin className="w-4 h-4" />
                View on Google Maps
              </motion.a>
            </div>
          </motion.div>

          {/* Google Maps Embed */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-2 h-96 rounded-2xl overflow-hidden shadow-lg border-2 border-varanasi-gold/20"
          >
            <iframe
              width="100%"
              height="100%"
              frameBorder="0"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d435.7676951099186!2d82.99807149999999!3d25.308465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398e2fe7e5d84313%3A0x7d796623861cb049!2sHotel%20Shri%20Vishwanath!5e1!3m2!1sen!2sin!4v1699234567890!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Hotel Shri Vishwanath Location - Varanasi"
            />
          </motion.div>
        </div>

        {/* Nearby Landmarks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 bg-white rounded-2xl p-6 shadow-lg border-2 border-varanasi-gold/20"
        >
          <h3 className="text-xl font-bold text-varanasi-maroon mb-4">Nearby Landmarks</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-varanasi-cream/50 rounded-lg">
              <h4 className="font-semibold text-varanasi-maroon text-sm">BHU Main Gate</h4>
              <p className="text-varanasi-brown text-xs">2 km</p>
            </div>
            <div className="text-center p-3 bg-varanasi-cream/50 rounded-lg">
              <h4 className="font-semibold text-varanasi-maroon text-sm">Kashi Vishwanath Temple</h4>
              <p className="text-varanasi-brown text-xs">8 km</p>
            </div>
            <div className="text-center p-3 bg-varanasi-cream/50 rounded-lg">
              <h4 className="font-semibold text-varanasi-maroon text-sm">Dasaswamedh Ghat</h4>
              <p className="text-varanasi-brown text-xs">9 km</p>
            </div>
            <div className="text-center p-3 bg-varanasi-cream/50 rounded-lg">
              <h4 className="font-semibold text-varanasi-maroon text-sm">Varanasi Airport</h4>
              <p className="text-varanasi-brown text-xs">25 km</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default MapSection
