'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, User, Trash2, RefreshCw, ChevronRight, ChevronLeft, AlertTriangle } from 'lucide-react'
import {
  getStudentDeletionRequests,
  approveStudentDeletionRequest,
  rejectStudentDeletionRequest,
  StudentDeletionRequest,
} from '@/lib/api/student-deletion-requests'
import { Pagination } from '@/lib/api-client'

export default function StudentDeletionRequestsPage() {
  const [requests, setRequests] = useState<StudentDeletionRequest[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    status: '' as 'pending' | 'approved' | 'rejected' | '',
    teacher_id: '',
    student_id: '',
  })

  useEffect(() => {
    loadRequests()
  }, [currentPage, filters.status])

  const loadRequests = async () => {
    setLoading(true)
    try {
      const apiFilters: any = {
        page: currentPage,
        per_page: 15,
      }
      if (filters.status) apiFilters.status = filters.status
      if (filters.teacher_id) apiFilters.teacher_id = parseInt(filters.teacher_id)
      if (filters.student_id) apiFilters.student_id = parseInt(filters.student_id)

      const data = await getStudentDeletionRequests(apiFilters)
      setRequests(data?.requests || [])
      setPagination(data?.pagination || null)
    } catch (error) {
      console.error('Error loading requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: number) => {
    if (!confirm('تحذير: الموافقة على هذا الطلب سيؤدي إلى حذف الطالب وجميع بياناته بشكل دائم (الحصص، الاشتراكات، الآراء، إلخ). هل أنت متأكد؟')) {
      return
    }
    
    setProcessingId(id)
    try {
      await approveStudentDeletionRequest(id)
      await loadRequests()
      alert('تم حذف الطالب بنجاح')
    } catch (error: any) {
      alert(error.message || 'فشل الموافقة على الطلب')
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: number) => {
    const reason = prompt('يرجى إدخال سبب الرفض (اختياري):')
    if (reason === null) return // User cancelled
    
    setProcessingId(id)
    try {
      await rejectStudentDeletionRequest(id, reason || undefined)
      await loadRequests()
    } catch (error: any) {
      alert(error.message || 'فشل رفض الطلب')
    } finally {
      setProcessingId(null)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium"><Clock className="w-3 h-3" />قيد الانتظار</span>
      case 'approved':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"><CheckCircle className="w-3 h-3" />موافق عليه</span>
      case 'rejected':
        return <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium"><XCircle className="w-3 h-3" />مرفوض</span>
      default:
        return null
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary-900">طلبات حذف الطلاب</h1>
        <button
          onClick={loadRequests}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <RefreshCw className="w-5 h-5" />
          تحديث
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-primary-200 p-6 mb-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value as 'pending' | 'approved' | 'rejected' | '' })
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الحالات</option>
              <option value="pending">قيد الانتظار</option>
              <option value="approved">موافق عليه</option>
              <option value="rejected">مرفوض</option>
            </select>
          </div>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : requests.length === 0 ? (
        <div className="text-center py-12 text-primary-600 bg-white rounded-xl border-2 border-primary-200">
          لا توجد طلبات
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border-2 border-primary-200 p-6 shadow-lg"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    {getStatusBadge(request.status)}
                    <span className="text-sm text-primary-600">
                      {new Date(request.created_at || '').toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-primary-600 mb-1">المعلم</p>
                      <p className="font-semibold text-primary-900">{request.teacher?.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-primary-600 mb-1">الطالب</p>
                      <p className="font-semibold text-primary-900">{request.student?.name}</p>
                      {request.student?.phone && (
                        <p className="text-sm text-primary-600">{request.student.phone}</p>
                      )}
                    </div>
                  </div>
                  {request.reason && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
                      <p className="text-sm font-semibold text-yellow-700 mb-1">السبب</p>
                      <p className="text-sm text-yellow-900">{request.reason}</p>
                    </div>
                  )}
                  {request.rejection_reason && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <p className="text-sm font-semibold text-red-700 mb-1">سبب الرفض</p>
                      <p className="text-sm text-red-900">{request.rejection_reason}</p>
                    </div>
                  )}
                  {request.status === 'pending' && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg border-2 border-red-300 flex items-start gap-2">
                      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-900">
                        <strong>تحذير:</strong> الموافقة على هذا الطلب سيؤدي إلى حذف الطالب وجميع بياناته بشكل دائم
                      </p>
                    </div>
                  )}
                </div>
                {request.status === 'pending' && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApprove(request.id)}
                      disabled={processingId === request.id}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      موافقة وحذف
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      disabled={processingId === request.id}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      رفض
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border-2 border-primary-200 hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="text-primary-700">
            صفحة {currentPage} من {pagination.total_pages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(pagination.total_pages, p + 1))}
            disabled={currentPage === pagination.total_pages}
            className="p-2 rounded-lg border-2 border-primary-200 hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

