'use client'

import { useEffect, useState } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { Users, BookOpen, GraduationCap, MessageSquare, Award, Calendar, Send, X } from 'lucide-react'
import Link from 'next/link'
import { sendNotification, type RecipientType } from '@/lib/api/notifications'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminDashboard() {
  const { 
    students, 
    teachers, 
    packages, 
    reviews, 
    honorBoard,
    studentsMeta,
    teachersMeta,
    packagesMeta,
    reviewsMeta,
    honorBoardMeta,
    fetchStudents,
    fetchTeachers,
    fetchPackages,
    fetchReviews,
    fetchHonorBoard
  } = useAdminStore()

  const [showNotificationModal, setShowNotificationModal] = useState(false)
  const [notificationForm, setNotificationForm] = useState({
    title: '',
    description: '',
    recipient_type: 'all' as RecipientType,
  })
  const [sendingNotification, setSendingNotification] = useState(false)

  // Load all data on mount
  useEffect(() => {
    fetchStudents()
    fetchTeachers()
    fetchPackages()
    fetchReviews()
    fetchHonorBoard()
  }, [fetchStudents, fetchTeachers, fetchPackages, fetchReviews, fetchHonorBoard])

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!notificationForm.title.trim() || !notificationForm.description.trim()) {
      alert('يرجى إدخال العنوان والوصف')
      return
    }
    setSendingNotification(true)
    try {
      const res = await sendNotification({
        title: notificationForm.title.trim(),
        description: notificationForm.description.trim(),
        recipient_type: notificationForm.recipient_type,
      })
      alert(`تم إرسال الإشعار بنجاح. تم إنشاء: ${res.notifications_created}، تم إرسالها: ${res.notifications_sent}${res.notifications_failed ? `، فشل: ${res.notifications_failed}` : ''}`)
      setShowNotificationModal(false)
      setNotificationForm({ title: '', description: '', recipient_type: 'all' })
    } catch (err: any) {
      alert(err.message || 'فشل إرسال الإشعار')
    } finally {
      setSendingNotification(false)
    }
  }

  const stats = [
    {
      title: 'إجمالي الطلاب',
      value: (studentsMeta?.total || students?.length || 0).toString(),
      icon: <Users className="w-full h-full" />,
      color: 'bg-blue-500',
      href: '/admin/students',
    },
    {
      title: 'المعلمين',
      value: (teachersMeta?.total || teachers?.length || 0).toString(),
      icon: <GraduationCap className="w-full h-full" />,
      color: 'bg-green-500',
      href: '/admin/teachers',
    },
    {
      title: 'الباقات',
      value: (packagesMeta?.total || packages?.length || 0).toString(),
      icon: <BookOpen className="w-full h-full" />,
      color: 'bg-purple-500',
      href: '/admin/packages',
    },
    {
      title: 'آراء الطلاب',
      value: (reviewsMeta?.total || reviews?.length || 0).toString(),
      icon: <MessageSquare className="w-full h-full" />,
      color: 'bg-yellow-500',
      href: '/admin/testimonials',
    },
    {
      title: 'لوحة الشرف',
      value: (honorBoardMeta?.total || honorBoard?.length || 0).toString(),
      icon: <Award className="w-full h-full" />,
      color: 'bg-orange-500',
      href: '/admin/honor-board',
    },
    {
      title: 'الحصص',
      value: 'عرض',
      icon: <Calendar className="w-full h-full" />,
      color: 'bg-indigo-500',
      href: '/admin/sessions',
    },
  ]

  return (
    <div className="px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900">لوحة التحكم</h1>
        <button
          type="button"
          onClick={() => setShowNotificationModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors font-medium shadow-lg"
        >
          <Send className="w-5 h-5" />
          إرسال إشعار
        </button>
      </div>

      {/* Send Notification Modal */}
      <AnimatePresence>
        {showNotificationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => !sendingNotification && setShowNotificationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl border-2 border-primary-200 w-full max-w-md overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 sm:p-6 border-b border-primary-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary-900">إرسال إشعار</h2>
                <button
                  type="button"
                  onClick={() => !sendingNotification && setShowNotificationModal(false)}
                  className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleSendNotification} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">عنوان الإشعار *</label>
                  <input
                    type="text"
                    value={notificationForm.title}
                    onChange={(e) => setNotificationForm((f) => ({ ...f, title: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-0"
                    placeholder="عنوان الإشعار"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">الوصف *</label>
                  <textarea
                    value={notificationForm.description}
                    onChange={(e) => setNotificationForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 focus:ring-0 min-h-[100px]"
                    placeholder="وصف الإشعار"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">المستلمون *</label>
                  <select
                    value={notificationForm.recipient_type}
                    onChange={(e) => setNotificationForm((f) => ({ ...f, recipient_type: e.target.value as RecipientType }))}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500"
                  >
                    <option value="all">الجميع</option>
                    <option value="students">الطلاب فقط</option>
                    <option value="teachers">المعلمون فقط</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNotificationModal(false)}
                    disabled={sendingNotification}
                    className="flex-1 py-2.5 border-2 border-primary-300 text-primary-700 rounded-lg font-medium hover:bg-primary-50 disabled:opacity-50"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={sendingNotification}
                    className="flex-1 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    {sendingNotification ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        جاري الإرسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        إرسال
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white p-4 sm:p-6 rounded-xl border-2 border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-400 group"
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className={`${stat.color} p-2 sm:p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                <div className="w-6 h-6 sm:w-8 sm:h-8">{stat.icon}</div>
              </div>
            </div>
            <h3 className="text-primary-700 text-xs sm:text-sm mb-2">{stat.title}</h3>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 break-words">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Students Table */}
      <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
        <div className="p-4 sm:p-6 border-b border-primary-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
          <h2 className="text-xl sm:text-2xl font-bold text-primary-900">الطلاب المسجلون</h2>
          <Link
            href="/admin/students"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            عرض الكل →
          </Link>
        </div>
        <div className="overflow-x-auto -mx-2 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-primary-200">
              <thead className="bg-primary-100">
                <tr>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm text-primary-900 font-semibold">الاسم</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm text-primary-900 font-semibold hidden sm:table-cell">البريد</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm text-primary-900 font-semibold hidden md:table-cell">الهاتف</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm text-primary-900 font-semibold hidden lg:table-cell">الباقة</th>
                  <th className="px-3 sm:px-6 py-3 sm:py-4 text-right text-xs sm:text-sm text-primary-900 font-semibold">الجنس</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-primary-200">
                {!students || students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 sm:px-6 py-6 sm:py-8 text-center text-sm sm:text-base text-primary-600">
                      لا يوجد طلاب مسجلون بعد
                    </td>
                  </tr>
                ) : (
                  students.slice(0, 5).map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-primary-200 hover:bg-primary-50 transition-colors"
                    >
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-900 break-words">
                        <div className="font-medium">{student.name}</div>
                        <div className="sm:hidden text-primary-600 text-xs mt-1">{student.email}</div>
                        <div className="md:hidden sm:block text-primary-600 text-xs mt-1">{student.phone}</div>
                      </td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-700 break-words hidden sm:table-cell">{student.email}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-700 break-words hidden md:table-cell">{student.phone}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-700 break-words hidden lg:table-cell">{student.package?.name || '-'}</td>
                      <td className="px-3 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm text-primary-700">
                        <div>{student.gender_label || (student.gender === 'male' ? 'ذكر' : 'أنثى')}</div>
                        <div className="lg:hidden text-primary-600 text-xs mt-1">{student.package?.name || '-'}</div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
