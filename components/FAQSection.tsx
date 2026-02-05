'use client'

import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function FAQSection() {
  const [faqs, setFaqs] = useState<Array<{ question: string; answer: string }>>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    setLoading(true);
    fetch('/api/faq')
      .then(res => res.json())
      .then(data => {
        setFaqs(data);
        setLoading(false);
      })
      .catch(() => {
        setFaqs([]);
        setLoading(false);
      });
  }, []);

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
          {loading ? (
            [...Array(5)].map((_, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-sm border border-varanasi-gold/10 overflow-hidden animate-pulse">
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex-1 pr-4">
                      <div className={`h-6 bg-gray-200 rounded ${
                        index === 0 ? 'w-3/4' : 
                        index === 1 ? 'w-5/6' :
                        index === 2 ? 'w-2/3' :
                        index === 3 ? 'w-4/5' : 'w-3/5'
                      }`}></div>
                    </div>
                    <div className="w-5 h-5 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            ))
          ) : faqs.length === 0 ? (
            <div className="text-center text-varanasi-brown py-8">No FAQs found.</div>
          ) : (
            faqs.map((faq, index) => (
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
            ))
          )}
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
  );
}
