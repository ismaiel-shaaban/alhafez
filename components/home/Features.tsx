'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Users, Clock, Heart, BookOpen, GraduationCap, UserCheck } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Features() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Users className="w-8 h-8" />,
      title: t('features.feature1.title'),
      description: t('features.feature1.description'),
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: t('features.feature2.title'),
      description: t('features.feature2.description'),
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: t('features.feature3.title'),
      description: t('features.feature3.description'),
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: t('features.feature4.title'),
      description: t('features.feature4.description'),
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: t('features.feature5.title'),
      description: t('features.feature5.description'),
    },
    {
      icon: <UserCheck className="w-8 h-8" />,
      title: t('features.feature6.title'),
      description: t('features.feature6.description'),
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container-custom">
        <h2 className="section-title">{t('features.title')}</h2>
        <p className="section-subtitle">{t('features.subtitle')}</p>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-white p-6 rounded-xl hover:shadow-2xl transition-all duration-300 border-2 border-primary-200 hover:border-accent-green group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-accent-green/20 via-primary-300/30 to-accent-green/40 rounded-full flex items-center justify-center mb-4 group-hover:from-accent-green/30 group-hover:to-primary-400/40 transition-all duration-300 shadow-lg group-hover:scale-110">
                <div className="text-accent-green group-hover:text-primary-600 transition-colors">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3 text-primary-900">{feature.title}</h3>
              <p className="text-primary-700 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
