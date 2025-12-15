'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useWebsiteStore } from '@/store/useWebsiteStore'
import { Video, Play, ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface LessonsListProps {
  showTitle?: boolean
  headingLevel?: 'h1' | 'h2'
  limit?: number // Limit number of lessons to display (for home page)
}

export default function LessonsList({ showTitle = true, headingLevel = 'h1', limit }: LessonsListProps = {}) {
  const { t } = useTranslation()
  const { lessons, isLoadingLessons, fetchLessons } = useWebsiteStore()

  useEffect(() => {
    fetchLessons()
  }, [fetchLessons])

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

  if (isLoadingLessons) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const displayedLessons = limit ? lessons.slice(0, limit) : lessons

  if (displayedLessons.length === 0) {
    return (
      <div className="text-center py-12 text-primary-600">
        {t('lessons.noLessons') || 'لا توجد دروس متاحة حالياً'}
      </div>
    )
  }

  const HeadingTag = headingLevel

  return (
    <>
      {showTitle && (
        <div className="text-center mb-12">
          <HeadingTag className="section-title">{t('lessons.title') || 'فيديوهات من الحصص'}</HeadingTag>
          <p className="section-subtitle">{t('lessons.subtitle') || 'شاهد دروسنا المسجلة من الحصص الحية'}</p>
          <div className="mt-0">
            <Link 
              href="/lessons"
              className="inline-flex items-center gap-1.5 text-accent-green hover:text-primary-600 font-medium transition-all group text-sm sm:text-base relative pb-0.5"
              dir={currentLocale === 'ar' ? 'rtl' : 'ltr'}
            >
              <span className="relative">
                {t('common.seeAll') || 'عرض الكل'}
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-green scale-x-0 group-hover:scale-x-100 transition-transform origin-center"></span>
              </span>
              {currentLocale === 'ar' ? (
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              ) : (
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              )}
            </Link>
          </div>
        </div>
      )}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
      >
        {displayedLessons.map((lesson) => {
          const title = lesson.localized_title || (currentLocale === 'en' && lesson.title_en ? lesson.title_en : (lesson.title_ar || lesson.title))
          const description = lesson.localized_description || (currentLocale === 'en' && lesson.description_en ? lesson.description_en : (lesson.description_ar || lesson.description))

          return (
            <motion.div
              key={lesson.id}
              variants={itemVariants}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white rounded-xl border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 shadow-lg hover:shadow-2xl overflow-hidden"
            >
              {/* Video Section */}
              {lesson.video && (
                <div className="relative aspect-video bg-gray-900 overflow-hidden rounded-t-xl">
                  <video
                    src={lesson.video}
                    className="w-full h-full object-cover"
                    controls
                    preload="metadata"
                    playsInline
                    onError={(e) => {
                      const target = e.target as HTMLVideoElement
                      console.error('Video loading error:', lesson.video)
                      target.style.display = 'none'
                      const errorDiv = target.parentElement?.querySelector('.video-error') as HTMLElement
                      if (errorDiv) {
                        errorDiv.style.display = 'flex'
                      }
                    }}
                  >
                    Your browser does not support the video tag.
                  </video>
                  <div 
                    className="video-error absolute inset-0 bg-gray-900/90 flex items-center justify-center text-white text-center p-4"
                    style={{ display: 'none' }}
                  >
                    <div>
                      <Video className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">فيديو غير متاح</p>
                      <p className="text-xs mt-1 opacity-75">Video unavailable</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Content Section */}
              <div className="p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <Video className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary-900 mb-2 line-clamp-2">{title}</h3>
                  </div>
                </div>
                <p className="text-primary-700 text-sm leading-relaxed line-clamp-3 mb-4">
                  {description}
                </p>
                <Link
                  href={`/lessons#lesson-${lesson.id}`}
                  className="inline-flex items-center gap-2 text-accent-green hover:text-primary-600 font-medium transition-colors text-sm"
                >
                  <span>{currentLocale === 'en' ? 'Watch Lesson' : 'مشاهدة الدرس'}</span>
                  <Play className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </>
  )
}

