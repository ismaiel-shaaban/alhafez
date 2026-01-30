'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  RefreshCw,
  User,
  GraduationCap,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react'
import { getComplaints, Complaint, ComplaintType, ComplaintStatus } from '@/lib/api/complaints'
import { Pagination } from '@/lib/api-client'
import { useAdminStore } from '@/store/useAdminStore'
import SearchableStudentSelect from '@/components/admin/SearchableStudentSelect'
import SearchableTeacherSelect from '@/components/admin/SearchableTeacherSelect'

const COMPLAINT_TYPE_OPTIONS: { value: ComplaintType; label: string }[] = [
  { value: 'student', label: 'شكاوى الطلاب' },
  { value: 'teacher', label: 'شكاوى المعلمين' },
]

const STATUS_OPTIONS: { value: ComplaintStatus; label: string }[] = [
  { value: 'pending', label: 'قيد الانتظار' },
  { value: 'in_progress', label: 'قيد المعالجة' },
  { value: 'resolved', label: 'تم الحل' },
  { value: 'closed', label: 'مغلق' },
]

export default function ComplaintsPage() {
  const { students, fetchStudents, teachers, fetchTeachers } = useAdminStore()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<ComplaintType>('student')
  const [filters, setFilters] = useState<{
    status: ComplaintStatus | ''
    student_id: string
    teacher_id: string
  }>({
    status: '',
    student_id: '',
    teacher_id: '',
  })

  useEffect(() => {
    fetchTeachers(1, 1000)
    fetchStudents({ per_page: 1000, page: 1 })
  }, [fetchTeachers, fetchStudents])

  useEffect(() => {
    loadComplaints()
  }, [currentPage, activeTab, filters.status, filters.student_id, filters.teacher_id])

  const loadComplaints = async () => {
    setLoading(true)
    try {
      const apiFilters: any = {
        complaint_type: activeTab,
        page: currentPage,
        per_page: 15,
      }
      if (filters.status) apiFilters.status = filters.status
      if (filters.student_id) apiFilters.student_id = parseInt(filters.student_id)
      if (filters.teacher_id) apiFilters.teacher_id = parseInt(filters.teacher_id)

      const data = await getComplaints(apiFilters)
      setComplaints(data?.complaints || [])
      setPagination(data?.pagination || null)
    } catch (error) {
      console.error('Error loading complaints:', error)
      setComplaints([])
      setPagination(null)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-100 text-amber-800 rounded-lg text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" />
            قيد الانتظار
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-semibold">
            <MessageSquare className="w-3.5 h-3.5" />
            قيد المعالجة
          </span>
        )
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5" />
            تم الحل
          </span>
        )
      case 'closed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" />
            مغلق
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary-100 text-primary-800 rounded-lg text-xs font-semibold">
            {status}
          </span>
        )
    }
  }

  return (
    <div className="px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 flex items-center gap-2">
          <AlertCircle className="w-8 h-8 sm:w-9 sm:h-9 text-primary-600" />
          الشكاوى
        </h1>
        <button
          onClick={loadComplaints}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto"
        >
          <RefreshCw className="w-5 h-5" />
          تحديث
        </button>
      </div>

      {/* Tabs: Student / Teacher */}
      <div className="flex gap-2 mb-6">
        {COMPLAINT_TYPE_OPTIONS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveTab(tab.value)
              setCurrentPage(1)
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold transition-all ${
              activeTab === tab.value
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-white border-2 border-primary-200 text-primary-700 hover:border-primary-400'
            }`}
          >
            {tab.value === 'student' ? (
              <User className="w-5 h-5" />
            ) : (
              <GraduationCap className="w-5 h-5" />
            )}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-primary-200 p-4 sm:p-6 mb-6 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">الحالة</label>
            <select
              value={filters.status}
              onChange={(e) => {
                setFilters({ ...filters, status: e.target.value as ComplaintStatus | '' })
                setCurrentPage(1)
              }}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الحالات</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          {activeTab === 'student' && (
            <div>
              <label className="block text-primary-900 font-semibold mb-2 text-right">الطالب</label>
              <SearchableStudentSelect
                value={filters.student_id}
                onChange={(value) => {
                  setFilters({ ...filters, student_id: value })
                  setCurrentPage(1)
                }}
                students={students}
                placeholder="جميع الطلاب"
              />
            </div>
          )}
          {activeTab === 'teacher' && (
            <div>
              <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم</label>
              <SearchableTeacherSelect
                value={filters.teacher_id}
                onChange={(value) => {
                  setFilters({ ...filters, teacher_id: value })
                  setCurrentPage(1)
                }}
                teachers={teachers}
                placeholder="جميع المعلمين"
              />
            </div>
          )}
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : complaints.length === 0 ? (
        <div className="text-center py-8 sm:py-12 text-sm sm:text-base text-primary-600 bg-white rounded-xl border-2 border-primary-200 px-4">
          لا توجد شكاوى
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((complaint) => (
            <motion.div
              key={complaint.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border-2 border-primary-200 p-4 sm:p-6 shadow-lg"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {getStatusBadge(complaint.status)}
                  <span className="text-xs sm:text-sm text-primary-600">
                    {complaint.created_at
                      ? new Date(complaint.created_at).toLocaleDateString('ar-SA', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })
                      : '-'}
                  </span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-primary-900 mb-2">{complaint.subject}</h3>
              <p className="text-primary-700 text-sm mb-4 whitespace-pre-wrap">{complaint.message}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                {complaint.complaint_type === 'teacher' && complaint.teacher && (
                  <div>
                    <p className="text-primary-600 mb-0.5">المعلم</p>
                    <p className="font-semibold text-primary-900">{complaint.teacher.name}</p>
                  </div>
                )}
                {complaint.complaint_type === 'student' && complaint.student && (
                  <div>
                    <p className="text-primary-600 mb-0.5">الطالب</p>
                    <p className="font-semibold text-primary-900">{complaint.student.name}</p>
                  </div>
                )}
                {complaint.against_student && (
                  <div>
                    <p className="text-primary-600 mb-0.5">ضد الطالب</p>
                    <p className="font-semibold text-primary-900">{complaint.against_student.name}</p>
                  </div>
                )}
                {complaint.against_teacher && (
                  <div>
                    <p className="text-primary-600 mb-0.5">ضد المعلم</p>
                    <p className="font-semibold text-primary-900">{complaint.against_teacher.name}</p>
                  </div>
                )}
              </div>
              {complaint.admin_response && (
                <div className="mt-4 p-3 bg-primary-50 rounded-lg border border-primary-200">
                  <p className="text-xs font-semibold text-primary-700 mb-1">رد الإدارة</p>
                  <p className="text-sm text-primary-800 whitespace-pre-wrap">{complaint.admin_response}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border-2 border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium text-primary-700">
            {currentPage} / {pagination.total_pages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(pagination.total_pages, p + 1))}
            disabled={currentPage >= pagination.total_pages}
            className="p-2 rounded-lg border-2 border-primary-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-50 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}
