'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface RoomImage {
  id: number
  src: string
  alt: string
  category: string
  price?: string
}

interface RoomsImageSectionProps {
  images?: RoomImage[]
  showAll?: boolean
  limit?: number
  title?: string
  subtitle?: string
}

const RoomsImageSection: React.FC<RoomsImageSectionProps> = ({
  images = [
    // Hotel Room Images
    { id: 1, src: '/images/Rooms1.jpg', alt: 'Elegant Hotel Room 1', category: 'Hotel Rooms' },
    { id: 2, src: '/images/Rooms2.jpg', alt: 'Comfortable Hotel Room 2', category: 'Hotel Rooms' },
    { id: 3, src: '/images/Rooms3.jpg', alt: 'Luxurious Hotel Room 3', category: 'Hotel Rooms' },
    { id: 4, src: '/images/Rooms4.jpg', alt: 'Spacious Hotel Room 4', category: 'Hotel Rooms' },
    { id: 5, src: '/images/Rooms5.jpg', alt: 'Premium Hotel Room 5', category: 'Hotel Rooms' },
    { id: 6, src: '/images/Rooms6.jpg', alt: 'Deluxe Hotel Room 6', category: 'Hotel Rooms' },
    { id: 7, src: '/images/Rooms7.jpg', alt: 'Superior Hotel Room 7', category: 'Hotel Rooms' },
  ],
  showAll = false,
  limit = 12,
  title = 'Our Luxurious Rooms',
  subtitle = 'Experience comfort and elegance in our thoughtfully designed accommodations'
}) => {
  const displayImages = showAll ? images : images.slice(0, limit)

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
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span className="text-varanasi-gold text-2xl block mb-3">◆ ◆ ◆</span>
          <h2 className="font-serif text-4xl md:text-5xl font-bold text-varanasi-maroon mb-6">
            {title}
          </h2>
          <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {displayImages.map((image) => (
            <motion.div
              key={image.id}
              variants={itemVariants}
              whileHover={{ scale: 1.08 }}
              className="group relative aspect-[4/3] min-h-[250px] max-h-[350px] rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all border-2 border-varanasi-gold/20 hover:border-varanasi-gold/50"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-varanasi-maroon/40 group-hover:to-varanasi-maroon/60 transition-colors duration-300 flex items-end">
                <div className="w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-varanasi-cream font-semibold">{image.alt}</p>
                  <div className="flex justify-between items-center">
                    <p className="text-varanasi-gold text-sm">{image.category}</p>
                    {image.price && (
                      <p className="text-varanasi-cream text-sm font-bold bg-varanasi-gold/20 px-2 py-1 rounded">
                        {image.price}
                      </p>
                    )}
                  </div>
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
            <Link href="/rooms">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-varanasi-gold to-varanasi-gold-dark text-varanasi-maroon rounded-full font-semibold hover:shadow-lg hover:shadow-varanasi-gold/50 glow-box-hover"
              >
                View All Rooms
              </motion.button>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default RoomsImageSection