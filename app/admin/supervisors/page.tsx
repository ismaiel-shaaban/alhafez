'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Edit,
  Trash2,
  X,
  Search,
  Filter,
  RefreshCw,
  User,
  CheckCircle,
  XCircle,
} from 'lucide-react'
import {
  getSupervisors,
  createSupervisor,
  updateSupervisor,
  deleteSupervisor,
  Supervisor,
  CreateSupervisorRequest,
  UpdateSupervisorRequest,
} from '@/lib/api/supervisors'
import { Pagination } from '@/lib/api-client'
import { motion, AnimatePresence } from 'framer-motion'

export default function SupervisorsPage() {
  const [supervisors, setSupervisors] = useState<Supervisor[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSupervisor, setEditingSupervisor] = useState<Supervisor | null>(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [isActiveFilter, setIsActiveFilter] = useState<string>('') // '', 'true', 'false'

  // Form state
  const [formData, setFormData] = useState<CreateSupervisorRequest>({
    name: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    is_active: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load supervisors
  useEffect(() => {
    loadSupervisors()
  }, [currentPage, searchTerm, isActiveFilter])

  const loadSupervisors = async () => {
    setLoading(true)
    try {
      const params: any = {
        page: currentPage,
        per_page: 15,
      }
      if (searchTerm.trim()) {
        params.search = searchTerm.trim()
      }
      if (isActiveFilter !== '') {
        params.is_active = isActiveFilter === 'true'
      }

      const data = await getSupervisors(params)
      setSupervisors(data?.supervisors || [])
      setPagination(data?.pagination || null)
    } catch (error: any) {
      console.error('Error loading supervisors:', error)
      alert(error.message || 'حدث خطأ أثناء تحميل المشرفين')
    } finally {
      setLoading(false)
    }
  }

  const handleOpenModal = (supervisor?: Supervisor) => {
    if (supervisor) {
      setEditingSupervisor(supervisor)
      setFormData({
        name: supervisor.name,
        username: supervisor.username,
        email: supervisor.email,
        phone: supervisor.phone,
        password: '', // Keep empty for security
        is_active: supervisor.is_active,
      })
    } else {
      setEditingSupervisor(null)
      setFormData({
        name: '',
        username: '',
        email: '',
        phone: '',
        password: '',
        is_active: true,
      })
    }
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingSupervisor(null)
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      password: '',
      is_active: true,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      if (editingSupervisor) {
        // Update - only send password if it's provided
        const updateData: UpdateSupervisorRequest = {
          name: formData.name,
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          is_active: formData.is_active,
        }
        if (formData.password.trim()) {
          updateData.password = formData.password
        }
        await updateSupervisor(editingSupervisor.id, updateData)
      } else {
        // Create - password is required
        await createSupervisor(formData)
      }
      handleCloseModal()
      loadSupervisors()
    } catch (error: any) {
      console.error('Error saving supervisor:', error)
      alert(error.message || 'حدث خطأ أثناء حفظ المشرف')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المشرف؟')) return
    setDeletingId(id)
    try {
      await deleteSupervisor(id)
      loadSupervisors()
    } catch (error: any) {
      console.error('Error deleting supervisor:', error)
      alert(error.message || 'حدث خطأ أثناء حذف المشرف')
    } finally {
      setDeletingId(null)
    }
  }

  const resetFilters = () => {
    setSearchTerm('')
    setIsActiveFilter('')
    setCurrentPage(1)
  }

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-6 sm:mb-8">المشرفين</h1>

      {/* Filters and Add Button */}
      <div className="bg-white rounded-xl border-2 border-primary-200 shadow-lg mb-6">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 flex-1">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                <span className="text-sm sm:text-base font-semibold text-primary-900">الفلترة:</span>
              </div>
              <div className="relative flex-1 sm:flex-none sm:w-64">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-primary-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="ابحث عن مشرف..."
                  className="w-full pr-10 pl-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm sm:text-base"
                  dir="rtl"
                />
              </div>
              <select
                value={isActiveFilter}
                onChange={(e) => {
                  setIsActiveFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="px-3 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm sm:text-base"
              >
                <option value="">جميع الحالات</option>
                <option value="true">نشط</option>
                <option value="false">غير نشط</option>
              </select>
              <button
                onClick={resetFilters}
                className="px-3 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm sm:text-base flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>إعادة تعيين</span>
              </button>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm sm:text-base font-semibold flex items-center gap-2"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>إضافة مشرف</span>
            </button>
          </div>
        </div>
      </div>

      {/* Supervisors List */}
      <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
        {loading ? (
          <div className="text-center py-12 text-primary-600">
            <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-sm sm:text-base">جاري التحميل...</p>
          </div>
        ) : supervisors.length === 0 ? (
          <div className="text-center py-12 text-primary-600">
            <User className="w-16 h-16 mx-auto mb-4 text-primary-300" />
            <p className="text-base sm:text-lg">لا يوجد مشرفين</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-primary-200">
                <thead className="bg-primary-100">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-primary-900">الاسم</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-primary-900 hidden sm:table-cell">اسم المستخدم</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-primary-900 hidden md:table-cell">البريد الإلكتروني</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-primary-900 hidden lg:table-cell">الهاتف</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-primary-900">الحالة</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm font-semibold text-primary-900">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-primary-200">
                  {supervisors.map((supervisor) => (
                    <motion.tr
                      key={supervisor.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="hover:bg-primary-50 transition-colors"
                    >
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-900 break-words">
                        <div className="font-medium">{supervisor.name}</div>
                        <div className="sm:hidden text-primary-600 text-xs mt-1">{supervisor.username}</div>
                        <div className="md:hidden sm:block text-primary-600 text-xs mt-1">{supervisor.email}</div>
                        <div className="lg:hidden md:block text-primary-600 text-xs mt-1">{supervisor.phone}</div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-700 break-words hidden sm:table-cell">{supervisor.username}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-700 break-words hidden md:table-cell">{supervisor.email}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-700 break-words hidden lg:table-cell">{supervisor.phone}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            supervisor.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {supervisor.is_active ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {supervisor.is_active ? 'نشط' : 'غير نشط'}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleOpenModal(supervisor)}
                            className="p-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(supervisor.id)}
                            disabled={deletingId === supervisor.id}
                            className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                            title="حذف"
                          >
                            {deletingId === supervisor.id ? (
                              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.total_pages > 1 && (
              <div className="p-4 sm:p-6 border-t border-primary-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm sm:text-base text-primary-600">
                  صفحة {pagination.current_page} من {pagination.total_pages} ({pagination.total} مشرف)
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={pagination.current_page === 1}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(pagination!.total_pages, p + 1))}
                    disabled={pagination.current_page === pagination.total_pages}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-4 sm:p-6 border-b border-primary-200 flex items-center justify-between">
                <h2 className="text-xl sm:text-2xl font-bold text-primary-900">
                  {editingSupervisor ? 'تعديل مشرف' : 'إضافة مشرف'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <X className="w-5 h-5 text-primary-700" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-primary-900 mb-2">الاسم *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-primary-900 mb-2">اسم المستخدم *</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-primary-900 mb-2">البريد الإلكتروني *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm sm:text-base font-semibold text-primary-900 mb-2">الهاتف *</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                      className="w-full px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-semibold text-primary-900 mb-2">
                    كلمة المرور {editingSupervisor ? '(اتركها فارغة للاحتفاظ بالكلمة الحالية)' : '*'}
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingSupervisor}
                    minLength={6}
                    className="w-full px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm sm:text-base"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-primary-600 border-2 border-primary-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm sm:text-base font-semibold text-primary-900">نشط</span>
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-semibold"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : editingSupervisor ? 'تحديث' : 'إضافة'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm sm:text-base"
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
