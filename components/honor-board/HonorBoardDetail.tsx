'use client'

import { useAdminStore } from '@/store/useAdminStore'
import { Trophy, Star, ArrowRight, Award } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface HonorBoardDetailProps {
  id: string
}

export default function HonorBoardDetail({ id }: HonorBoardDetailProps) {
  const { honorBoard } = useAdminStore()
  const entry = honorBoard.find((e) => e.id === id)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!entry) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-primary-900 mb-4">السجل غير موجود</h2>
        <Link
          href="/honor-board"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-700 text-white rounded-lg hover:bg-primary-800 transition-colors"
        >
          العودة إلى لوحة الشرف
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/honor-board"
        className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 mb-8 transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
        <span className="font-medium">العودة إلى لوحة الشرف</span>
      </Link>

      {/* Student Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-8 mb-8 border-2 border-primary-200"
      >
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-300/30 via-accent-green/20 to-primary-400/30 rounded-full flex items-center justify-center shadow-lg">
              <Star className="w-16 h-16 text-primary-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <div className="w-12 h-12 bg-gradient-to-br from-accent-gold to-accent-gold-light rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="w-7 h-7 text-white" />
              </div>
            </div>
          </div>
          <div className="flex-1 text-center md:text-right">
            <h1 className="text-4xl font-bold text-primary-900 mb-4">{entry.name}</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-lg mb-4">
              <Award className="w-5 h-5 text-accent-green" />
              <span className="text-accent-green font-semibold text-lg">{entry.level}</span>
            </div>
            <p className="text-xl text-primary-700 font-medium">{entry.achievement}</p>
          </div>
        </div>
      </motion.div>

      {/* Certificates Section */}
      {entry.certificates && entry.certificates.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-primary-900 mb-6 text-center">
            شهادات التقدير
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {entry.certificates.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                onClick={() => setSelectedImage(cert)}
                className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group border-2 border-primary-200 hover:border-primary-400"
              >
                 {cert.startsWith('http') || cert.startsWith('/') ? (
                   <Image
                     src={cert}
                     alt={`شهادة ${entry.name} ${index + 1}`}
                     fill
                     className="object-cover group-hover:scale-105 transition-transform"
                     unoptimized
                   />
                 ) : (
                   <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                     <div className="text-center p-6">
                       <Award className="w-16 h-16 text-primary-400 mx-auto mb-4" />
                       <p className="text-primary-700 font-medium">شهادة التقدير</p>
                       <p className="text-primary-500 text-sm mt-2">اضغط للعرض</p>
                     </div>
                   </div>
                 )}
                 <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>
               </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-12 text-center border-2 border-primary-200"
        >
          <Award className="w-16 h-16 text-primary-300 mx-auto mb-4" />
          <p className="text-xl text-primary-600">لا توجد شهادات متاحة حالياً</p>
        </motion.div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full max-h-[90vh] bg-white rounded-xl overflow-hidden"
            >
              <div className="relative aspect-[4/3] w-full">
                {selectedImage.startsWith('http') || selectedImage.startsWith('/') ? (
                  <Image
                    src={selectedImage}
                    alt={`شهادة ${entry.name}`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center">
                    <div className="text-center p-8">
                      <Award className="w-24 h-24 text-primary-400 mx-auto mb-4" />
                      <p className="text-primary-700 font-medium text-xl">شهادة التقدير</p>
                      <p className="text-primary-500 mt-2">
                        {entry.name} - {entry.achievement}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-4 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-colors"
              >
                <span className="text-2xl text-primary-900">&times;</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
