'use client'

import { useEffect } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useWebsiteStore } from '@/store/useWebsiteStore'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

interface TestimonialsListProps {
  showTitle?: boolean
  headingLevel?: 'h1' | 'h2'
}

export default function TestimonialsList({ showTitle = true, headingLevel = 'h1' }: TestimonialsListProps = {}) {
  const { t } = useTranslation()
  const { reviews, isLoading, fetchWebsiteData } = useWebsiteStore()

  useEffect(() => {
    fetchWebsiteData()
  }, [fetchWebsiteData])

  const currentLocale = typeof window !== 'undefined' ? (localStorage.getItem('locale') || 'ar') : 'ar'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-primary-600">
        {t('testimonials.noReviews') || 'لا توجد آراء متاحة حالياً'}
      </div>
    )
  }

  const HeadingTag = headingLevel

  return (
    <>
      {showTitle && (
        <div className="text-center mb-12">
          <HeadingTag className="section-title">{t('testimonials.title')}</HeadingTag>
          <p className="section-subtitle">{t('testimonials.subtitle')}</p>
        </div>
      )}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
      {reviews.map((review) => {
        const reviewText = currentLocale === 'en' && review.review_en ? review.review_en : (review.review_ar || review.review)
        const packageName = review.package?.name || '-'

        return (
          <motion.div
            key={review.id}
            variants={itemVariants}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="bg-white p-6 rounded-xl border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 shadow-lg hover:shadow-2xl relative"
          >
            <div className="absolute top-4 left-4 text-primary-300/20">
              <Quote className="w-12 h-12" />
            </div>
            <div className="flex items-center gap-1 mb-4 mt-2">
              {[...Array(review.rating)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-accent-gold text-accent-gold" />
              ))}
            </div>
            <p className="text-primary-700 mb-4 leading-relaxed relative z-10">{reviewText}</p>
            <div className="border-t border-primary-200 pt-4">
              <h4 className="font-bold text-primary-900 mb-1">{review.student?.name || 'طالب'}</h4>
              <p className="text-sm text-primary-600">{packageName}</p>
            </div>
          </motion.div>
        )
      })}
      </motion.div>
    </>
  )
}
