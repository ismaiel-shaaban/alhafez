'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { MessageCircle, ArrowLeft, Sparkles, BookOpen, Users, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Hero() {
  const { t } = useTranslation()
  const [displayedText, setDisplayedText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [charIndex, setCharIndex] = useState(0)
  
  const fullText = t('hero.title')
  const typingSpeed = 100
  const deletingSpeed = 50
  const pauseTime = 2000

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (!isDeleting && charIndex < fullText.length) {
      // Typing
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, charIndex + 1))
        setCharIndex(charIndex + 1)
      }, typingSpeed)
    } else if (isDeleting && charIndex > 0) {
      // Deleting
      timeout = setTimeout(() => {
        setDisplayedText(fullText.slice(0, charIndex - 1))
        setCharIndex(charIndex - 1)
      }, deletingSpeed)
    } else if (!isDeleting && charIndex === fullText.length) {
      // Finished typing, wait then start deleting
      timeout = setTimeout(() => {
        setIsDeleting(true)
      }, pauseTime)
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, wait then start typing again
      timeout = setTimeout(() => {
        setIsDeleting(false)
      }, 500)
    }

    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, fullText])

  const floatingVariants = {
    float: {
      y: [0, -20, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
      },
    },
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Enhanced Background with multiple layers */}
      <div className="absolute inset-0 z-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-primary-100/50"></div>
        
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-accent-green/5 via-transparent to-primary-400/5"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-primary-300/5 via-transparent to-accent-green/5"></div>
        </div>

        {/* Large animated gradient circles */}
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-accent-green/30 to-primary-400/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-br from-primary-500/30 to-accent-green/30 rounded-full mix-blend-multiply filter blur-3xl opacity-60"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-primary-300/30 to-accent-green/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
          animate={{
            scale: [1, 1.1, 1],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0, 104, 115, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 104, 115, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Floating decorative icons */}
      <motion.div
        className="absolute top-32 left-10 text-primary-300/20"
        variants={floatingVariants}
        animate="float"
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <BookOpen className="w-16 h-16" />
      </motion.div>
      <motion.div
        className="absolute top-48 right-16 text-accent-green/20"
        variants={floatingVariants}
        animate="float"
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <Users className="w-20 h-20" />
      </motion.div>
      <motion.div
        className="absolute bottom-32 right-20 text-primary-400/20"
        variants={floatingVariants}
        animate="float"
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Award className="w-14 h-14" />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-20 container-custom text-center px-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Icon Badge */}
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-block mb-8"
        >
          <div className="relative">
            <motion.div
              className="w-28 h-28 bg-gradient-to-br from-accent-green via-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto shadow-2xl"
              animate={{
                boxShadow: [
                  '0 20px 40px rgba(5, 150, 105, 0.3)',
                  '0 30px 60px rgba(5, 150, 105, 0.4)',
                  '0 20px 40px rgba(5, 150, 105, 0.3)',
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="w-14 h-14 text-white" />
            </motion.div>
            {/* Glow effect */}
            <div className="absolute inset-0 w-28 h-28 bg-gradient-to-br from-accent-green via-primary-500 to-primary-700 rounded-3xl mx-auto blur-2xl opacity-50 -z-10"></div>
          </div>
        </motion.div>

        {/* Main Title with Typewriter Animation */}
        <motion.h1
          variants={itemVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-2xl md:text-4xl lg:text-4xl xl:text-4xl font-extrabold mb-6 leading-tight min-h-[1.2em]"
        >
          <span className="block mb-2">
            <span className="bg-gradient-to-r from-primary-700 via-primary-600 to-accent-green bg-clip-text text-transparent">
              {displayedText}
              <span className="inline-block w-1 h-[1em] bg-primary-700 align-middle mr-1 animate-pulse">|</span>
            </span>
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-xl md:text-2xl lg:text-3xl text-primary-700 mb-12 max-w-4xl mx-auto leading-relaxed font-medium"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Stats or features highlight */}
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-center gap-8 mb-12"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-primary-200/50">
            <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse"></div>
            <span className="text-primary-800 font-semibold">معلمون متخصصون</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-primary-200/50">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            <span className="text-primary-800 font-semibold">جلسات مباشرة</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-primary-200/50">
            <div className="w-3 h-3 bg-accent-green rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
            <span className="text-primary-800 font-semibold">منهج متكامل</span>
          </div>
        </motion.div>

        {/* Enhanced CTA Buttons */}
        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative px-8 py-4 bg-gradient-to-r from-accent-green to-primary-600 text-white font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-accent-green opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <MessageCircle className="w-6 h-6 relative z-10" />
            <span className="relative z-10">{t('hero.contactDirect')}</span>
            <ArrowLeft className="w-5 h-5 relative z-10 transform group-hover:translate-x-1 transition-transform" />
            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </motion.a>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              href="/register"
              className="group px-8 py-4 bg-white/90 backdrop-blur-sm text-primary-700 font-bold text-lg rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 border-2 border-primary-300 hover:border-primary-500"
            >
              <span>{t('hero.register')}</span>
              <ArrowLeft className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Bottom decorative wave */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-primary-50/50 to-transparent z-10 pointer-events-none">
        <svg
          className="absolute bottom-0 w-full h-24"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60L60 50C120 40 240 20 360 20C480 20 600 40 720 50C840 60 960 60 1080 50C1200 40 1320 20 1380 10L1440 0V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V60Z"
            fill="white"
            opacity="0.8"
          />
        </svg>
      </div>
    </section>
  )
}
