'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAdminStore } from '@/store/useAdminStore'
import { ArrowRight, DollarSign, Calendar, CheckCircle, XCircle, Mail, Phone, User, Award, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function TeacherDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const teacherId = parseInt(params.id as string)
  
  const { 
    getTeacher,
    getTeacherSalary,
    markPaymentAsPaid,
    getTeacherPayments,
    error 
  } = useAdminStore()
  
  const [teacher, setTeacher] = useState<any>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [salaryData, setSalaryData] = useState<any>(null)
  const [paymentsHistory, setPaymentsHistory] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'details' | 'salary' | 'payments'>('details')
  const [paymentForm, setPaymentForm] = useState({
    payment_proof_image: null as File | null,
    notes: '',
  })

  useEffect(() => {
    if (teacherId) {
      loadTeacher()
      // Set default month to current month
      const now = new Date()
      const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
      setSelectedMonth(currentMonth)
    }
  }, [teacherId])

  useEffect(() => {
    if (selectedMonth && activeTab === 'salary') {
      loadSalary()
    }
  }, [selectedMonth, activeTab, teacherId])

  useEffect(() => {
    if (activeTab === 'payments' && teacherId) {
      loadPayments()
    }
  }, [activeTab, teacherId])

  const loadTeacher = async () => {
    setIsLoading(true)
    try {
      const data = await getTeacher(teacherId)
      setTeacher(data)
    } catch (error: any) {
      alert(error.message || 'فشل تحميل بيانات المعلم')
      router.push('/admin/teacher-salary')
    } finally {
      setIsLoading(false)
    }
  }

  const loadSalary = async () => {
    if (!selectedMonth) return
    setIsLoading(true)
    try {
      const data = await getTeacherSalary(teacherId, selectedMonth)
      setSalaryData(data)
    } catch (error: any) {
      alert(error.message || 'فشل تحميل حساب الراتب')
    } finally {
      setIsLoading(false)
    }
  }

  const loadPayments = async (page: number = 1) => {
    setIsLoading(true)
    try {
      const response = await getTeacherPayments(teacherId, page)
      setPaymentsHistory(response.payments || [])
      setPagination(response.pagination)
    } catch (error: any) {
      alert(error.message || 'فشل تحميل سجل المدفوعات')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsPaid = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedMonth) {
      alert('يرجى اختيار الشهر')
      return
    }
    if (!paymentForm.payment_proof_image) {
      alert('يرجى اختيار صورة إثبات الدفع')
      return
    }
    setIsLoading(true)
    try {
      await markPaymentAsPaid(teacherId, {
        month: selectedMonth,
        payment_proof_image: paymentForm.payment_proof_image,
        notes: paymentForm.notes || undefined,
      })
      alert('تم تسجيل السداد بنجاح')
      setShowPaymentForm(false)
      setPaymentForm({ payment_proof_image: null, notes: '' })
      // Refresh salary data
      await loadSalary()
    } catch (error: any) {
      alert(error.message || 'فشل تسجيل السداد')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !teacher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!teacher) {
    return (
      <div className="text-center py-20">
        <p className="text-primary-600 mb-4">المعلم غير موجود</p>
        <Link
          href="/admin/teacher-salary"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
          العودة إلى حسابات المعلمين
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Back Button */}
      <Link
        href="/admin/teacher-salary"
        className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 mb-6 transition-colors"
      >
        <ArrowRight className="w-5 h-5" />
        <span className="font-medium">العودة إلى حسابات المعلمين</span>
      </Link>

      {/* Teacher Header */}
      <div className="bg-white rounded-xl border-2 border-primary-200 p-8 mb-6 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-300/30 via-accent-green/20 to-primary-400/30 rounded-full flex items-center justify-center overflow-hidden">
            {teacher.image ? (
              <img
                src={teacher.image}
                alt={teacher.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to initial if image fails to load
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    const fallback = document.createElement('span')
                    fallback.className = 'text-3xl font-bold text-primary-700'
                    fallback.textContent = teacher?.name?.charAt(0)
                    parent.appendChild(fallback)
                  }
                }}
              />
            ) : (
              <span className="text-3xl font-bold text-primary-700">
                {teacher?.name?.charAt(0)}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-primary-900 mb-2">{teacher.name}</h1>
            <p className="text-xl text-primary-700 mb-2">{teacher.specialization || teacher.specialization_ar || '-'}</p>
            {teacher.experience_years && (
              <p className="text-primary-600">
                <Award className="w-4 h-4 inline ml-2" />
                {teacher.experience_years} سنة خبرة
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-xl border-2 border-primary-200 p-2 mb-6 shadow-lg">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'details'
                ? 'bg-primary-600 text-white'
                : 'text-primary-700 hover:bg-primary-50'
            }`}
          >
            التفاصيل
          </button>
          <button
            onClick={() => setActiveTab('salary')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'salary'
                ? 'bg-primary-600 text-white'
                : 'text-primary-700 hover:bg-primary-50'
            }`}
          >
            حساب الراتب
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'payments'
                ? 'bg-primary-600 text-white'
                : 'text-primary-700 hover:bg-primary-50'
            }`}
          >
            سجل المدفوعات
          </button>
        </div>
      </div>

      {/* Details Tab */}
      {activeTab === 'details' && (
        <div className="bg-white rounded-xl border-2 border-primary-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">معلومات المعلم</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-primary-600 text-sm mb-1">الاسم (عربي)</label>
              <p className="text-primary-900 font-semibold text-lg">{teacher.name_ar || teacher.name}</p>
            </div>
            {teacher.name_en && (
              <div>
                <label className="block text-primary-600 text-sm mb-1">الاسم (إنجليزي)</label>
                <p className="text-primary-900 font-semibold text-lg">{teacher.name_en}</p>
              </div>
            )}
            <div>
              <label className="block text-primary-600 text-sm mb-1">التخصص (عربي)</label>
              <p className="text-primary-900 font-semibold text-lg">{teacher.specialization_ar || teacher.specialization || '-'}</p>
            </div>
            {teacher.specialization_en && (
              <div>
                <label className="block text-primary-600 text-sm mb-1">التخصص (إنجليزي)</label>
                <p className="text-primary-900 font-semibold text-lg">{teacher.specialization_en}</p>
              </div>
            )}
            <div>
              <label className="block text-primary-600 text-sm mb-1">سنوات الخبرة</label>
              <p className="text-primary-900 font-semibold text-lg">{teacher.experience_years || 0} سنة</p>
            </div>
            {teacher.created_at && (
              <div>
                <label className="block text-primary-600 text-sm mb-1">تاريخ التسجيل</label>
                <p className="text-primary-900 font-semibold text-lg">
                  {new Date(teacher.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Salary Tab */}
      {activeTab === 'salary' && (
        <div className="space-y-6">
          {/* Month Selector */}
          <div className="bg-white rounded-xl border-2 border-primary-200 p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <label className="text-primary-900 font-semibold">اختر الشهر:</label>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : salaryData ? (
            <div className="space-y-6">
              {/* Students Table */}
              {salaryData.students && salaryData.students.length > 0 ? (
                <div className="bg-white rounded-xl border-2 border-primary-200 p-8 shadow-lg">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">الطلاب</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border-2 border-primary-200">
                      <thead>
                        <tr className="bg-primary-100">
                          <th className="border border-primary-200 p-3 text-right text-primary-900 font-semibold">الطالب</th>
                          <th className="border border-primary-200 p-3 text-right text-primary-900 font-semibold">البريد</th>
                          <th className="border border-primary-200 p-3 text-right text-primary-900 font-semibold">الهاتف</th>
                          <th className="border border-primary-200 p-3 text-center text-primary-900 font-semibold">عدد الحصص</th>
                          <th className="border border-primary-200 p-3 text-center text-primary-900 font-semibold">إجمالي الساعات</th>
                          <th className="border border-primary-200 p-3 text-center text-primary-900 font-semibold">سعر الساعة</th>
                          <th className="border border-primary-200 p-3 text-center text-primary-900 font-semibold">المبلغ الإجمالي</th>
                        </tr>
                      </thead>
                      <tbody>
                        {salaryData.students.map((student: any) => (
                          <tr key={student.id} className="hover:bg-primary-50">
                            <td className="border border-primary-200 p-3 text-primary-900 font-medium">{student.name}</td>
                            <td className="border border-primary-200 p-3 text-primary-700">
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-primary-500" />
                                {student.email}
                              </div>
                            </td>
                            <td className="border border-primary-200 p-3 text-primary-700">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-primary-500" />
                                {student.phone}
                              </div>
                            </td>
                            <td className="border border-primary-200 p-3 text-center text-primary-700">{student.sessions_count}</td>
                            <td className="border border-primary-200 p-3 text-center text-primary-700">{student.total_hours.toFixed(2)}</td>
                            <td className="border border-primary-200 p-3 text-center text-primary-700">{student.hourly_rate.toFixed(2)} ر.س</td>
                            <td className="border border-primary-200 p-3 text-center font-semibold text-primary-900">{student.total_amount.toFixed(2)} ر.س</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl border-2 border-primary-200 p-8 shadow-lg text-center py-12 text-primary-600">
                  لا توجد حصص مكتملة لهذا الشهر
                </div>
              )}

              {/* Summary */}
              {salaryData.summary && (
                <div className="bg-gradient-to-r from-primary-50 to-accent-green/10 rounded-xl border-2 border-primary-200 p-8 shadow-lg">
                  <h3 className="text-lg font-semibold text-primary-900 mb-4">الملخص</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-primary-600 text-sm mb-1">إجمالي الطلاب</p>
                      <p className="text-primary-900 font-bold text-2xl">{salaryData.summary.total_students}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-primary-600 text-sm mb-1">إجمالي الحصص</p>
                      <p className="text-primary-900 font-bold text-2xl">{salaryData.summary.total_sessions}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                      <p className="text-primary-600 text-sm mb-1">إجمالي الساعات</p>
                      <p className="text-primary-900 font-bold text-2xl">{salaryData.summary.total_hours.toFixed(2)}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg border-2 border-accent-green">
                      <p className="text-primary-600 text-sm mb-1">المبلغ الإجمالي</p>
                      <p className="font-bold text-2xl text-accent-green">{salaryData.summary.total_amount.toFixed(2)} ر.س</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Status */}
              {salaryData.payment ? (
                <div className="bg-accent-green/10 rounded-xl border-2 border-accent-green p-8 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-6 h-6 text-accent-green" />
                    <h3 className="text-lg font-semibold text-primary-900">تم السداد</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-primary-600 text-sm mb-1">تاريخ السداد</p>
                      <p className="text-primary-900 font-medium">
                        {salaryData.payment.paid_at 
                          ? new Date(salaryData.payment.paid_at).toLocaleDateString('ar-EG', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-primary-600 text-sm mb-1">المبلغ المدفوع</p>
                      <p className="text-primary-900 font-bold text-xl">{salaryData.payment.total_amount.toFixed(2)} ر.س</p>
                    </div>
                  </div>
                  {salaryData.payment.notes && (
                    <div className="mt-4">
                      <p className="text-primary-600 text-sm mb-1">ملاحظات</p>
                      <p className="text-primary-700">{salaryData.payment.notes}</p>
                    </div>
                  )}
                  {salaryData.payment.payment_proof_image && (
                    <div className="mt-4">
                      <a
                        href={salaryData.payment.payment_proof_image}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-2 underline"
                      >
                        عرض إثبات الدفع
                      </a>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 rounded-xl border-2 border-yellow-200 p-8 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <XCircle className="w-6 h-6 text-yellow-600" />
                    <h3 className="text-lg font-semibold text-primary-900">لم يتم السداد بعد</h3>
                  </div>
                  {!showPaymentForm ? (
                    <button
                      onClick={() => setShowPaymentForm(true)}
                      className="mt-4 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      تسجيل السداد
                    </button>
                  ) : (
                    <form onSubmit={handleMarkAsPaid} className="mt-4 space-y-4">
                      <div>
                        <label className="block text-primary-900 font-semibold mb-2 text-right">صورة إثبات الدفع *</label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setPaymentForm({ ...paymentForm, payment_proof_image: e.target.files?.[0] || null })}
                          className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                          required
                        />
                        <p className="text-xs text-primary-600 mt-1">صورة إثبات الدفع (jpeg, png, jpg, gif, الحد الأقصى: 5MB)</p>
                      </div>
                      <div>
                        <label className="block text-primary-900 font-semibold mb-2 text-right">ملاحظات</label>
                        <textarea
                          value={paymentForm.notes}
                          onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                          rows={3}
                          className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                          dir="rtl"
                          placeholder="ملاحظات اختيارية..."
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isLoading ? 'جاري الحفظ...' : 'تسجيل السداد'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowPaymentForm(false)
                            setPaymentForm({ payment_proof_image: null, notes: '' })
                          }}
                          className="flex-1 px-6 py-3 border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-all"
                        >
                          إلغاء
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border-2 border-primary-200 p-8 shadow-lg text-center py-12 text-primary-600">
              اختر شهراً لعرض حساب الراتب
            </div>
          )}
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-xl border-2 border-primary-200 p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-primary-900 mb-6">سجل المدفوعات</h2>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : paymentsHistory.length === 0 ? (
            <div className="text-center py-12 text-primary-600">
              لا توجد مدفوعات مسجلة
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                {paymentsHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="bg-primary-50 p-6 rounded-lg border-2 border-primary-200 hover:border-primary-300 transition-all"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-primary-900 mb-2">{payment.month}</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-primary-600 text-sm mb-1">المبلغ</p>
                            <p className="text-primary-900 font-bold text-xl">{payment.total_amount.toFixed(2)} ر.س</p>
                          </div>
                          {payment.paid_at && (
                            <div>
                              <p className="text-primary-600 text-sm mb-1">تاريخ السداد</p>
                              <p className="text-primary-700">
                                {new Date(payment.paid_at).toLocaleDateString('ar-EG', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        {payment.is_paid ? (
                          <CheckCircle className="w-8 h-8 text-accent-green" />
                        ) : (
                          <XCircle className="w-8 h-8 text-red-500" />
                        )}
                      </div>
                    </div>
                    {payment.notes && (
                      <div className="mt-4 pt-4 border-t border-primary-200">
                        <p className="text-primary-600 text-sm mb-1">ملاحظات</p>
                        <p className="text-primary-700">{payment.notes}</p>
                      </div>
                    )}
                    {payment.payment_proof_image && (
                      <div className="mt-4">
                        <a
                          href={payment.payment_proof_image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-800 inline-flex items-center gap-2 underline"
                        >
                          عرض إثبات الدفع
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.total_pages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4 border-t border-primary-200">
                  <button
                    onClick={() => loadPayments((pagination.current_page || 1) - 1)}
                    disabled={!pagination.current_page || pagination.current_page <= 1}
                    className="px-4 py-2 border-2 border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  <span className="px-4 py-2 text-primary-700">
                    صفحة {pagination.current_page || 1} من {pagination.total_pages || 1}
                  </span>
                  <button
                    onClick={() => loadPayments((pagination.current_page || 1) + 1)}
                    disabled={!pagination.current_page || pagination.current_page >= (pagination.total_pages || 1)}
                    className="px-4 py-2 border-2 border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

