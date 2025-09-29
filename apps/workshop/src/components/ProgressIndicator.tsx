import React from 'react'
import { motion } from 'framer-motion'

interface ProgressIndicatorProps {
  currentSlide: number
  totalSlides: number
  isPlaying: boolean
}

const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  currentSlide,
  totalSlides
}) => {
  const progress = (currentSlide / (totalSlides - 1)) * 100

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-gray-800 z-50">
      <motion.div
        className="h-full bg-gradient-to-r from-primary-500 to-accent-500"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
      
      {/* Slide dots */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {Array.from({ length: totalSlides }, (_, index) => (
          <motion.div
            key={index}
            className={`w-2 h-2 rounded-full ${
              index <= currentSlide ? 'bg-primary-500' : 'bg-gray-600'
            }`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.05 }}
          />
        ))}
      </div>
    </div>
  )
}

export default ProgressIndicator
