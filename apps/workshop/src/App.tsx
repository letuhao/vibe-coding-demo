import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react'
import { slides } from './slides/slidesData'
import SlideRenderer from './components/SlideRenderer'
import ProgressIndicator from './components/ProgressIndicator'
import KeyboardShortcuts from './components/KeyboardShortcuts'

const App: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const totalSlides = slides.length

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => {
          const next = prev + 1
          if (next >= totalSlides) {
            setIsPlaying(false)
            return prev
          }
          return next
        })
      }, 8000) // 8 seconds per slide

      return () => clearInterval(interval)
    }
  }, [isPlaying, totalSlides])

  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowRight':
      case ' ':
        e.preventDefault()
        nextSlide()
        break
      case 'ArrowLeft':
        e.preventDefault()
        prevSlide()
        break
      case 'p':
        e.preventDefault()
        togglePlayPause()
        break
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [currentSlide])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Progress Indicator */}
      <ProgressIndicator 
        currentSlide={currentSlide} 
        totalSlides={totalSlides} 
        isPlaying={isPlaying} 
      />
      
      {/* Slide Counter */}
      <div className="slide-counter">
        {currentSlide + 1} / {totalSlides}
      </div>

      {/* Keyboard Shortcuts */}
      <KeyboardShortcuts />

      {/* Main Slide Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="slide-container"
        >
          <SlideRenderer slide={slides[currentSlide]} />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      <div className="fixed bottom-8 right-8 flex space-x-4">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlayPause}
          className="navigation-button flex items-center space-x-2"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          <span>{isPlaying ? 'Pause' : 'Play'}</span>
        </button>

        {/* Previous Button */}
        <button
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="navigation-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Next Button */}
        <button
          onClick={nextSlide}
          disabled={currentSlide === totalSlides - 1}
          className="navigation-button disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={20} />
        </button>
      </div>

    </div>
  )
}

export default App
