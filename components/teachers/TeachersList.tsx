'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { User, Award, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TeachersList() {
  const { t } = useTranslation()

  const teachers = [
    {
      id: 1,
      name: 'الشيخ أحمد محمد',
      specialization: 'حفظ القرآن والتجويد',
      experience: '15 سنة خبرة',
      image: null,
    },
    {
      id: 2,
      name: 'الشيخة فاطمة علي',
      specialization: 'تعليم النساء والأطفال',
      experience: '12 سنة خبرة',
      image: null,
    },
    {
      id: 3,
      name: 'الشيخ محمود حسن',
      specialization: 'أحكام التجويد',
      experience: '18 سنة خبرة',
      image: null,
    },
    {
      id: 4,
      name: 'الشيخة سارة أحمد',
      specialization: 'تأسيس القراءة',
      experience: '10 سنة خبرة',
      image: null,
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
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {teachers.map((teacher) => (
        <motion.div
          key={teacher.id}
          variants={itemVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ y: -8, scale: 1.02 }}
          className="bg-white p-6 rounded-xl border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 text-center shadow-lg hover:shadow-2xl"
        >
          <div className="w-32 h-32 bg-gradient-to-br from-primary-300/30 via-accent-green/20 to-primary-400/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <User className="w-16 h-16 text-primary-600" />
          </div>
          <h3 className="text-xl font-bold text-primary-900 mb-2">{teacher.name}</h3>
          <div className="flex items-center justify-center gap-2 text-primary-700 mb-2">
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">{teacher.specialization}</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-accent-green">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">{teacher.experience}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
