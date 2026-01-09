'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
}

const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 24,
    },
    enter: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: -24,
    },
  }

  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      transition={{ 
        duration: 0.6, 
        ease: "easeOut" 
      }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
