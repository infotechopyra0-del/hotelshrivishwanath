'use client'

import { motion } from 'framer-motion'

interface ContactInfoProps {
  contactInfo: Array<{
    icon: React.ComponentType<any>
    title: string
    value: string
    href: string
  }>
}

export const ContactInfo: React.FC<ContactInfoProps> = ({ contactInfo }) => {
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
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2 className="font-serif text-4xl font-bold text-varanasi-maroon mb-6">
        Get in Touch
      </h2>
      <p className="text-varanasi-brown mb-8">
        Have questions about our rooms or services? We're here to help. Contact us
        anytime and we'll respond as soon as possible.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="space-y-6"
      >
        {contactInfo.map((info, index) => {
          const Icon = info.icon
          return (
            <motion.a
              key={index}
              variants={itemVariants}
              href={info.href}
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-varanasi-cream transition-colors border border-transparent hover:border-varanasi-gold/20"
            >
              <div className="w-12 h-12 rounded-full bg-varanasi-gold/20 flex items-center justify-center flex-shrink-0 mt-1 border border-varanasi-gold/30">
                <Icon className="w-6 h-6 text-varanasi-gold" />
              </div>
              <div>
                <h3 className="font-semibold text-varanasi-maroon mb-1">
                  {info.title}
                </h3>
                <p className="text-varanasi-brown text-sm">{info.value}</p>
              </div>
            </motion.a>
          )
        })}
      </motion.div>

      {/* Business Hours */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="mt-12 p-6 bg-varanasi-cream rounded-2xl shadow-lg border border-varanasi-gold/20"
      >
        <h3 className="font-semibold text-varanasi-maroon mb-4">Business Hours</h3>
        <div className="space-y-2 text-varanasi-brown text-sm">
          <p className="flex justify-between">
            <span>Reception & Services:</span>
            <span className="text-varanasi-gold font-semibold">24/7 Available</span>
          </p>
          <p className="flex justify-between">
            <span>Check-in:</span>
            <span>12:00 PM onwards</span>
          </p>
          <p className="flex justify-between">
            <span>Check-out:</span>
            <span>Until 11:00 AM</span>
          </p>
          <p className="flex justify-between">
            <span>Emergency Support:</span>
            <span className="text-varanasi-gold font-semibold">Always Available</span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default ContactInfo
