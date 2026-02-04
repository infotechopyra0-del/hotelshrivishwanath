'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'
import { toast } from 'sonner'

export const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    // Prevent double submission
    if (isSubmitting) {
      console.log("Form already submitting, preventing double submission")
      return
    }
    
    setIsSubmitting(true)
    
    const formData = new FormData(event.currentTarget)
    const contactData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      inquiry_type: formData.get('inquiry_type') as string,
      message: formData.get('message') as string,
    }

    console.log("Submitting contact form with data:", contactData)

    // Basic validation
    if (!contactData.name?.trim() || !contactData.email?.trim() || !contactData.message?.trim()) {
      toast.error("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    try {
      console.log("Making API request...")
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      })

      console.log("API response status:", response.status)
      
      const data = await response.json()
      console.log("API response data:", data)
      
      if (response.ok && data.success) {
        toast.success("Message sent successfully! We'll get back to you soon.")
        event.currentTarget.reset()
      } else {
        toast.error(data.error || "Failed to send message. Please try again.")
      }
    } catch (error: any) {
      console.error("Contact form error:", error)
      toast.error("Network error. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="bg-white p-8 rounded-2xl shadow-lg border border-varanasi-gold/20"
    >
      <h2 className="font-serif text-2xl font-bold text-varanasi-maroon mb-6">
        Send us a Message
      </h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-varanasi-maroon mb-2">
            Full Name
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:ring-2 focus:ring-varanasi-gold focus:border-transparent outline-none transition-all text-varanasi-maroon placeholder-varanasi-brown/40"
            placeholder="Your name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-varanasi-maroon mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:ring-2 focus:ring-varanasi-gold focus:border-transparent outline-none transition-all text-varanasi-maroon placeholder-varanasi-brown/40"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-varanasi-maroon mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              className="w-full px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:ring-2 focus:ring-varanasi-gold focus:border-transparent outline-none transition-all text-varanasi-maroon placeholder-varanasi-brown/40"
              placeholder="+91 XXXXX XXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-varanasi-maroon mb-2">
            Inquiry Type
          </label>
          <select
            name="inquiry_type"
            className="w-full px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:ring-2 focus:ring-varanasi-gold focus:border-transparent outline-none transition-all text-varanasi-maroon"
          >
            <option value="general">General Inquiry</option>
            <option value="booking">Room Booking</option>
            <option value="event">Event Booking</option>
            <option value="complaint">Complaint</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-varanasi-maroon mb-2">
            Message
          </label>
          <textarea
            name="message"
            required
            rows={5}
            className="w-full px-4 py-2 border border-varanasi-gold/20 rounded-lg focus:ring-2 focus:ring-varanasi-gold focus:border-transparent outline-none transition-all resize-none text-varanasi-maroon placeholder-varanasi-brown/40"
            placeholder="Your message here..."
          />
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
          whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
          className={`w-full px-6 py-3 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-lg font-semibold flex items-center justify-center gap-2 transition-all glow-box-hover ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:shadow-varanasi-gold/50"
          }`}
        >
          <Send className={`w-4 h-4 ${isSubmitting ? "animate-pulse" : ""}`} />
          {isSubmitting ? "Sending..." : "Send Message"}
        </motion.button>
      </form>
    </motion.div>
  )
}

export default ContactForm
