'use client'

import { useTranslation } from '@/hooks/useTranslation'
import { useAdminStore } from '@/store/useAdminStore'
import { Trophy, Star } from 'lucide-react'
import Link from 'next/link'

export default function HonorBoardList() {
  const { t } = useTranslation()
  const { honorBoard } = useAdminStore()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {honorBoard.map((student, index) => (
        <Link
          key={student.id}
          href={`/honor-board/${student.id}`}
          className="block"
        >
          <div className="bg-white p-6 rounded-xl border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 relative shadow-lg hover:shadow-2xl transform hover:-translate-y-1 cursor-pointer">
            {index < 3 && (
              <div className="absolute -top-3 -right-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-gold-light rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-300/30 via-accent-green/20 to-primary-400/30 rounded-full flex items-center justify-center shadow-md">
                <Star className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-2">{student.name}</h3>
                <span className="text-accent-green text-sm font-semibold">{student.level}</span>
              </div>
            </div>
            <p className="text-primary-700 font-medium">{student.achievement}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}
