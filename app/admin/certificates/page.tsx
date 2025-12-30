'use client'

import { useEffect, useState } from 'react'
import { Award, CheckCircle, XCircle, Clock, User, RefreshCw, GraduationCap, ChevronRight, ChevronLeft, BookOpen, Image as ImageIcon, Trash2 } from 'lucide-react'
import {
  getParentCertificates,
  getStudentCertificates,
  updateParentCertificateStatus,
  updateStudentCertificateStatus,
  deleteParentCertificate,
  deleteStudentCertificate,
  Certificate,
  CertificatesResponse,
} from '@/lib/api/certificates'
import { motion } from 'framer-motion'
import { Pagination } from '@/lib/api-client'

export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<'parent' | 'student'>('parent')
  const [parentCertificates, setParentCertificates] = useState<Certificate[]>([])
  const [studentCertificates, setStudentCertificates] = useState<Certificate[]>([])
  const [parentPagination, setParentPagination] = useState<Pagination | null>(null)
  const [studentPagination, setStudentPagination] = useState<Pagination | null>(null)
  const [parentPage, setParentPage] = useState(1)
  const [studentPage, setStudentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // Load certificates based on active tab
  useEffect(() => {
    loadCertificates()
  }, [activeTab, parentPage, studentPage])

  const loadCertificates = async () => {
    setLoading(true)
    try {
      if (activeTab === 'parent') {
        const data = await getParentCertificates(parentPage)
        setParentCertificates(data?.certificates || [])
        setParentPagination(data?.pagination || null)
      } else {
        const data = await getStudentCertificates(studentPage)
        setStudentCertificates(data?.certificates || [])
        setStudentPagination(data?.pagination || null)
      }
    } catch (error) {
      console.error('Error loading certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (tab: 'parent' | 'student') => {
    setActiveTab(tab)
    // Reset page when switching tabs
    if (tab === 'parent') {
      setParentPage(1)
    } else {
      setStudentPage(1)
    }
  }

  const handleStatusUpdate = async (
    id: number,
    status: 'pending' | 'accept' | 'cancel',
    type: 'parent' | 'student'
  ) => {
    setUpdatingId(id)
    try {
      if (type === 'parent') {
        await updateParentCertificateStatus(id, status)
      } else {
        await updateStudentCertificateStatus(id, status)
      }
      // Reload certificates - keep current page
      if (type === 'parent') {
        const data = await getParentCertificates(parentPage)
        setParentCertificates(data?.certificates || [])
        setParentPagination(data?.pagination || null)
      } else {
        const data = await getStudentCertificates(studentPage)
        setStudentCertificates(data?.certificates || [])
        setStudentPagination(data?.pagination || null)
      }
    } catch (error) {
      console.error('Error updating certificate status:', error)
      alert('حدث خطأ أثناء تحديث حالة الشهادة')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (
    id: number,
    type: 'parent' | 'student'
  ) => {
    if (!confirm('هل أنت متأكد من حذف هذه الشهادة؟ سيتم حذفها بشكل دائم.')) return
    
    setDeletingId(id)
    try {
      if (type === 'parent') {
        await deleteParentCertificate(id)
      } else {
        await deleteStudentCertificate(id)
      }
      // Reload certificates - keep current page
      if (type === 'parent') {
        const data = await getParentCertificates(parentPage)
        setParentCertificates(data?.certificates || [])
        setParentPagination(data?.pagination || null)
      } else {
        const data = await getStudentCertificates(studentPage)
        setStudentCertificates(data?.certificates || [])
        setStudentPagination(data?.pagination || null)
      }
    } catch (error: any) {
      console.error('Error deleting certificate:', error)
      alert(error.message || 'حدث خطأ أثناء حذف الشهادة')
    } finally {
      setDeletingId(null)
    }
  }

  const getStatusBadge = (status: string, statusLabel?: string) => {
    const label = statusLabel || status
    switch (status) {
      case 'accept':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            {label === 'accept' ? 'مقبولة' : label}
          </span>
        )
      case 'cancel':
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 flex items-center gap-2">
            <XCircle className="w-4 h-4" />
            {label === 'cancel' ? 'ملغاة' : label}
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {label === 'pending' ? 'قيد الانتظار' : label}
          </span>
        )
    }
  }

  const currentCertificates = activeTab === 'parent' ? parentCertificates : studentCertificates
  const currentPagination = activeTab === 'parent' ? parentPagination : studentPagination
  const currentPage = activeTab === 'parent' ? parentPage : studentPage
  const setCurrentPage = activeTab === 'parent' ? setParentPage : setStudentPage

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary-900 mb-8">شهادات التقدير</h1>

      {/* Tabs */}
      <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg mb-6">
        <div className="flex border-b border-primary-200">
          <button
            onClick={() => handleTabChange('parent')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'parent'
                ? 'bg-primary-600 text-white border-b-2 border-primary-600'
                : 'text-primary-700 hover:bg-primary-50'
            }`}
          >
            شهادات أولياء الأمور
          </button>
          <button
            onClick={() => handleTabChange('student')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors ${
              activeTab === 'student'
                ? 'bg-primary-600 text-white border-b-2 border-primary-600'
                : 'text-primary-700 hover:bg-primary-50'
            }`}
          >
            شهادات الطلاب
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {loading ? (
            <div className="text-center py-12 text-primary-600">
              <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>جاري تحميل شهادات التقدير...</p>
            </div>
          ) : currentCertificates.length === 0 ? (
            <div className="text-center py-12 text-primary-600">
              <Award className="w-16 h-16 mx-auto mb-4 text-primary-300" />
              <p className="text-lg">لا توجد شهادات</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentCertificates.map((certificate) => (
                <motion.div
                  key={certificate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary-50 p-6 rounded-lg border-2 border-primary-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-primary-200 p-3 rounded-lg">
                          <Award className="w-6 h-6 text-primary-700" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-primary-900">
                            {activeTab === 'parent'
                              ? certificate.parent_name || 'ولي أمر'
                              : certificate.student_name || 'طالب'}
                          </h3>
                          <p className="text-sm text-primary-600">
                            {activeTab === 'parent' ? 'ولي أمر' : 'طالب'}
                          </p>
                        </div>
                      </div>

                      {/* Student Image */}
                      {activeTab === 'student' && certificate.student_image && (
                        <div className="mb-4">
                          <img
                            src={certificate.student_image}
                            alt={certificate.student_name || 'صورة الطالب'}
                            className="w-32 h-32 object-cover rounded-lg border-2 border-primary-200"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = 'none'
                            }}
                          />
                        </div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {activeTab === 'parent' && certificate.parent_name && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-600" />
                            <span className="text-primary-700 font-medium">ولي الأمر:</span>
                            <span className="text-primary-900">{certificate.parent_name}</span>
                          </div>
                        )}
                        {activeTab === 'student' && certificate.student_name && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-primary-600" />
                            <span className="text-primary-700 font-medium">الطالب:</span>
                            <span className="text-primary-900">{certificate.student_name}</span>
                          </div>
                        )}
                        {certificate.teacher_name && (
                          <div className="flex items-center gap-2">
                            <GraduationCap className="w-4 h-4 text-primary-600" />
                            <span className="text-primary-700 font-medium">المعلم:</span>
                            <span className="text-primary-900">{certificate.teacher_name}</span>
                          </div>
                        )}
                        {activeTab === 'student' && certificate.memorization_amount && (
                          <div className="flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-primary-600" />
                            <span className="text-primary-700 font-medium">مقدار الحفظ:</span>
                            <span className="text-primary-900 font-semibold">{certificate.memorization_amount}</span>
                          </div>
                        )}
                        {certificate.created_at && (
                          <div className="text-sm text-primary-600">
                            تاريخ الإنشاء: {new Date(certificate.created_at).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      {getStatusBadge(certificate.status, certificate.status_label)}

                      {/* Status Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          {certificate.status !== 'pending' && (
                            <button
                              onClick={() => handleStatusUpdate(certificate.id, 'pending', activeTab)}
                              disabled={updatingId === certificate.id || deletingId === certificate.id}
                              className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === certificate.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                'قيد الانتظار'
                              )}
                            </button>
                          )}
                          {certificate.status !== 'accept' && (
                            <button
                              onClick={() => handleStatusUpdate(certificate.id, 'accept', activeTab)}
                              disabled={updatingId === certificate.id || deletingId === certificate.id}
                              className="px-3 py-1.5 text-sm bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === certificate.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                'قبول'
                              )}
                            </button>
                          )}
                          {certificate.status !== 'cancel' && (
                            <button
                              onClick={() => handleStatusUpdate(certificate.id, 'cancel', activeTab)}
                              disabled={updatingId === certificate.id || deletingId === certificate.id}
                              className="px-3 py-1.5 text-sm bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === certificate.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (
                                'إلغاء'
                              )}
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => handleDelete(certificate.id, activeTab)}
                          disabled={deletingId === certificate.id || updatingId === certificate.id}
                          className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {deletingId === certificate.id ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              جاري الحذف...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              حذف
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {currentPagination && currentPagination.total_pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg border-2 border-primary-300 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5 text-primary-700" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-primary-700 font-medium">
                  صفحة {currentPage} من {currentPagination.total_pages}
                </span>
                <span className="text-primary-600 text-sm">
                  (إجمالي: {currentPagination.total})
                </span>
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(currentPagination.total_pages, currentPage + 1))}
                disabled={currentPage === currentPagination.total_pages || loading}
                className="p-2 rounded-lg border-2 border-primary-300 hover:bg-primary-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5 text-primary-700" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

