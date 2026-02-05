'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react'
import { motion } from 'framer-motion'

const Footer = () => {
  const [currentYear, setCurrentYear] = useState<number | null>(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])
  const [newsletterResult, setNewsletterResult] = useState('')

  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'Rooms', href: '/rooms' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Explore More', href: '/exploremore' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact', href: '/contact' },
  ]

  // policies intentionally removed from footer per request

  const socialLinks = [
    { icon: Facebook, href: 'https://www.facebook.com/share/1BXgCgfzJH/', label: 'Facebook' },
    { icon: Instagram, href: 'https://www.instagram.com/hotelshrivishwanath?igsh=ZmFsMGtoa3ZhaWFl', label: 'Instagram' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.12 } },
  }

  const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }

  // Newsletter submit (Web3Forms)
  const handleNewsletterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setNewsletterResult('Sending...')
    const form = e.currentTarget
    const formData = new FormData(form)
    formData.append('access_key', '6d8c4f3f-ff37-41c8-a731-57d3cf98862e')

    try {
      const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.success) {
        setNewsletterResult('Subscribed — Thank you!')
        form.reset()
      } else {
        setNewsletterResult('Subscription failed. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setNewsletterResult('Network error. Please try again later.')
    }
  }

  return (
    <footer className="bg-varanasi-maroon text-varanasi-cream py-16">
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-10"
        >
          <motion.div variants={itemVariants}>
            <h3 className="font-serif text-2xl font-bold text-varanasi-gold mb-3">Shri Vishwanath</h3>
            <p className="text-sm text-varanasi-cream/85 leading-relaxed mb-4">
              Heritage-inspired hospitality in the heart of Varanasi. Warm rooms, attentive
              service and a welcoming atmosphere for pilgrims and travellers alike.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <a href="https://wa.me/916390057777" aria-label="WhatsApp" className="px-3 py-2 bg-varanasi-gold text-varanasi-maroon rounded-md font-semibold text-sm">WhatsApp</a>
              <a href="tel:+916390057777" aria-label="Phone" className="text-sm text-varanasi-cream/85 hover:text-varanasi-gold transition-colors">+91 63900 57777</a>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-varanasi-gold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-varanasi-cream/85">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-varanasi-gold transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Policies column removed */}

          <motion.div variants={itemVariants}>
            <h4 className="font-semibold text-varanasi-gold mb-3">Stay Updated</h4>
            <p className="text-sm text-varanasi-cream/85 mb-3">Subscribe to our newsletter for offers and updates.</p>

            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input 
                aria-label="email" 
                type="email" 
                name="email" 
                required 
                placeholder="Your email" 
                className="px-3 py-2 rounded-md bg-varanasi-maroon/70 placeholder-varanasi-cream/60 text-varanasi-cream text-sm border border-varanasi-gold/20 focus:outline-none"
                suppressHydrationWarning
              />
              <button 
                type="submit" 
                className="px-4 py-2 bg-varanasi-gold text-varanasi-maroon rounded-md font-semibold text-sm"
                suppressHydrationWarning
              >
                Subscribe
              </button>
            </form>
            {newsletterResult && <p className="text-xs mt-3 text-varanasi-cream/70">{newsletterResult}</p>}

            <div className="mt-6 flex gap-3">
              {socialLinks.map((s) => {
                const Icon = s.icon
                return (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="p-2 bg-varanasi-gold/20 hover:bg-varanasi-gold/40 rounded-full text-varanasi-gold transition-colors">
                    <Icon className="w-4 h-4" />
                  </a>
                )
              })}
            </div>
          </motion.div>
        </motion.div>

        <motion.div variants={itemVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="border-t border-varanasi-gold/20 pt-6 text-sm text-varanasi-cream/70">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p>© {currentYear ? currentYear : ''} Hotel Shri Vishwanath. All rights reserved.</p>
            <p className="text-xs">D 53/88 H, Luxa Road, Varanasi, UP 221010</p>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
