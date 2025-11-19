'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { Star, Quote } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TestimonialsList() {
  const { t } = useTranslation()

  const testimonials = [
    {
      id: 1,
      name: 'أحمد محمد',
      review: 'تجربة رائعة! المعلمون متخصصون والمنهج ممتاز.',
      rating: 5,
      package: 'الباقة المميزة',
    },
    {
      id: 2,
      name: 'فاطمة علي',
      review: 'ابني تحسن كثيراً في قراءة القرآن. شكراً لكم!',
      rating: 5,
      package: 'الباقة الأساسية',
    },
    {
      id: 3,
      name: 'خالد حسن',
      review: 'أكاديمية ممتازة بكل المقاييس. أنصح الجميع بالانضمام.',
      rating: 5,
      package: 'الباقة المميزة',
    },
  ]

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

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {testimonials.map((testimonial) => (
        <motion.div
          key={testimonial.id}
          variants={itemVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-white p-6 rounded-xl border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 shadow-lg hover:shadow-2xl relative"
        >
          <div className="absolute top-4 left-4 text-primary-300/20">
            <Quote className="w-12 h-12" />
          </div>
          <div className="flex items-center gap-1 mb-4 mt-2">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-accent-gold text-accent-gold" />
            ))}
          </div>
          <p className="text-primary-700 mb-4 leading-relaxed relative z-10">{testimonial.review}</p>
          <div className="border-t border-primary-200 pt-4">
            <h4 className="font-bold text-primary-900 mb-1">{testimonial.name}</h4>
            <p className="text-sm text-primary-600">{testimonial.package}</p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
