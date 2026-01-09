'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface GalleryImage {
  id: number
  src: string
  alt: string
  category: string
}

interface GallerySectionProps {
  images?: GalleryImage[]
  showAll?: boolean
  limit?: number
}

const GallerySection: React.FC<GallerySectionProps> = ({
  images = [
    // Varanasi Ghats
    { id: 1, src: '/images/VaranasiGhats.jpg', alt: 'Varanasi Ghats', category: 'Heritage' },
    { id: 2, src: '/images/DasaswamedhGhat.jpg', alt: 'Dasaswamedh Ghat', category: 'Heritage' },
    { id: 3, src: '/images/AssiGhat.jpg', alt: 'Assi Ghat', category: 'Heritage' },
    { id: 4, src: '/images/ManikarnikaGhat.jpeg', alt: 'Manikarnika Ghat', category: 'Heritage' },
    { id: 5, src: '/images/HanumanGhat.jpg', alt: 'Hanuman Ghat', category: 'Heritage' },
    { id: 6, src: '/images/KedarGhat.jpg', alt: 'Kedar Ghat', category: 'Heritage' },
    { id: 7, src: '/images/tulsighat.jpeg', alt: 'Tulsi Ghat', category: 'Heritage' },
    
    // Spiritual & Temples
    { id: 8, src: '/images/GangaAartiCeremony.jpg', alt: 'Ganga Aarti Ceremony', category: 'Spiritual' },
    { id: 9, src: '/images/KashiVishwanathTemple.jpg', alt: 'Kashi Vishwanath Temple', category: 'Spiritual' },
    { id: 10, src: '/images/AnnapurnaTemple.jpg', alt: 'Annapurna Temple', category: 'Spiritual' },
    { id: 11, src: '/images/DurgaKundTemple.jpg', alt: 'Durga Kund Temple', category: 'Spiritual' },
    { id: 12, src: '/images/BharatMataTemple.jpg', alt: 'Bharat Mata Temple', category: 'Spiritual' },
    { id: 13, src: '/images/NepaliTemple.jpg', alt: 'Nepali Temple', category: 'Spiritual' },
    { id: 14, src: '/images/SankatMochanHanumanTemple.png', alt: 'Sankat Mochan Hanuman Temple', category: 'Spiritual' },
    { id: 15, src: '/images/TulsiManasMandir.png', alt: 'Tulsi Manas Mandir', category: 'Spiritual' },
    { id: 16, src: '/images/KaalBhairavTemple.png', alt: 'Kaal Bhairav Temple', category: 'Spiritual' },
    { id: 17, src: '/images/VaranasiTemple.jpeg', alt: 'Varanasi Temple', category: 'Spiritual' },
    
    // Architecture & Culture
    { id: 18, src: '/images/TempleArchitecture.jpg', alt: 'Temple Architecture', category: 'Architecture' },
    { id: 19, src: '/images/GhatByEvening.jpg', alt: 'Ghat by Evening', category: 'Culture' },
    { id: 20, src: '/images/AncientAlleyways.webp', alt: 'Ancient Alleyways', category: 'Streets' },
    { id: 21, src: '/images/RamnagarFort.jpeg', alt: 'Ramnagar Fort', category: 'Architecture' },
    { id: 22, src: '/images/ChunarFort.png', alt: 'Chunar Fort', category: 'Architecture' },
    { id: 23, src: '/images/ManMandirObservatory.png', alt: 'Man Mandir Observatory', category: 'Architecture' },
    
    // Markets & Local Life
    { id: 24, src: '/images/GodowliaMarket.png', alt: 'Godowlia Market', category: 'Markets' },
    { id: 25, src: '/images/ThatheriBazaar.png', alt: 'Thateri Bazaar', category: 'Markets' },
    { id: 26, src: '/images/LankaMarket.jpg', alt: 'Lanka Market', category: 'Markets' },
    { id: 27, src: '/images/ChowkArea.png', alt: 'Chowk Area', category: 'Streets' },
    { id: 28, src: '/images/GodowliaChowk.png', alt: 'Godowlia Chowk', category: 'Streets' },
    { id: 29, src: '/images/BengaliTola.jpg', alt: 'Bengali Tola', category: 'Streets' },
    
    // Scenic & Nature
    { id: 30, src: '/images/BoatsOnTheGanga.avif', alt: 'Boats on the Ganga', category: 'Scenic' },
    { id: 31, src: '/images/BlueLassi.jpg', alt: 'Blue Lassi Shop', category: 'Culture' },
    
    // Educational & Museums
    { id: 32, src: '/images/BHUCampus.avif', alt: 'BHU Campus View', category: 'Educational' },
    { id: 33, src: '/images/BharatKalaBhavan.jpeg', alt: 'Bharat Kala Bhavan Museum', category: 'Educational' },
    { id: 34, src: '/images/Sarnath.jpeg', alt: 'Sarnath Buddhist Site', category: 'Historical' },
  ],
  showAll = false,
  limit = 12,
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
            Hotel Gallery
          </h2>
          <p className="text-varanasi-brown text-lg max-w-2xl mx-auto leading-relaxed">
            Explore the beauty, spirituality, and elegance of Varanasi and Shri Vishwanath Hotel
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
