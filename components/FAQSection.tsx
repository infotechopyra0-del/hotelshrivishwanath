'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

const faqs = [
  {
    question: 'What are the check-in and check-out times?',
    answer: 'Check-in is from 2:00 PM and check-out is until 11:00 AM. Early check-in or late check-out may be available on request and subject to availability and additional charges.'
  },
  {
    question: 'Do you offer airport transfers?',
    answer: 'Yes, we provide airport pick-up and drop services for an additional fee. Please contact our front desk at +91 6390057777 or include the request while booking to arrange transportation.'
  },
  {
    question: 'Is breakfast included with the room?',
    answer: 'Some room rates include complimentary breakfast. Please check your booking details or confirmation email. We also offer à la carte and buffet options at our on-site restaurant.'
  },
  {
    question: 'What is your cancellation policy?',
    answer: 'Our cancellation policy varies by rate type and booking period. Standard flexible rates typically allow free cancellation up to 24-48 hours before arrival. Non-refundable rates cannot be cancelled or modified. Please review your reservation confirmation for specific terms.'
  },
  {
    question: 'Are pets allowed at the hotel?',
    answer: 'Pets are not permitted in the hotel premises. However, service animals are welcome with prior notice and appropriate documentation as required by law.'
  },
  {
    question: 'Do you have parking facilities?',
    answer: 'Yes, we provide complimentary parking for our guests. Our parking area is secure and monitored 24/7 for your peace of mind.'
  },
  {
    question: 'What amenities are included in the rooms?',
    answer: 'All rooms include air conditioning, free Wi-Fi, flat-screen TV, mini-refrigerator, tea/coffee making facilities, and complimentary toiletries. Premium suites include additional amenities.'
  },
  {
    question: 'Is Wi-Fi available throughout the hotel?',
    answer: 'Yes, complimentary high-speed Wi-Fi is available throughout the hotel premises including all rooms, lobby, restaurant, and common areas.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept cash, all major credit cards (Visa, MasterCard, American Express), debit cards, and digital payments including UPI, Paytm, and other popular payment apps.'
  },
  {
    question: 'How can I contact the hotel for special requests?',
    answer: 'You can reach us at +91 6390057777 or email hotelshrivishwanath@gmail.com. Our staff is available 24/7 to assist with any special requests or arrangements for your stay.'
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
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
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-varanasi-brown text-lg max-w-2xl mx-auto">
            Find answers to common questions about our services, amenities, and booking policies
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-varanasi-gold/10 overflow-hidden"
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-varanasi-gold/5 transition-colors"
                whileHover={{ backgroundColor: 'rgba(232, 185, 35, 0.05)' }}
              >
                <h3 className="font-semibold text-lg text-varanasi-maroon pr-4">
                  {faq.question}
                </h3>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0"
                >
                  <ChevronDown className="w-5 h-5 text-varanasi-gold" />
                </motion.div>
              </motion.button>
              
              <motion.div
                initial={false}
                animate={{ 
                  height: openIndex === index ? 'auto' : 0,
                  opacity: openIndex === index ? 1 : 0
                }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6">
                  <p className="text-varanasi-brown leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-12 text-center p-6 bg-white rounded-2xl shadow-sm border border-varanasi-gold/10"
        >
          <h3 className="font-semibold text-xl text-varanasi-maroon mb-3">
            Still have questions?
          </h3>
          <p className="text-varanasi-brown mb-4">
            Our friendly staff is here to help you 24/7. Don't hesitate to reach out!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="tel:+916390057777"
              className="px-6 py-3 bg-varanasi-gold text-varanasi-maroon rounded-full font-semibold hover:bg-varanasi-gold-dark transition-colors"
            >
              📞 Call: +91 6390057777
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="mailto:hotelshrivishwanath@gmail.com"
              className="px-6 py-3 border-2 border-varanasi-gold text-varanasi-maroon rounded-full font-semibold hover:bg-varanasi-gold hover:text-white transition-colors"
            >
              ✉️ Email Us
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}