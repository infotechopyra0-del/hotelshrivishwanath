'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface HeroProps {
  title: string
  subtitle: string
  backgroundImage?: string
  backgroundImages?: string[]
  cta?: {
    text: string
    href: string
  }
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  backgroundImage = 'linear-gradient(135deg, #3E1F0D 0%, #6B1A1A 100%)',
  backgroundImages = [],
  cta,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Rotate background images if backgroundImages array is provided
  useEffect(() => {
    if (backgroundImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => 
          prevIndex === backgroundImages.length - 1 ? 0 : prevIndex + 1
        )
      }, 4000) // Change every 4 seconds

      return () => clearInterval(interval)
    }
  }, [backgroundImages])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  // Get current background image
  const getCurrentBackgroundImage = () => {
    if (backgroundImages.length > 0) {
      return backgroundImages[currentImageIndex]
    }
    return backgroundImage
  }

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-16 md:pt-24">
      {/* Background Images with Transition */}
      {backgroundImages.length > 0 ? (
        backgroundImages.map((image, index) => (
          <motion.div
            key={index}
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundImage: image.startsWith('linear') || image.startsWith('url') ? image : `linear-gradient(135deg, rgba(59, 31, 13, 0.6) 0%, rgba(107, 26, 26, 0.5) 100%), url('${image}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentImageIndex ? 1 : 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
          />
        ))
      ) : (
        <div
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundImage: backgroundImage.startsWith('linear') || backgroundImage.startsWith('url') ? backgroundImage : `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
      )}
      {/* Gradient Overlay */}
      <div className="absolute inset-0 gradient-overlay z-10" />

      {/* Decorative elements */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-32 right-8 md:right-32 w-32 md:w-48 h-32 md:h-48 bg-varanasi-gold rounded-full blur-3xl opacity-25 z-5"
      />
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 6, repeat: Infinity, delay: 1.5 }}
        className="absolute -bottom-20 -left-8 md:-left-20 w-48 md:w-72 h-48 md:h-72 bg-varanasi-gold rounded-full blur-3xl opacity-20 z-5"
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container-custom relative z-20 text-center text-varanasi-cream"
      >
        <motion.div variants={itemVariants} className="mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-block mb-6"
          >
            <div className="w-16 h-16 rounded-full border-2 border-varanasi-gold border-t-transparent glow-box" />
          </motion.div>
        </motion.div>

        {/* Spiritual ornament */}
        <motion.div variants={itemVariants} className="mb-4">
          <span className="text-4xl text-varanasi-gold opacity-60">◆</span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="font-serif text-6xl md:text-8xl font-bold mb-6 leading-tight text-varanasi-cream glow-gold drop-shadow-2xl"
        >
          {title}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xl md:text-3xl text-varanasi-cream/95 mb-10 max-w-3xl mx-auto font-light drop-shadow-lg"
        >
          {subtitle}
        </motion.p>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-sm text-varanasi-gold font-semibold drop-shadow-lg">Scroll to explore</span>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-varanasi-gold rounded-full flex items-start justify-center p-2"
          >
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1.5 h-2 bg-varanasi-gold rounded-full"
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero
