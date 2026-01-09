'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send } from 'lucide-react'

export const ContactForm = () => {
  const [result, setResult] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSubmitting(true)
    setResult("Sending....")
    
    const formData = new FormData(event.currentTarget)
    formData.append("access_key", "6d8c4f3f-ff37-41c8-a731-57d3cf98862e")

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })

      const data = await response.json()
      if (data.success) {
        setResult("Message sent successfully!")
        event.currentTarget.reset()
        setTimeout(() => setResult(""), 5000)
      } else {
        setResult("Error sending message. Please try again.")
      }
    } catch (error) {
      setResult("Error sending message. Please try again.")
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
        <input type="hidden" name="subject" value="Contact Form Submission - Hotel Shri Vishwanath" />
        <input type="hidden" name="from_name" value="Hotel Shri Vishwanath Website" />

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

        {result && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg text-center font-medium ${
              result.includes("successfully") 
                ? "bg-green-100 text-green-700 border border-green-200" 
                : result.includes("Error") 
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-blue-100 text-blue-700 border border-blue-200"
            }`}
          >
            {result}
          </motion.div>
        )}

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
