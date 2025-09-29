import React from 'react'
import { motion } from 'framer-motion'
import { 
  Code, 
  Zap, 
  CheckCircle, 
  ArrowRight,
  FileText,
  Rocket
} from 'lucide-react'
import { SlideData } from '../types/slides'

interface SlideRendererProps {
  slide: SlideData
}

const SlideRenderer: React.FC<SlideRendererProps> = ({ slide }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'title': return <Rocket className="w-16 h-16 text-primary-400" />
      case 'content': return <FileText className="w-16 h-16 text-primary-400" />
      case 'demo': return <Zap className="w-16 h-16 text-primary-400" />
      case 'code': return <Code className="w-16 h-16 text-primary-400" />
      case 'summary': return <CheckCircle className="w-16 h-16 text-primary-400" />
      default: return <FileText className="w-16 h-16 text-primary-400" />
    }
  }

  const renderContent = () => {
    switch (slide.type) {
      case 'title':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              {getIcon(slide.type)}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="slide-title"
            >
              {slide.title}
            </motion.h1>
            {slide.subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="slide-subtitle"
              >
                {slide.subtitle}
              </motion.p>
            )}
            {slide.highlight && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="highlight-box mt-8"
              >
                <p className="text-lg font-medium">{slide.highlight}</p>
              </motion.div>
            )}
          </div>
        )

      case 'content':
        return (
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center mb-8"
            >
              {getIcon(slide.type)}
              <h1 className="slide-title ml-6">{slide.title}</h1>
            </motion.div>
            
            {slide.content && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="slide-list"
              >
                {slide.content.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
                    className="flex items-start space-x-3 mb-4"
                  >
                    <ArrowRight className="w-5 h-5 text-primary-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )

      case 'demo':
        return (
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center mb-8"
            >
              {getIcon(slide.type)}
              <h1 className="slide-title ml-6">{slide.title}</h1>
            </motion.div>
            
            {slide.tech && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="mb-8"
              >
                <h3 className="text-xl font-semibold mb-4 text-gray-300">Tech Stack:</h3>
                <div className="flex flex-wrap">
                  {slide.tech.map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                      className="tech-badge"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            {slide.content && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="slide-list"
              >
                {slide.content.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.4 }}
                    className="flex items-start space-x-3 mb-4"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )

      case 'code':
        return (
          <div>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex items-center mb-8"
            >
              {getIcon(slide.type)}
              <h1 className="slide-title ml-6">{slide.title}</h1>
            </motion.div>
            
            {slide.code && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="code-block"
              >
                <pre className="whitespace-pre-wrap">{slide.code}</pre>
              </motion.div>
            )}
          </div>
        )

      case 'summary':
        return (
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8"
            >
              {getIcon(slide.type)}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="slide-title"
            >
              {slide.title}
            </motion.h1>
            {slide.content && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="slide-list max-w-4xl mx-auto"
              >
                {slide.content.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    className="flex items-start space-x-3 mb-4"
                  >
                    <CheckCircle className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )

      default:
        return <div>Unknown slide type</div>
    }
  }

  return (
    <div className="slide-content">
      {renderContent()}
    </div>
  )
}

export default SlideRenderer
