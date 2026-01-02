'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { Plus, Edit, Trash2, Search, X, Eye, Calendar, CheckCircle, Clock, Filter, ChevronDown, ChevronUp } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SearchableTeacherSelect from '@/components/admin/SearchableTeacherSelect'

const DAYS_OF_WEEK = [
  { value: 'saturday', label: 'السبت', arName: 'السبت' },
  { value: 'sunday', label: 'الأحد', arName: 'الأحد' },
  { value: 'monday', label: 'الإثنين', arName: 'الإثنين' },
  { value: 'tuesday', label: 'الثلاثاء', arName: 'الثلاثاء' },
  { value: 'wednesday', label: 'الأربعاء', arName: 'الأربعاء' },
  { value: 'thursday', label: 'الخميس', arName: 'الخميس' },
  { value: 'friday', label: 'الجمعة', arName: 'الجمعة' },
]

export default function StudentsPage() {
  const { 
    students, 
    studentsMeta,
    isLoadingStudents, 
    fetchStudents, 
    getStudent,
    addStudent, 
    deleteStudent, 
    updateStudent,
    updateSubscriptionPaymentStatus,
    sessions,
    isLoadingSessions,
    fetchSessions,
    addSession,
    updateSession,
    completeSession,
    deleteSession,
    packages,
    fetchPackages,
    teachers,
    fetchTeachers,
    error 
  } = useAdminStore()
  
  // Filters
  const [filters, setFilters] = useState({
    type: '' as 'website' | 'admin' | 'app' | '',
    package_id: '',
    gender: '' as 'male' | 'female' | '',
    teacher_id: '',
    search: '',
    unpaid_months_count: '',
    payment_status: '' as 'all_paid' | 'has_unpaid' | '',
    is_paused: '' as 'true' | 'false' | '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [filtersExpanded, setFiltersExpanded] = useState(false)
  
  // Student modals
  const [editingId, setEditingId] = useState<number | null>(null)
  const [viewingId, setViewingId] = useState<number | null>(null)
  const [viewedStudent, setViewedStudent] = useState<any>(null)
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
    weekly_schedule: {} as Record<string, string>, // Object with Arabic day names as keys and times as values
    useWeeklySchedule: false, // Toggle between weekly_days/hour and weekly_schedule
    session_duration: '',
    hourly_rate: '',
    notes: '',
    password: '',
    trial_session_attendance: '' as 'not_booked' | 'booked' | 'attended' | '',
    monthly_subscription_price: '',
    country: '',
    currency: '',
    past_months_count: '',
    paid_months_count: '',
    subscription_start_date: '',
    paid_subscriptions_count: '',
  })
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newStudent, setNewStudent] = useState({
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
    weekly_schedule: {} as Record<string, string>, // Object with Arabic day names as keys and times as values
    useWeeklySchedule: false, // Toggle between weekly_days/hour and weekly_schedule
    session_duration: '',
    hourly_rate: '',
    notes: '',
    password: '',
    trial_session_attendance: 'not_booked' as 'not_booked' | 'booked' | 'attended',
    monthly_subscription_price: '',
    country: '',
    currency: '',
    past_months_count: '',
    paid_months_count: '',
    subscription_start_date: '',
  })

  // Session modals
  const [showSessionsModal, setShowSessionsModal] = useState(false)
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null)
  const [showAddSessionModal, setShowAddSessionModal] = useState(false)
  const [editingSessionId, setEditingSessionId] = useState<number | null>(null)
  const [sessionForm, setSessionForm] = useState({
    student_id: '',
    teacher_id: '',
    session_date: '',
    session_time: '',
    day_of_week: '',
    notes: '',
  })

  useEffect(() => {
    fetchStudents()
    fetchPackages()
    fetchTeachers(1, 1000)
  }, [fetchStudents, fetchPackages, fetchTeachers])

  // Apply filters when they change
  useEffect(() => {
    setCurrentPage(1) // Reset to first page when filters change
  }, [filters.type, filters.package_id, filters.gender, filters.teacher_id, filters.search, filters.unpaid_months_count, filters.payment_status, filters.is_paused])

  useEffect(() => {
    const apiFilters: any = {}
    if (filters.type) apiFilters.type = filters.type
    if (filters.package_id) apiFilters.package_id = parseInt(filters.package_id)
    if (filters.gender) apiFilters.gender = filters.gender
    if (filters.teacher_id) apiFilters.teacher_id = parseInt(filters.teacher_id)
    if (filters.search) apiFilters.search = filters.search
    if (filters.unpaid_months_count) apiFilters.unpaid_months_count = parseInt(filters.unpaid_months_count)
    if (filters.payment_status) apiFilters.payment_status = filters.payment_status
    if (filters.is_paused) apiFilters.is_paused = filters.is_paused === 'true'
    apiFilters.page = currentPage
    apiFilters.per_page = 15
    
    fetchStudents(apiFilters)
  }, [currentPage, filters.type, filters.package_id, filters.gender, filters.teacher_id, filters.search, filters.unpaid_months_count, filters.payment_status, filters.is_paused, fetchStudents])

  // Students are now filtered on the API side, so we use them directly
  const filteredStudents = students

  const handleViewStudent = async (id: number) => {
    try {
      const student = await getStudent(id)
      setViewedStudent(student)
      setViewingId(id)
      setShowViewModal(true)
      // Load sessions for this student
      await fetchSessions({ student_id: id, per_page: 10000 })
    } catch (error: any) {
      alert(error.message || 'فشل تحميل بيانات الطالب')
    }
  }

  const handleToggleSubscriptionPayment = async (subscriptionId: number, currentPaidStatus: boolean) => {
    try {
      const newPaidStatus = !currentPaidStatus
      await updateSubscriptionPaymentStatus(subscriptionId, newPaidStatus)
      // Refresh the student data to show updated subscription status
      if (viewingId) {
        const updatedStudent = await getStudent(viewingId)
        setViewedStudent(updatedStudent)
      }
    } catch (error: any) {
      alert(error.message || 'فشل تحديث حالة الدفع')
    }
  }

  const [editingStudentHasSubscriptions, setEditingStudentHasSubscriptions] = useState(false)

  const handleEdit = async (student: any) => {
    try {
      setEditingId(student.id)
      // Fetch fresh student data to get complete information
      const fullStudent = await getStudent(student.id)
      
      // Check if student has subscriptions
      const hasSubscriptions = !!(fullStudent.subscriptions && Array.isArray(fullStudent.subscriptions) && fullStudent.subscriptions.length > 0)
      setEditingStudentHasSubscriptions(hasSubscriptions)
      
      // Check if student has weekly_schedule (takes precedence)
      const hasWeeklySchedule = !!(fullStudent.weekly_schedule && typeof fullStudent.weekly_schedule === 'object' && Object.keys(fullStudent.weekly_schedule).length > 0)
      
      // Get subscription start date from earliest subscription if available
      let subscriptionStartDate = ''
      if (hasSubscriptions && Array.isArray(fullStudent.subscriptions)) {
        // Sort subscriptions by start_date and get the earliest one
        const sortedSubscriptions = [...fullStudent.subscriptions]
          .filter((sub: any) => sub.start_date) // Filter out subscriptions without start_date
          .sort((a: any, b: any) => {
            const dateA = new Date(a.start_date).getTime()
            const dateB = new Date(b.start_date).getTime()
            return dateA - dateB
          })
        if (sortedSubscriptions.length > 0) {
          subscriptionStartDate = sortedSubscriptions[0].start_date
        }
      }
      
      // Get subscription statistics
      const paidMonthsCount = fullStudent.subscriptions_statistics?.paid_subscriptions?.toString() || ''
      const totalSubscriptions = fullStudent.subscriptions_statistics?.total_subscriptions || 0
      const unpaidSubscriptions = fullStudent.subscriptions_statistics?.unpaid_subscriptions || 0
      
      setEditForm({
        name: fullStudent.name || '',
        email: fullStudent.email || '',
        phone: fullStudent.phone || '',
        age: fullStudent.age?.toString() || '',
        gender: fullStudent.gender || '',
        package_id: fullStudent.package_id?.toString() || '',
        teacher_id: fullStudent.teacher_id?.toString() || '',
        hour: fullStudent.hour || '',
        monthly_sessions: fullStudent.monthly_sessions?.toString() || '',
        weekly_sessions: fullStudent.weekly_sessions?.toString() || '',
        weekly_days: Array.isArray(fullStudent.weekly_days) ? [...fullStudent.weekly_days] : [],
        weekly_schedule: hasWeeklySchedule ? { ...fullStudent.weekly_schedule } : {},
        useWeeklySchedule: hasWeeklySchedule,
        session_duration: fullStudent.session_duration?.toString() || '',
        hourly_rate: fullStudent.hourly_rate?.toString() || '',
        notes: fullStudent.notes || '',
        password: '', // Don't populate password field for security
        trial_session_attendance: fullStudent.trial_session_attendance || '',
        monthly_subscription_price: fullStudent.monthly_subscription_price?.toString() || '',
        country: fullStudent.country || '',
        currency: fullStudent.currency || '',
        // Get data from subscriptions_statistics (only if no subscriptions exist)
        past_months_count: hasSubscriptions ? '' : totalSubscriptions.toString(),
        paid_months_count: hasSubscriptions ? '' : paidMonthsCount,
        subscription_start_date: hasSubscriptions ? '' : subscriptionStartDate,
        paid_subscriptions_count: '',
      })
      setShowEditModal(true)
    } catch (error: any) {
      alert(error.message || 'فشل تحميل بيانات الطالب')
    }
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setIsSubmitting(true)
      try {
        // Build request data - weekly_schedule takes precedence over hour and weekly_days
        const updateData: any = {
          name: editForm.name,
          email: editForm.email || undefined, // Optional
          phone: editForm.phone,
          age: editForm.age ? parseInt(editForm.age) : undefined, // Optional
          gender: editForm.gender as 'male' | 'female',
          package_id: editForm.package_id ? parseInt(editForm.package_id) : undefined,
          teacher_id: editForm.teacher_id ? parseInt(editForm.teacher_id) : undefined,
          monthly_sessions: editForm.monthly_sessions ? parseInt(editForm.monthly_sessions) : undefined,
          weekly_sessions: editForm.weekly_sessions ? parseInt(editForm.weekly_sessions) : undefined,
          session_duration: editForm.session_duration ? parseInt(editForm.session_duration) : undefined,
          hourly_rate: editForm.hourly_rate ? parseFloat(editForm.hourly_rate) : undefined,
          notes: editForm.notes || undefined,
          password: editForm.password || undefined, // Optional, min: 6 characters
          trial_session_attendance: editForm.trial_session_attendance || undefined,
          monthly_subscription_price: editForm.monthly_subscription_price ? parseFloat(editForm.monthly_subscription_price) : undefined,
          country: editForm.country || undefined,
          currency: editForm.currency || undefined,
        }

        // If using weekly_schedule, send it (takes precedence)
        if (editForm.useWeeklySchedule && Object.keys(editForm.weekly_schedule).length > 0) {
          updateData.weekly_schedule = editForm.weekly_schedule
        } else {
          // Otherwise, use hour and weekly_days
          if (editForm.hour) updateData.hour = editForm.hour
          if (editForm.weekly_days.length > 0) updateData.weekly_days = editForm.weekly_days
        }

        // Add subscription-related fields only if student doesn't have existing subscriptions
        if (!editingStudentHasSubscriptions) {
          if (editForm.past_months_count) {
            updateData.past_months_count = parseInt(editForm.past_months_count)
          }
          if (editForm.paid_months_count) {
            updateData.paid_months_count = parseInt(editForm.paid_months_count)
          }
          if (editForm.subscription_start_date) {
            updateData.subscription_start_date = editForm.subscription_start_date
          }
          if (editForm.paid_subscriptions_count) {
            updateData.paid_subscriptions_count = parseInt(editForm.paid_subscriptions_count)
          }
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
          trial_session_attendance: '',
          monthly_subscription_price: '',
          country: '',
          currency: '',
          past_months_count: '',
          paid_months_count: '',
          subscription_start_date: '',
          paid_subscriptions_count: '',
        })
        setShowEditModal(false)
        setEditingStudentHasSubscriptions(false)
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء التحديث')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingStudentHasSubscriptions(false)
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
        trial_session_attendance: '',
        monthly_subscription_price: '',
        country: '',
        currency: '',
        past_months_count: '',
        paid_months_count: '',
        subscription_start_date: '',
        paid_subscriptions_count: '',
      })
  }

  const handleDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      try {
        await deleteStudent(id)
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء الحذف')
      }
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Build request data - weekly_schedule takes precedence over hour and weekly_days
      const createData: any = {
        name: newStudent.name,
        email: newStudent.email || undefined, // Optional, unique
        phone: newStudent.phone,
        age: newStudent.age ? parseInt(newStudent.age) : undefined, // Optional, 1-120
        gender: newStudent.gender as 'male' | 'female',
        package_id: newStudent.package_id ? parseInt(newStudent.package_id) : undefined,
        teacher_id: newStudent.teacher_id ? parseInt(newStudent.teacher_id) : undefined,
        monthly_sessions: newStudent.monthly_sessions ? parseInt(newStudent.monthly_sessions) : undefined,
        weekly_sessions: newStudent.weekly_sessions ? parseInt(newStudent.weekly_sessions) : undefined,
        session_duration: newStudent.session_duration ? parseInt(newStudent.session_duration) : undefined,
        hourly_rate: newStudent.hourly_rate ? parseFloat(newStudent.hourly_rate) : undefined,
        notes: newStudent.notes || undefined,
        password: newStudent.password || undefined, // Optional, min: 6 characters
        trial_session_attendance: newStudent.trial_session_attendance || undefined,
        monthly_subscription_price: newStudent.monthly_subscription_price ? parseFloat(newStudent.monthly_subscription_price) : undefined,
        country: newStudent.country || undefined,
        currency: newStudent.currency || undefined,
      }

      // If using weekly_schedule, send it (takes precedence)
      if (newStudent.useWeeklySchedule && Object.keys(newStudent.weekly_schedule).length > 0) {
        createData.weekly_schedule = newStudent.weekly_schedule
      } else {
        // Otherwise, use hour and weekly_days
        if (newStudent.hour) createData.hour = newStudent.hour
        if (newStudent.weekly_days.length > 0) createData.weekly_days = newStudent.weekly_days
      }

      // Add subscription-related fields
      if (newStudent.past_months_count) {
        createData.past_months_count = parseInt(newStudent.past_months_count)
      }
      if (newStudent.paid_months_count) {
        createData.paid_months_count = parseInt(newStudent.paid_months_count)
      }
      if (newStudent.subscription_start_date) {
        createData.subscription_start_date = newStudent.subscription_start_date
      }

      await addStudent(createData)
      setNewStudent({
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
        trial_session_attendance: 'not_booked',
        monthly_subscription_price: '',
        country: '',
        currency: '',
        past_months_count: '',
        paid_months_count: '',
        subscription_start_date: '',
      })
      setShowAddModal(false)
    } catch (error: any) {
      alert(error.message || 'حدث خطأ أثناء الإضافة')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Session handlers
  const handleViewSessions = async (studentId: number) => {
    setSelectedStudentId(studentId)
    await fetchSessions({ student_id: studentId, per_page: 10000 })
    setShowSessionsModal(true)
  }

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudentId) return
    setIsSubmitting(true)
    try {
      await addSession({
        student_id: selectedStudentId,
        teacher_id: sessionForm.teacher_id ? parseInt(sessionForm.teacher_id) : undefined,
        session_date: sessionForm.session_date,
        session_time: sessionForm.session_time,
        day_of_week: sessionForm.day_of_week,
        notes: sessionForm.notes || undefined,
      })
      setSessionForm({
        student_id: '',
        teacher_id: '',
        session_date: '',
        session_time: '',
        day_of_week: '',
        notes: '',
      })
      setShowAddSessionModal(false)
      await fetchSessions({ student_id: selectedStudentId, per_page: 10000 })
    } catch (error: any) {
      alert(error.message || 'حدث خطأ أثناء إضافة الحصة')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteSession = async (id: number) => {
    if (confirm('هل أنت متأكد من تسجيل إتمام هذه الحصة؟')) {
      try {
        await completeSession(id)
        if (selectedStudentId) {
          await fetchSessions({ student_id: selectedStudentId, per_page: 10000 })
        }
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء تسجيل إتمام الحصة')
      }
    }
  }

  const handleDeleteSession = async (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الحصة؟')) {
      try {
        await deleteSession(id)
        if (selectedStudentId) {
          await fetchSessions({ student_id: selectedStudentId, per_page: 10000 })
        }
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء حذف الحصة')
      }
    }
  }

  const studentSessions = selectedStudentId 
    ? sessions.filter(s => s.student_id === selectedStudentId)
    : []

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-4xl font-bold text-primary-900">إدارة الطلاب</h1>
        <div className="flex items-center gap-4">
          <div className="text-primary-600 font-medium text-sm sm:text-base">إجمالي: {studentsMeta?.total}</div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all shadow-lg text-sm sm:text-base"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">إضافة طالب</span>
            <span className="sm:hidden">إضافة</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border-2 border-primary-200 p-4 sm:p-6 mb-6 shadow-lg">
        <button
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          className="flex items-center justify-between w-full gap-2 mb-4"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
            <h3 className="text-base sm:text-lg font-semibold text-primary-900">فلترة الطلاب</h3>
          </div>
          {filtersExpanded ? (
            <ChevronUp className="w-5 h-5 text-primary-600" />
          ) : (
            <ChevronDown className="w-5 h-5 text-primary-600" />
          )}
        </button>
        <AnimatePresence>
          {filtersExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">البحث</label>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="ابحث عن طالب..."
                className="w-full pr-12 pl-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                dir="rtl"
              />
            </div>
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">نوع التسجيل</label>
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value as 'website' | 'admin' | 'app' | '' })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الأنواع</option>
              <option value="website">من الموقع</option>
              <option value="admin">من الإدارة</option>
              <option value="app">من التطبيق</option>
            </select>
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">الباقة</label>
            <select
              value={filters.package_id}
              onChange={(e) => setFilters({ ...filters, package_id: e.target.value })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الباقات</option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">الجنس</label>
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value as 'male' | 'female' | '' })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الأجناس</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم</label>
            <SearchableTeacherSelect
              value={filters.teacher_id}
              onChange={(value) => setFilters({ ...filters, teacher_id: value })}
              teachers={teachers}
              placeholder="جميع المعلمين"
            />
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">عدد الشهور الغير مدفوعه</label>
            <input
              type="number"
              value={filters.unpaid_months_count}
              onChange={(e) => setFilters({ ...filters, unpaid_months_count: e.target.value })}
              placeholder="عدد الشهور..."
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
              min="0"
            />
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">حالة الدفع</label>
            <select
              value={filters.payment_status}
              onChange={(e) => setFilters({ ...filters, payment_status: e.target.value as 'all_paid' | 'has_unpaid' | '' })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الحالات</option>
              <option value="all_paid">كلها مدفوعة</option>
              <option value="has_unpaid">يوجد غير مدفوع</option>
            </select>
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">حالة الإيقاف</label>
            <select
              value={filters.is_paused}
              onChange={(e) => setFilters({ ...filters, is_paused: e.target.value as 'true' | 'false' | '' })}
              className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الحالات</option>
              <option value="true">مُوقّف</option>
              <option value="false">غير مُوقّف</option>
            </select>
          </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Students Table */}
      {isLoadingStudents ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="bg-white rounded-xl border-2 border-primary-200 p-8 text-center text-primary-600 shadow-lg">
          {filters.search || filters.package_id || filters.gender || filters.teacher_id || filters.unpaid_months_count || filters.payment_status || filters.is_paused
            ? 'لا توجد نتائج'
            : 'لا يوجد طلاب مسجلون بعد'}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className={`bg-white rounded-xl border-2 border-primary-200 p-4 shadow-lg ${
                  student.is_paused ? 'bg-red-50 border-red-300' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-primary-900">{student.name}</h3>
                  {student.is_paused && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">مُوقّف</span>
                  )}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-primary-600">الهاتف:</span>
                    <span className="text-primary-900 font-medium">{student.phone}</span>
                  </div>
                  {student.email && (
                    <div className="flex justify-between">
                      <span className="text-primary-600">البريد:</span>
                      <span className="text-primary-900">{student.email}</span>
                    </div>
                  )}
                  {student.age && (
                    <div className="flex justify-between">
                      <span className="text-primary-600">العمر:</span>
                      <span className="text-primary-900">{student.age}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-primary-600">الجنس:</span>
                    <span className="text-primary-900">{student.gender_label || (student.gender === 'male' ? 'ذكر' : 'أنثى')}</span>
                  </div>
                  {student.package?.name && (
                    <div className="flex justify-between">
                      <span className="text-primary-600">الباقة:</span>
                      <span className="text-primary-900">{student.package.name}</span>
                    </div>
                  )}
                  {student.teacher?.name && (
                    <div className="flex justify-between">
                      <span className="text-primary-600">المعلم:</span>
                      <span className="text-primary-900">{student.teacher.name}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-primary-200">
                  <button
                    onClick={() => handleViewStudent(student.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="عرض التفاصيل"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleViewSessions(student.id)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="عرض الحصص"
                  >
                    <Calendar className="w-4 h-4" />
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
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
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
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className={`border-b border-primary-200 transition-colors ${
                        student.is_paused 
                          ? 'bg-red-100 hover:bg-red-200' 
                          : 'hover:bg-primary-50'
                      }`}
                    >
                      <td className="px-6 py-4 text-primary-900 font-medium">{student.name}</td>
                      <td className="px-6 py-4 text-primary-700">{student.email}</td>
                      <td className="px-6 py-4 text-primary-700">{student.phone}</td>
                      <td className="px-6 py-4 text-primary-700">{student.age}</td>
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
                            onClick={() => handleViewSessions(student.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="عرض الحصص"
                          >
                            <Calendar className="w-4 h-4" />
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination */}
          {studentsMeta && studentsMeta.last_page > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t border-primary-200 mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-2 border-2 border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                السابق
              </button>
              <span className="px-4 py-2 text-primary-700">
                صفحة {currentPage} من {studentsMeta.last_page}
              </span>
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= studentsMeta.last_page}
                className="px-4 py-2 border-2 border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                التالي
              </button>
            </div>
          )}
        </>
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
              className="bg-white rounded-2xl p-8 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
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

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">الاسم</label>
                    <p className="text-primary-900 font-semibold">{viewedStudent.name}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">البريد الإلكتروني</label>
                    <p className="text-primary-900">{viewedStudent.email}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">الهاتف</label>
                    <p className="text-primary-900">{viewedStudent.phone}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">العمر</label>
                    <p className="text-primary-900">{viewedStudent.age}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">الجنس</label>
                    <p className="text-primary-900">{viewedStudent.gender_label || (viewedStudent.gender === 'male' ? 'ذكر' : 'أنثى')}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">الباقة</label>
                    <p className="text-primary-900">{viewedStudent.package?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">المعلم</label>
                    <p className="text-primary-900">{viewedStudent.teacher?.name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">وقت الحصة</label>
                    <p className="text-primary-900">{viewedStudent.hour || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">الحصص الشهرية</label>
                    <p className="text-primary-900">{viewedStudent.monthly_sessions || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">الحصص الأسبوعية</label>
                    <p className="text-primary-900">{viewedStudent.weekly_sessions || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">جدول الأسبوع</label>
                    {viewedStudent.weekly_schedule && typeof viewedStudent.weekly_schedule === 'object' && Object.keys(viewedStudent.weekly_schedule).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(viewedStudent.weekly_schedule).map(([day, time]) => (
                          <p key={day} className="text-primary-900">
                            <span className="font-medium">{day}:</span> {time as string}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <p className="text-primary-900 mb-2">
                          <span className="font-medium">الوقت الافتراضي:</span> {viewedStudent.hour || '-'}
                        </p>
                        <p className="text-primary-900">
                          <span className="font-medium">الأيام:</span>{' '}
                          {Array.isArray(viewedStudent.weekly_days) && viewedStudent.weekly_days.length > 0
                            ? viewedStudent.weekly_days.map((day: string) => {
                                const dayObj = DAYS_OF_WEEK.find(d => d.value === day)
                                return dayObj?.label
                              }).filter(Boolean).join('، ')
                            : '-'}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">مدة الحصة (دقيقة)</label>
                    <p className="text-primary-900">{viewedStudent.session_duration || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">سعر الساعة</label>
                    <p className="text-primary-900">{viewedStudent.hourly_rate ? `${viewedStudent.hourly_rate} جنيه` : '-'}</p>
                  </div>
                  {viewedStudent.trial_session_attendance && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">حالة جلسة التجربة</label>
                      <p className="text-primary-900">
                        {viewedStudent.trial_session_attendance_label || 
                         (viewedStudent.trial_session_attendance === 'not_booked' ? 'غير محجوز' :
                          viewedStudent.trial_session_attendance === 'booked' ? 'محجوز' : 'حضر')}
                      </p>
                    </div>
                  )}
                  {viewedStudent.monthly_subscription_price && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">سعر الاشتراك الشهري</label>
                      <p className="text-primary-900">
                        {viewedStudent.monthly_subscription_price} {viewedStudent.currency || 'EGP'}
                      </p>
                    </div>
                  )}
                  {viewedStudent.country && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">البلد</label>
                      <p className="text-primary-900">{viewedStudent.country}</p>
                    </div>
                  )}
                  {viewedStudent.currency && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">العملة</label>
                      <p className="text-primary-900">{viewedStudent.currency}</p>
                    </div>
                  )}
                </div>
                {viewedStudent.notes && (
                  <div>
                    <label className="block text-primary-600 text-sm mb-1">ملاحظات</label>
                    <p className="text-primary-900">{viewedStudent.notes}</p>
                  </div>
                )}
                
                {viewedStudent.subscriptions_statistics && (
                  <div className="border-t-2 border-primary-200 pt-4 mt-4">
                    <h3 className="text-lg font-bold text-primary-900 mb-4 text-right">إحصائيات الاشتراكات</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-primary-50 p-4 rounded-lg">
                        <label className="block text-primary-600 text-sm mb-1">إجمالي الاشتراكات</label>
                        <p className="text-2xl font-bold text-primary-900">{viewedStudent.subscriptions_statistics.total_subscriptions || 0}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <label className="block text-green-600 text-sm mb-1">الاشتراكات المدفوعة</label>
                        <p className="text-2xl font-bold text-green-700">{viewedStudent.subscriptions_statistics.paid_subscriptions || 0}</p>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <label className="block text-red-600 text-sm mb-1">الاشتراكات غير المدفوعة</label>
                        <p className="text-2xl font-bold text-red-700">{viewedStudent.subscriptions_statistics.unpaid_subscriptions || 0}</p>
                      </div>
                      {viewedStudent.subscriptions_statistics.total_sessions_count !== undefined && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <label className="block text-blue-600 text-sm mb-1">إجمالي الحصص</label>
                          <p className="text-2xl font-bold text-blue-700">{viewedStudent.subscriptions_statistics.total_sessions_count || 0}</p>
                        </div>
                      )}
                    </div>
                    {(viewedStudent.subscriptions_statistics.completed_sessions_count !== undefined || 
                      viewedStudent.subscriptions_statistics.remaining_sessions_count !== undefined) && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {viewedStudent.subscriptions_statistics.completed_sessions_count !== undefined && (
                          <div className="bg-green-50 p-4 rounded-lg">
                            <label className="block text-green-600 text-sm mb-1">الحصص المكتملة</label>
                            <p className="text-2xl font-bold text-green-700">{viewedStudent.subscriptions_statistics.completed_sessions_count || 0}</p>
                          </div>
                        )}
                        {viewedStudent.subscriptions_statistics.remaining_sessions_count !== undefined && (
                          <div className="bg-yellow-50 p-4 rounded-lg">
                            <label className="block text-yellow-600 text-sm mb-1">الحصص المتبقية</label>
                            <p className="text-2xl font-bold text-yellow-700">{viewedStudent.subscriptions_statistics.remaining_sessions_count || 0}</p>
                          </div>
                        )}
                      </div>
                    )}
                    {(viewedStudent.subscriptions_statistics.first_subscription_date || 
                      viewedStudent.subscriptions_statistics.last_subscription_date) && (
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {viewedStudent.subscriptions_statistics.first_subscription_date && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-gray-600 text-sm mb-1">تاريخ أول اشتراك</label>
                            <p className="text-lg font-bold text-gray-700">{viewedStudent.subscriptions_statistics.first_subscription_date}</p>
                          </div>
                        )}
                        {viewedStudent.subscriptions_statistics.last_subscription_date && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-gray-600 text-sm mb-1">تاريخ آخر اشتراك</label>
                            <p className="text-lg font-bold text-gray-700">{viewedStudent.subscriptions_statistics.last_subscription_date}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {/* Subscriptions Table */}
                {viewedStudent.subscriptions && Array.isArray(viewedStudent.subscriptions) && viewedStudent.subscriptions.length > 0 && (
                  <div className="border-t-2 border-primary-200 pt-4 mt-4">
                    <h3 className="text-lg font-bold text-primary-900 mb-4 text-right">الاشتراكات</h3>
                    <div className="overflow-x-auto">
                      <table className="border-collapse bg-white rounded-lg overflow-hidden shadow-sm" style={{ tableLayout: 'auto', minWidth: '100%' }}>
                        <thead className="bg-primary-100">
                          <tr>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">رقم الاشتراك</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">تاريخ البدء</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">تاريخ الانتهاء</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">الحصص/الأسبوع</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">إجمالي الحصص</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">مكتملة</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">متبقية</th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">الحالة</th>
                            <th className="px-4 py-3 text-center text-sm font-semibold text-primary-900 border-b-2 border-primary-200 whitespace-nowrap">الإجراءات</th>
                          </tr>
                        </thead>
                        <tbody>
                          {viewedStudent.subscriptions.map((subscription: any , index: number) => (
                            <tr key={subscription.id} className="border-b border-primary-100 hover:bg-primary-50 transition-colors">
                              <td className="px-4 py-3 text-primary-900 font-medium text-sm whitespace-nowrap">{index + 1}</td>
                              <td className="px-4 py-3 text-primary-700 text-sm whitespace-nowrap">{subscription.start_date}</td>
                              <td className="px-4 py-3 text-primary-700 text-sm whitespace-nowrap">{subscription.end_date}</td>
                              <td className="px-4 py-3 text-primary-700 text-sm text-center whitespace-nowrap">{subscription.sessions_per_week || '-'}</td>
                              <td className="px-4 py-3 text-primary-700 text-sm text-center whitespace-nowrap">{subscription.total_sessions || '-'}</td>
                              <td className="px-4 py-3 text-primary-700 text-sm text-center whitespace-nowrap">{subscription.completed_sessions_count || 0}</td>
                              <td className="px-4 py-3 text-primary-700 text-sm text-center whitespace-nowrap">{subscription.remaining_sessions_count || 0}</td>
                              <td className="px-4 py-3 text-sm whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2 flex-wrap">
                                  {subscription.is_paid ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                      <CheckCircle className="w-3 h-3" />
                                      مدفوع
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                      <X className="w-3 h-3" />
                                      غير مدفوع
                                    </span>
                                  )}
                                  {subscription.is_active && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                      <Clock className="w-3 h-3" />
                                      نشط
                                    </span>
                                  )}
                                  {subscription.is_upcoming && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                      <Clock className="w-3 h-3" />
                                      قادم
                                    </span>
                                  )}
                                  {subscription.is_expired && (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                                      <X className="w-3 h-3" />
                                      منتهي
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center whitespace-nowrap">
                                <div className="flex items-center justify-center gap-2 flex-wrap">
                                  <button
                                    onClick={() => handleToggleSubscriptionPayment(subscription.id, subscription.is_paid)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                      subscription.is_paid
                                        ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                                    }`}
                                    title={subscription.is_paid ? 'تعيين كغير مدفوع' : 'تعيين كمدفوع'}
                                  >
                                    {subscription.is_paid ? 'غير مدفوع' : 'مدفوع'}
                                  </button>
                                  {subscription.is_active && subscription.status !== 'paused' && (
                                    <button
                                      onClick={async () => {
                                        if (confirm('هل أنت متأكد من إيقاف هذا الاشتراك؟ سيتم حذف جميع الحصص المستقبلية غير المكتملة.')) {
                                          try {
                                            const { pauseSubscription } = await import('@/lib/api/students')
                                            await pauseSubscription(subscription.id)
                                            if (viewingId) {
                                              const updatedStudent = await getStudent(viewingId)
                                              setViewedStudent(updatedStudent)
                                            }
                                          } catch (error: any) {
                                            alert(error.message || 'فشل إيقاف الاشتراك')
                                          }
                                        }
                                      }}
                                      className="px-3 py-1.5 bg-yellow-100 text-yellow-700 hover:bg-yellow-200 rounded-lg text-xs font-medium transition-colors"
                                      title="إيقاف الاشتراك"
                                    >
                                      إيقاف
                                    </button>
                                  )}
                                  {subscription.status === 'paused' && (
                                    <button
                                      onClick={async () => {
                                        const resumeDate = prompt('أدخل تاريخ الاستئناف (YYYY-MM-DD) أو اتركه فارغاً لاستخدام التاريخ الحالي:')
                                        if (resumeDate === null) return // User cancelled
                                        try {
                                          const { resumeSubscription } = await import('@/lib/api/students')
                                          await resumeSubscription(subscription.id, resumeDate || undefined)
                                          if (viewingId) {
                                            const updatedStudent = await getStudent(viewingId)
                                            setViewedStudent(updatedStudent)
                                          }
                                        } catch (error: any) {
                                          alert(error.message || 'فشل استئناف الاشتراك')
                                        }
                                      }}
                                      className="px-3 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg text-xs font-medium transition-colors"
                                      title="استئناف الاشتراك"
                                    >
                                      استئناف
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sessions Modal */}
      <AnimatePresence>
        {showSessionsModal && selectedStudentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setShowSessionsModal(false)
              setSelectedStudentId(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">حصص الطالب</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const student = students.find(s => s.id === selectedStudentId)
                      setSessionForm({
                        student_id: selectedStudentId.toString(),
                        teacher_id: student?.teacher_id?.toString() || '',
                        session_date: '',
                        session_time: student?.hour || '',
                        day_of_week: '',
                        notes: '',
                      })
                      setShowAddSessionModal(true)
                    }}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 inline ml-2" />
                    إضافة حصة
                  </button>
                  <button
                    onClick={() => {
                      setShowSessionsModal(false)
                      setSelectedStudentId(null)
                    }}
                    className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {isLoadingSessions ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : studentSessions.length === 0 ? (
                <div className="text-center py-12 text-primary-600">لا توجد حصص مسجلة</div>
              ) : (
                <div className="space-y-4">
                  {studentSessions.map((session) => (
                    <div
                      key={session.id}
                      className={`p-4 rounded-lg border-2 ${
                        session.is_completed
                          ? 'border-green-200 bg-green-50'
                          : 'border-primary-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {session.is_completed ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <Clock className="w-6 h-6 text-primary-600" />
                          )}
                          <div>
                            <p className="font-semibold text-primary-900">
                              {session.session_date} - {session.session_time}
                            </p>
                            <p className="text-sm text-primary-600">
                              {session.day_of_week_label || session.day_of_week}
                              {session.teacher && ` - ${session.teacher.name}`}
                            </p>
                            {session.notes && (
                              <p className="text-sm text-primary-700 mt-1">{session.notes}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {!session.is_completed && (
                            <button
                              onClick={() => handleCompleteSession(session.id)}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                            >
                              إتمام
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteSession(session.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            حذف
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Session Modal */}
      <AnimatePresence>
        {showAddSessionModal && selectedStudentId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4"
            onClick={() => setShowAddSessionModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">إضافة حصة جديدة</h2>
                <button
                  onClick={() => setShowAddSessionModal(false)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddSession} className="space-y-4">
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">تاريخ الحصة</label>
                  <input
                    type="date"
                    value={sessionForm.session_date}
                    onChange={(e) => setSessionForm({ ...sessionForm, session_date: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">وقت الحصة</label>
                  <input
                    type="time"
                    value={sessionForm.session_time}
                    onChange={(e) => setSessionForm({ ...sessionForm, session_time: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">يوم الأسبوع</label>
                  <select
                    value={sessionForm.day_of_week}
                    onChange={(e) => setSessionForm({ ...sessionForm, day_of_week: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                    required
                  >
                    <option value="">اختر اليوم</option>
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day.value} value={day.value}>
                        {day.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم</label>
                  <select
                    value={sessionForm.teacher_id}
                    onChange={(e) => setSessionForm({ ...sessionForm, teacher_id: e.target.value })}
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
                  <label className="block text-primary-900 font-semibold mb-2 text-right">ملاحظات</label>
                  <textarea
                    value={sessionForm.notes}
                    onChange={(e) => setSessionForm({ ...sessionForm, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة حصة'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddSessionModal(false)}
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

      {/* Add Student Modal - Keep existing code */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">إضافة طالب جديد</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      البريد الإلكتروني (اختياري)
                    </label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">العمر (اختياري)</label>
                    <input
                      type="number"
                      value={newStudent.age}
                      onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="1"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الجنس</label>
                    <select
                      value={newStudent.gender}
                      onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value as 'male' | 'female' })}
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
                      value={newStudent.package_id}
                      onChange={(e) => setNewStudent({ ...newStudent, package_id: e.target.value })}
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
                    <SearchableTeacherSelect
                      value={newStudent.teacher_id}
                      onChange={(value) => setNewStudent({ ...newStudent, teacher_id: value })}
                      teachers={teachers}
                      placeholder="اختر المعلم (اختياري)"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">وقت الحصة</label>
                    <input
                      type="time"
                      value={newStudent.hour}
                      onChange={(e) => setNewStudent({ ...newStudent, hour: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      placeholder="HH:mm"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">عدد الحصص الشهرية</label>
                    <input
                      type="number"
                      value={newStudent.monthly_sessions}
                      onChange={(e) => setNewStudent({ ...newStudent, monthly_sessions: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">عدد الحصص الأسبوعية</label>
                    <input
                      type="number"
                      value={newStudent.weekly_sessions}
                      onChange={(e) => setNewStudent({ ...newStudent, weekly_sessions: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">مدة الحصة (بالدقائق)</label>
                    <input
                      type="number"
                      value={newStudent.session_duration}
                      onChange={(e) => setNewStudent({ ...newStudent, session_duration: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">سعر الساعة (جنيه)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newStudent.hourly_rate}
                      onChange={(e) => setNewStudent({ ...newStudent, hourly_rate: e.target.value })}
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
                        checked={newStudent.useWeeklySchedule}
                        onChange={(e) => setNewStudent({ ...newStudent, useWeeklySchedule: e.target.checked })}
                        className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                      />
                      <span className="text-primary-700 text-sm">استخدام جدول متقدم (وقت مختلف لكل يوم)</span>
                    </label>
                  </div>
                  
                  {newStudent.useWeeklySchedule ? (
                    <div className="space-y-3 p-4 bg-primary-50 rounded-lg border-2 border-primary-200">
                      <p className="text-sm text-primary-600 mb-3">حدد وقت الحصة لكل يوم (اختياري)</p>
                      {DAYS_OF_WEEK.map((day) => (
                        <div key={day.value} className="flex items-center gap-3">
                          <label className="w-24 text-primary-700 font-medium">{day.label}</label>
                          <input
                            type="time"
                            value={newStudent.weekly_schedule[day.arName] || ''}
                            onChange={(e) => {
                              const newSchedule = { ...newStudent.weekly_schedule }
                              if (e.target.value) {
                                newSchedule[day.arName] = e.target.value
                              } else {
                                delete newSchedule[day.arName]
                              }
                              setNewStudent({ ...newStudent, weekly_schedule: newSchedule })
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
                          value={newStudent.hour}
                          onChange={(e) => setNewStudent({ ...newStudent, hour: e.target.value })}
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
                                checked={newStudent.weekly_days.includes(day.value)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setNewStudent({
                                      ...newStudent,
                                      weekly_days: [...newStudent.weekly_days, day.value],
                                    })
                                  } else {
                                    setNewStudent({
                                      ...newStudent,
                                      weekly_days: newStudent.weekly_days.filter((d) => d !== day.value),
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
                    value={newStudent.password}
                    onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    placeholder="الحد الأدنى 6 أحرف"
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">حالة جلسة التجربة</label>
                  <select
                    value={newStudent.trial_session_attendance}
                    onChange={(e) => setNewStudent({ ...newStudent, trial_session_attendance: e.target.value as 'not_booked' | 'booked' | 'attended' })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                  >
                    <option value="not_booked">غير محجوز</option>
                    <option value="booked">محجوز</option>
                    <option value="attended">حضر</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">سعر الاشتراك الشهري</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={newStudent.monthly_subscription_price}
                      onChange={(e) => setNewStudent({ ...newStudent, monthly_subscription_price: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">البلد</label>
                    <select
                      value={newStudent.country}
                      onChange={(e) => setNewStudent({ ...newStudent, country: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                    >
                      <option value="">اختر البلد</option>
                      <option value="الأردن">الأردن</option>
                      <option value="مصر">مصر</option>
                      <option value="السعودية">السعودية</option>
                      <option value="الإمارات">الإمارات</option>
                      <option value="قطر">قطر</option>
                      <option value="الكويت">الكويت</option>
                      <option value="أمريكا">أمريكا</option>
                      <option value="كندا">كندا</option>
                      <option value="ألمانيا">ألمانيا</option>
                      <option value="أجنبي">أجنبي</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">العملة</label>
                  <select
                    value={newStudent.currency}
                    onChange={(e) => setNewStudent({ ...newStudent, currency: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                  >
                    <option value="">اختر العملة</option>
                    <option value="JOD">دينار أردني (JOD)</option>
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="QAR">ريال قطري (QAR)</option>
                    <option value="KWD">دينار كويتي (KWD)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="CAD">دولار كندي (CAD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">ملاحظات</label>
                  <textarea
                    value={newStudent.notes}
                    onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                    placeholder="ملاحظات اختيارية..."
                  />
                </div>
                
                {/* Subscription Fields Section */}
                <div className="border-t-2 border-primary-200 pt-4 mt-4">
                  <h3 className="text-lg font-bold text-primary-900 mb-4 text-right">إعدادات الاشتراكات (اختياري)</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-primary-900 font-semibold mb-2 text-right">
                        تاريخ بداية الاشتراك
                      </label>
                      <input
                        type="date"
                        value={newStudent.subscription_start_date}
                        onChange={(e) => setNewStudent({ ...newStudent, subscription_start_date: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      />
                      <p className="text-xs text-primary-600 mt-1 text-right">
                        مطلوب إذا تم تحديد عدد الأشهر السابقة
                      </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-primary-900 font-semibold mb-2 text-right">
                          عدد الأشهر السابقة
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={newStudent.past_months_count}
                          onChange={(e) => setNewStudent({ ...newStudent, past_months_count: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                          placeholder="0-120"
                        />
                        <p className="text-xs text-primary-600 mt-1 text-right">
                          عدد الأشهر السابقة لإنشاء اشتراكات لها
                        </p>
                      </div>
                      <div>
                        <label className="block text-primary-900 font-semibold mb-2 text-right">
                          عدد الأشهر المدفوعة
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="120"
                          value={newStudent.paid_months_count}
                          onChange={(e) => setNewStudent({ ...newStudent, paid_months_count: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                          placeholder="0-120"
                        />
                        <p className="text-xs text-primary-600 mt-1 text-right">
                          عدد الأشهر المدفوعة من أول N اشتراك
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري الإضافة...' : 'إضافة طالب'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
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

      {/* Edit Student Modal - Keep existing code */}
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
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      الاسم الكامل
                    </label>
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
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      البريد الإلكتروني (اختياري)
                    </label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      رقم الهاتف
                    </label>
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
                    <SearchableTeacherSelect
                      value={editForm.teacher_id}
                      onChange={(value) => setEditForm({ ...editForm, teacher_id: value })}
                      teachers={teachers}
                      placeholder="اختر المعلم (اختياري)"
                    />
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
                    <label className="block text-primary-900 font-semibold mb-2 text-right">سعر الساعة (جنيه)</label>
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
                  <label className="block text-primary-900 font-semibold mb-2 text-right">حالة جلسة التجربة</label>
                  <select
                    value={editForm.trial_session_attendance}
                    onChange={(e) => setEditForm({ ...editForm, trial_session_attendance: e.target.value as 'not_booked' | 'booked' | 'attended' | '' })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                  >
                    <option value="">اختر الحالة</option>
                    <option value="not_booked">غير محجوز</option>
                    <option value="booked">محجوز</option>
                    <option value="attended">حضر</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">سعر الاشتراك الشهري</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.monthly_subscription_price}
                      onChange={(e) => setEditForm({ ...editForm, monthly_subscription_price: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">البلد</label>
                    <select
                      value={editForm.country}
                      onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                    >
                      <option value="">اختر البلد</option>
                      <option value="الأردن">الأردن</option>
                      <option value="مصر">مصر</option>
                      <option value="السعودية">السعودية</option>
                      <option value="الإمارات">الإمارات</option>
                      <option value="قطر">قطر</option>
                      <option value="الكويت">الكويت</option>
                      <option value="أمريكا">أمريكا</option>
                      <option value="كندا">كندا</option>
                      <option value="ألمانيا">ألمانيا</option>
                      <option value="أجنبي">أجنبي</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">العملة</label>
                  <select
                    value={editForm.currency}
                    onChange={(e) => setEditForm({ ...editForm, currency: e.target.value })}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                  >
                    <option value="">اختر العملة</option>
                    <option value="JOD">دينار أردني (JOD)</option>
                    <option value="EGP">جنيه مصري (EGP)</option>
                    <option value="SAR">ريال سعودي (SAR)</option>
                    <option value="AED">درهم إماراتي (AED)</option>
                    <option value="QAR">ريال قطري (QAR)</option>
                    <option value="KWD">دينار كويتي (KWD)</option>
                    <option value="USD">دولار أمريكي (USD)</option>
                    <option value="CAD">دولار كندي (CAD)</option>
                    <option value="EUR">يورو (EUR)</option>
                  </select>
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
                
                {/* Subscription Fields Section - Only show if student doesn't have existing subscriptions */}
                {!editingStudentHasSubscriptions && (
                  <div className="border-t-2 border-primary-200 pt-4 mt-4">
                    <h3 className="text-lg font-bold text-primary-900 mb-4 text-right">إعدادات الاشتراكات (اختياري)</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-primary-900 font-semibold mb-2 text-right">
                          تاريخ بداية الاشتراك
                        </label>
                        <input
                          type="date"
                          value={editForm.subscription_start_date}
                          onChange={(e) => setEditForm({ ...editForm, subscription_start_date: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                        />
                        <p className="text-xs text-primary-600 mt-1 text-right">
                          مطلوب إذا تم تحديد عدد الأشهر السابقة
                        </p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-primary-900 font-semibold mb-2 text-right">
                            عدد الأشهر السابقة
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            value={editForm.past_months_count}
                            onChange={(e) => setEditForm({ ...editForm, past_months_count: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                            placeholder="0-120"
                          />
                          <p className="text-xs text-primary-600 mt-1 text-right">
                            عدد الأشهر السابقة لإنشاء اشتراكات لها
                          </p>
                        </div>
                        <div>
                          <label className="block text-primary-900 font-semibold mb-2 text-right">
                            عدد الأشهر المدفوعة
                          </label>
                          <input
                            type="number"
                            min="0"
                            max="120"
                            value={editForm.paid_months_count}
                            onChange={(e) => setEditForm({ ...editForm, paid_months_count: e.target.value })}
                            className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                            placeholder="0-120"
                          />
                          <p className="text-xs text-primary-600 mt-1 text-right">
                            عدد الأشهر المدفوعة من أول N اشتراك
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
