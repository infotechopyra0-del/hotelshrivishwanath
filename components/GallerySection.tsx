'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react';

interface GalleryImage {
  id?: string | number
  src: string
  alt: string
  category: string
}

const GallerySection: React.FC<{ showAll?: boolean; limit?: number }> = ({ showAll = false, limit = 12 }) => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => setImages(data))
      .catch(() => setImages([]));
  }, []);
  const displayImages = showAll ? images : images.slice(0, limit);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
  }

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white via-varanasi-cream/30 to-white">
      <div className="container-custom">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayImages.map((image, index) => (
            <motion.div
              key={image.id || `gallery-${index}`}
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all border-2 border-varanasi-gold/20 hover:border-varanasi-gold/50"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-varanasi-maroon/40 group-hover:to-varanasi-maroon/60 transition-colors duration-300 flex items-end">
                <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-varanasi-cream font-semibold">{image.alt}</p>
                  <p className="text-varanasi-gold text-sm">{image.category}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {!showAll && images.length > limit && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link href="/gallery">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 glow-box-hover"
              >
                View Full Gallery
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default GallerySection
