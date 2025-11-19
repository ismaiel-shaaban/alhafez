'use client'

import { useState } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { Plus, Edit, Trash2, X, Trophy } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function HonorBoardPage() {
  const { honorBoard, addHonorEntry, updateHonorEntry, deleteHonorEntry } = useAdminStore()
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    level: '',
    achievement: '',
    certificates: [] as string[],
  })
  const [newCertificate, setNewCertificate] = useState('')

  const handleOpenModal = (entry?: any) => {
    if (entry) {
      setEditingId(entry.id)
      setFormData({
        name: entry.name || '',
        level: entry.level || '',
        achievement: entry.achievement || '',
        certificates: entry.certificates || [],
      })
    } else {
      setEditingId(null)
      setFormData({ name: '', level: '', achievement: '', certificates: [] })
    }
    setNewCertificate('')
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingId(null)
    setFormData({ name: '', level: '', achievement: '', certificates: [] })
    setNewCertificate('')
  }

  const handleAddCertificate = () => {
    if (newCertificate.trim()) {
      setFormData({
        ...formData,
        certificates: [...formData.certificates, newCertificate.trim()],
      })
      setNewCertificate('')
    }
  }

  const handleRemoveCertificate = (index: number) => {
    setFormData({
      ...formData,
      certificates: formData.certificates.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      updateHonorEntry(editingId, formData)
    } else {
      addHonorEntry(formData)
    }
    handleCloseModal()
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا السجل؟')) {
      deleteHonorEntry(id)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary-900">إدارة لوحة الشرف</h1>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all shadow-lg"
        >
          <Plus className="w-5 h-5" />
          إضافة سجل
        </button>
      </div>

      {/* Honor Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {honorBoard.map((entry, index) => (
          <div
            key={entry.id}
            className="bg-white p-6 rounded-xl border-2 border-primary-200 shadow-lg hover:shadow-xl transition-all relative"
          >
            {index < 3 && (
              <div className="absolute -top-3 -right-3">
                <div className="w-10 h-10 bg-gradient-to-br from-accent-gold to-accent-gold-light rounded-full flex items-center justify-center shadow-lg">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            )}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-300/30 via-accent-green/20 to-primary-400/30 rounded-full flex items-center justify-center">
                <span className="text-2xl font-bold text-primary-700">{entry.name.charAt(0)}</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary-900 mb-1">{entry.name}</h3>
                <span className="text-accent-green text-sm font-semibold">{entry.level}</span>
              </div>
            </div>
            <p className="text-primary-700 font-medium mb-4">{entry.achievement}</p>
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-primary-200">
              <button
                onClick={() => handleOpenModal(entry)}
                className="px-4 py-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(entry.id)}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">
                  {editingId ? 'تعديل سجل' : 'إضافة سجل جديد'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">اسم الطالب</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">المستوى</label>
                  <input
                    type="text"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">الإنجاز</label>
                  <textarea
                    value={formData.achievement}
                    onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">
                    شهادات التقدير (روابط الصور)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newCertificate}
                      onChange={(e) => setNewCertificate(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddCertificate()
                        }
                      }}
                      placeholder="أدخل رابط صورة الشهادة"
                      className="flex-1 px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddCertificate}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      إضافة
                    </button>
                  </div>
                  {formData.certificates.length > 0 && (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {formData.certificates.map((cert, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-2 bg-primary-50 rounded-lg"
                        >
                          <span className="flex-1 text-sm text-primary-700 truncate">{cert}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveCertificate(index)}
                            className="px-2 py-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all"
                  >
                    {editingId ? 'حفظ التعديلات' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
