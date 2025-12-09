'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { Search, Eye, X, Edit, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const DAYS_OF_WEEK = [
  { value: 'saturday', label: 'السبت', arName: 'السبت' },
  { value: 'sunday', label: 'الأحد', arName: 'الأحد' },
  { value: 'monday', label: 'الإثنين', arName: 'الإثنين' },
  { value: 'tuesday', label: 'الثلاثاء', arName: 'الثلاثاء' },
  { value: 'wednesday', label: 'الأربعاء', arName: 'الأربعاء' },
  { value: 'thursday', label: 'الخميس', arName: 'الخميس' },
  { value: 'friday', label: 'الجمعة', arName: 'الجمعة' },
]

export default function WebsiteStudentsPage() {
  const { 
    students, 
    isLoadingStudents, 
    fetchStudents, 
    getStudent,
    updateStudent,
    deleteStudent,
    packages,
    fetchPackages,
    teachers,
    fetchTeachers,
    error 
  } = useAdminStore()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [viewingId, setViewingId] = useState<number | null>(null)
  const [viewedStudent, setViewedStudent] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '' as 'male' | 'female' | '',
    package_id: '',
    teacher_id: '',
    hour: '',
    monthly_sessions: '',
    weekly_sessions: '',
    weekly_days: [] as string[],
    weekly_schedule: {} as Record<string, string>,
    useWeeklySchedule: false,
    session_duration: '',
    hourly_rate: '',
    notes: '',
    password: '',
  })

  useEffect(() => {
    // Fetch only website students
    fetchStudents({ type: 'website' })
    fetchPackages()
    fetchTeachers()
  }, [fetchStudents, fetchPackages, fetchTeachers])

  const handleViewStudent = async (id: number) => {
    try {
      const student = await getStudent(id)
      setViewedStudent(student)
      setViewingId(id)
      setShowViewModal(true)
    } catch (error: any) {
      alert(error.message || 'فشل تحميل بيانات الطالب')
    }
  }

  const handleEdit = (student: any) => {
    setEditingId(student.id)
    // Check if student has weekly_schedule (takes precedence)
    const hasWeeklySchedule = student.weekly_schedule && typeof student.weekly_schedule === 'object' && Object.keys(student.weekly_schedule).length > 0
    setEditForm({
      name: student.name || '',
      email: student.email || '',
      phone: student.phone || '',
      age: student.age?.toString() || '',
      gender: student.gender || '',
      package_id: student.package_id?.toString() || '',
      teacher_id: student.teacher_id?.toString() || '',
      hour: student.hour || '',
      monthly_sessions: student.monthly_sessions?.toString() || '',
      weekly_sessions: student.weekly_sessions?.toString() || '',
      weekly_days: Array.isArray(student.weekly_days) ? [...student.weekly_days] : [],
      weekly_schedule: hasWeeklySchedule ? { ...student.weekly_schedule } : {},
      useWeeklySchedule: hasWeeklySchedule,
      session_duration: student.session_duration?.toString() || '',
      hourly_rate: student.hourly_rate?.toString() || '',
      notes: student.notes || '',
      password: '', // Don't populate password field for security
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setIsSubmitting(true)
      try {
        // Build request data - weekly_schedule takes precedence over hour and weekly_days
        const updateData: any = {
          name: editForm.name,
          email: editForm.email || undefined,
          phone: editForm.phone,
          age: editForm.age ? parseInt(editForm.age) : undefined,
          gender: editForm.gender as 'male' | 'female',
          package_id: editForm.package_id ? parseInt(editForm.package_id) : undefined,
          teacher_id: editForm.teacher_id ? parseInt(editForm.teacher_id) : undefined,
          monthly_sessions: editForm.monthly_sessions ? parseInt(editForm.monthly_sessions) : undefined,
          weekly_sessions: editForm.weekly_sessions ? parseInt(editForm.weekly_sessions) : undefined,
          session_duration: editForm.session_duration ? parseInt(editForm.session_duration) : undefined,
          hourly_rate: editForm.hourly_rate ? parseFloat(editForm.hourly_rate) : undefined,
          notes: editForm.notes || undefined,
          password: editForm.password || undefined,
        }

        // If using weekly_schedule, send it (takes precedence)
        if (editForm.useWeeklySchedule && Object.keys(editForm.weekly_schedule).length > 0) {
          updateData.weekly_schedule = editForm.weekly_schedule
        } else {
          // Otherwise, use hour and weekly_days
          if (editForm.hour) updateData.hour = editForm.hour
          if (editForm.weekly_days.length > 0) updateData.weekly_days = editForm.weekly_days
        }

        await updateStudent(editingId, updateData)
        setEditingId(null)
        setEditForm({
          name: '',
          email: '',
          phone: '',
          age: '',
          gender: '' as 'male' | 'female' | '',
          package_id: '',
          teacher_id: '',
          hour: '',
          monthly_sessions: '',
          weekly_sessions: '',
          weekly_days: [],
          weekly_schedule: {},
          useWeeklySchedule: false,
          session_duration: '',
          hourly_rate: '',
          notes: '',
          password: '',
        })
        setShowEditModal(false)
        // Refresh the list
        fetchStudents({ type: 'website' })
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء التحديث')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingId(null)
    setEditForm({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '' as 'male' | 'female' | '',
      package_id: '',
      teacher_id: '',
      hour: '',
      monthly_sessions: '',
      weekly_sessions: '',
      weekly_days: [],
      weekly_schedule: {},
      useWeeklySchedule: false,
      session_duration: '',
      hourly_rate: '',
      notes: '',
      password: '',
    })
  }

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      try {
        await deleteStudent(id)
        // Refresh the list
        fetchStudents({ type: 'website' })
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء الحذف')
      }
    }
  }

  const filteredStudents = students.filter((student) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      student.name.toLowerCase().includes(search) ||
      student.email?.toLowerCase().includes(search) ||
      student.phone.toLowerCase().includes(search) ||
      student.package?.name.toLowerCase().includes(search) ||
      student.teacher?.name.toLowerCase().includes(search)
    )
  })

  // Filter to only show website students (double check)
  const websiteStudents = filteredStudents.filter(student => student.type === 'website')

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary-900">طلاب الموقع</h1>
        <div className="text-primary-600 font-medium">إجمالي: {websiteStudents.length}</div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl border-2 border-primary-200 p-4 mb-6 shadow-lg">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن طالب..."
            className="w-full pr-12 pl-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
            dir="rtl"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      {isLoadingStudents ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-100">
                <tr>
                  <th className="px-6 py-4 text-right text-primary-900 font-semibold">الاسم</th>
                  <th className="px-6 py-4 text-right text-primary-900 font-semibold">البريد</th>
                  <th className="px-6 py-4 text-right text-primary-900 font-semibold">الهاتف</th>
                  <th className="px-6 py-4 text-right text-primary-900 font-semibold">العمر</th>
                  <th className="px-6 py-4 text-right text-primary-900 font-semibold">الجنس</th>
                  <th className="px-6 py-4 text-right text-primary-900 font-semibold">الباقة</th>
                  <th className="px-6 py-4 text-right text-primary-900 font-semibold">المعلم</th>
                  <th className="px-6 py-4 text-center text-primary-900 font-semibold">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {websiteStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-8 text-center text-primary-600">
                      {searchTerm ? 'لا توجد نتائج' : 'لا يوجد طلاب مسجلون من الموقع بعد'}
                    </td>
                  </tr>
                ) : (
                  websiteStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-primary-200 hover:bg-primary-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-primary-900">{student.name}</td>
                      <td className="px-6 py-4 text-primary-700">{student.email || '-'}</td>
                      <td className="px-6 py-4 text-primary-700">{student.phone}</td>
                      <td className="px-6 py-4 text-primary-700">{student.age || '-'}</td>
                      <td className="px-6 py-4 text-primary-700">{student.gender_label || (student.gender === 'male' ? 'ذكر' : 'أنثى')}</td>
                      <td className="px-6 py-4 text-primary-700">{student.package?.name || '-'}</td>
                      <td className="px-6 py-4 text-primary-700">{student.teacher?.name || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleViewStudent(student.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Student Details Modal */}
      <AnimatePresence>
        {showViewModal && viewedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">تفاصيل الطالب</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">الاسم</label>
                    <p className="text-primary-900 font-semibold text-lg">{viewedStudent.name}</p>
                  </div>
                  {viewedStudent.email && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">البريد الإلكتروني</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.email}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">رقم الهاتف</label>
                    <p className="text-primary-900 font-semibold text-lg">{viewedStudent.phone}</p>
                  </div>
                  {viewedStudent.age && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">العمر</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.age} سنة</p>
                    </div>
                  )}
                  {viewedStudent.gender_label && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">الجنس</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.gender_label}</p>
                    </div>
                  )}
                  {viewedStudent.package && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">الباقة</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.package.name}</p>
                    </div>
                  )}
                  {viewedStudent.teacher && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">المعلم</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.teacher.name}</p>
                    </div>
                  )}
                  {viewedStudent.hour && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">وقت الحصة</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.hour}</p>
                    </div>
                  )}
                  {viewedStudent.monthly_sessions && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">عدد الحصص الشهرية</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.monthly_sessions}</p>
                    </div>
                  )}
                  {viewedStudent.weekly_sessions && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">عدد الحصص الأسبوعية</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.weekly_sessions}</p>
                    </div>
                  )}
                  {viewedStudent.session_duration && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">مدة الحصة (دقيقة)</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.session_duration}</p>
                    </div>
                  )}
                  {viewedStudent.hourly_rate && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">سعر الساعة</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.hourly_rate} ر.س</p>
                    </div>
                  )}
                  {viewedStudent.created_at && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">تاريخ التسجيل</label>
                      <p className="text-primary-900 font-semibold text-lg">
                        {new Date(viewedStudent.created_at).toLocaleDateString('ar-EG', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                </div>

                {viewedStudent.weekly_schedule && Object.keys(viewedStudent.weekly_schedule).length > 0 && (
                  <div>
                    <label className="block text-primary-600 text-sm mb-2">الجدول الأسبوعي</label>
                    <div className="bg-primary-50 rounded-lg p-4">
                      {Object.entries(viewedStudent.weekly_schedule).map(([day, time]) => (
                        <div key={day} className="flex items-center justify-between py-2 border-b border-primary-200 last:border-0">
                          <span className="text-primary-900 font-medium">{day}</span>
                          <span className="text-primary-700">{time as string}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {viewedStudent.weekly_days && viewedStudent.weekly_days.length > 0 && (
                  <div>
                    <label className="block text-primary-600 text-sm mb-2">أيام الأسبوع</label>
                    <div className="flex flex-wrap gap-2">
                      {viewedStudent.weekly_days.map((day: string) => {
                        const dayObj = DAYS_OF_WEEK.find(d => d.value === day)
                        return (
                          <span
                            key={day}
                            className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm"
                          >
                            {dayObj?.label || day}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {viewedStudent.notes && (
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">ملاحظات</label>
                    <p className="text-primary-900 bg-primary-50 rounded-lg p-4">{viewedStudent.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Student Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={handleCloseEditModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">تعديل بيانات الطالب</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الاسم الكامل</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">رقم الهاتف</label>
                    <input
                      type="tel"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">العمر (اختياري)</label>
                    <input
                      type="number"
                      value={editForm.age}
                      onChange={(e) => setEditForm({ ...editForm, age: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الجنس</label>
                    <select
                      value={editForm.gender}
                      onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as 'male' | 'female' })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      required
                    >
                      <option value="">اختر الجنس</option>
                      <option value="male">ذكر</option>
                      <option value="female">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الباقة</label>
                    <select
                      value={editForm.package_id}
                      onChange={(e) => setEditForm({ ...editForm, package_id: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                    >
                      <option value="">اختر الباقة (اختياري)</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم</label>
                    <select
                      value={editForm.teacher_id}
                      onChange={(e) => setEditForm({ ...editForm, teacher_id: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                    >
                      <option value="">اختر المعلم (اختياري)</option>
                      {teachers.map((teacher) => (
                        <option key={teacher.id} value={teacher.id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">وقت الحصة</label>
                    <input
                      type="time"
                      value={editForm.hour}
                      onChange={(e) => setEditForm({ ...editForm, hour: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      placeholder="HH:mm"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">عدد الحصص الشهرية</label>
                    <input
                      type="number"
                      value={editForm.monthly_sessions}
                      onChange={(e) => setEditForm({ ...editForm, monthly_sessions: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">عدد الحصص الأسبوعية</label>
                    <input
                      type="number"
                      value={editForm.weekly_sessions}
                      onChange={(e) => setEditForm({ ...editForm, weekly_sessions: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">مدة الحصة (بالدقائق)</label>
                    <input
                      type="number"
                      value={editForm.session_duration}
                      onChange={(e) => setEditForm({ ...editForm, session_duration: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">سعر الساعة (ر.س)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={editForm.hourly_rate}
                      onChange={(e) => setEditForm({ ...editForm, hourly_rate: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="0"
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-primary-900 font-semibold">جدول الأسبوع</label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editForm.useWeeklySchedule}
                        onChange={(e) => setEditForm({ ...editForm, useWeeklySchedule: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-primary-700 text-sm">استخدام جدول متقدم (وقت مختلف لكل يوم)</span>
                    </label>
                  </div>
                  
                  {editForm.useWeeklySchedule ? (
                    <div className="space-y-3 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                      <p className="text-sm text-primary-600 mb-3">حدد وقت الحصة لكل يوم (اختياري)</p>
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day.value} className="flex items-center gap-3">
                          <label className="w-24 text-primary-700 font-medium">{day.label}</label>
                          <input
                            type="time"
                            value={editForm.weekly_schedule[day.arName] || ''}
                            onChange={(e) => {
                              const newSchedule = { ...editForm.weekly_schedule }
                              if (e.target.value) {
                                newSchedule[day.arName] = e.target.value
                              } else {
                                delete newSchedule[day.arName]
                              }
                              setEditForm({ ...editForm, weekly_schedule: newSchedule })
                            }}
                            className="flex-1 px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                            placeholder="اختياري"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-primary-900 font-semibold mb-2 text-right">وقت الحصة الافتراضي</label>
                        <input
                          type="time"
                          value={editForm.hour}
                          onChange={(e) => setEditForm({ ...editForm, hour: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                          placeholder="HH:mm"
                        />
                      </div>
                      <div>
                        <label className="block text-primary-900 font-semibold mb-2 text-right">أيام الأسبوع</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {DAYS_OF_WEEK.map((day) => (
                            <label key={day.value} className="flex items-center gap-2 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={editForm.weekly_days.includes(day.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setEditForm({
                                      ...editForm,
                                      weekly_days: [...editForm.weekly_days, day.value],
                                    })
                                  } else {
                                    setEditForm({
                                      ...editForm,
                                      weekly_days: editForm.weekly_days.filter((d) => d !== day.value),
                                    })
                                  }
                                }}
                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                              />
                              <span className="text-primary-700">{day.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">كلمة المرور (اختياري)</label>
                  <input
                    type="password"
                    value={editForm.password}
                    onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    placeholder="اتركه فارغاً للحفاظ على كلمة المرور الحالية"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">ملاحظات</label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                    placeholder="ملاحظات اختيارية..."
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
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
