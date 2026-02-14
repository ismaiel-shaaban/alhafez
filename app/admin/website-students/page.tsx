'use client'

import { useState, useEffect } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { Search, Eye, X, Edit, Trash2, AlertTriangle, Plus } from 'lucide-react'
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

type TabType = 'website' | 'app'

export default function WebsiteStudentsPage() {
  const { 
    students, 
    isLoadingStudents, 
    fetchStudents, 
    getStudent,
    addStudent,
    updateStudent,
    deleteStudent,
    forceDeleteStudent,
    packages,
    fetchPackages,
    teachers,
    fetchTeachers,
    error 
  } = useAdminStore()
  
  const [activeTab, setActiveTab] = useState<TabType>('website')
  const [searchTerm, setSearchTerm] = useState('')
  const [trialSessionFilter, setTrialSessionFilter] = useState<'not_booked' | 'booked' | 'attended' | ''>('')
  const [teacherFilterId, setTeacherFilterId] = useState<string>('')
  const [viewingId, setViewingId] = useState<number | null>(null)
  const [viewedStudent, setViewedStudent] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [updatingTrialAttendance, setUpdatingTrialAttendance] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingStudentHasSubscriptions, setEditingStudentHasSubscriptions] = useState(false)
  const [showTeacherSelectModal, setShowTeacherSelectModal] = useState(false)
  const [pendingTrialUpdate, setPendingTrialUpdate] = useState<{ studentId: number; newStatus: 'not_booked' | 'booked' | 'attended' } | null>(null)
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')
  const [trialSessionDate, setTrialSessionDate] = useState<string>('')
  const [trialSessionTime, setTrialSessionTime] = useState<string>('')
  const [trialSessionDuration, setTrialSessionDuration] = useState<string>('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '' as 'male' | 'female' | '',
    package_id: '',
    teacher_id: '',
    notes: '',
    country: '',
  })
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
    trial_session_attendance: '' as 'not_booked' | 'booked' | 'attended' | '',
    monthly_subscription_price: '',
    country: '',
    currency: '',
    past_months_count: '',
    paid_months_count: '',
    subscription_start_date: '',
    paid_subscriptions_count: '',
  })

  useEffect(() => {
    // Fetch students based on active tab with filters
    const filters: any = { type: activeTab, per_page: 10000 }
    if (trialSessionFilter) filters.trial_session_attendance = trialSessionFilter
    if (teacherFilterId) filters.teacher_id = parseInt(teacherFilterId)
    fetchStudents(filters)
    fetchPackages()
    fetchTeachers(1, 1000)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, trialSessionFilter, teacherFilterId])

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

  const handleEdit = async (student: any) => {
    try {
      // Fetch full student data to check for subscriptions
      const fullStudent = await getStudent(student.id)
      
      // Check if student has subscriptions
      const hasSubscriptions = !!(fullStudent.subscriptions && Array.isArray(fullStudent.subscriptions) && fullStudent.subscriptions.length > 0)
      setEditingStudentHasSubscriptions(!!hasSubscriptions)
      
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
      
      setEditingId(fullStudent.id)
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
        paid_months_count: fullStudent.paid_months_count?.toString() ?? (hasSubscriptions ? '' : paidMonthsCount),
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
    e.stopPropagation() // Prevent event bubbling
    if (editingId && !isSubmitting) { // Prevent duplicate submissions
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
          trial_session_attendance: editForm.trial_session_attendance || undefined,
          monthly_subscription_price: editForm.monthly_subscription_price ? parseFloat(editForm.monthly_subscription_price) : undefined,
          paid_months_count: editForm.paid_months_count !== '' ? parseInt(editForm.paid_months_count) : undefined,
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
          trial_session_attendance: '' as 'not_booked' | 'booked' | 'attended' | '',
          monthly_subscription_price: '',
          country: '',
          currency: '',
          past_months_count: '',
          paid_months_count: '',
          subscription_start_date: '',
          paid_subscriptions_count: '',
        })
        setShowEditModal(false)
        // Refresh the list
        const filters: any = { type: activeTab, per_page: 10000 }
        if (trialSessionFilter) filters.trial_session_attendance = trialSessionFilter
        if (teacherFilterId) filters.teacher_id = parseInt(teacherFilterId)
        fetchStudents(filters)
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
    setEditingStudentHasSubscriptions(false)
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
      trial_session_attendance: '' as 'not_booked' | 'booked' | 'attended' | '',
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
        // Refresh the list
        const filters: any = { type: activeTab, per_page: 10000 }
        if (trialSessionFilter) filters.trial_session_attendance = trialSessionFilter
        if (teacherFilterId) filters.teacher_id = parseInt(teacherFilterId)
        fetchStudents(filters)
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء الحذف')
      }
    }
  }

  const handleForceDelete = async (id: number) => {
    if (confirm('هل أنت متأكد من الحذف النهائي لهذا الطالب؟ لا يمكن التراجع عن هذا الإجراء.')) {
      try {
        await forceDeleteStudent(id)
        const filters: any = { type: activeTab, per_page: 10000 }
        if (trialSessionFilter) filters.trial_session_attendance = trialSessionFilter
        if (teacherFilterId) filters.teacher_id = parseInt(teacherFilterId)
        fetchStudents(filters)
      } catch (error: any) {
        alert(error.message || 'حدث خطأ أثناء الحذف النهائي')
      }
    }
  }

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const createData: any = {
        name: newStudent.name,
        email: newStudent.email || undefined,
        phone: newStudent.phone,
        age: newStudent.age ? parseInt(newStudent.age) : undefined,
        gender: newStudent.gender as 'male' | 'female',
        package_id: newStudent.package_id ? parseInt(newStudent.package_id) : undefined,
        teacher_id: newStudent.teacher_id ? parseInt(newStudent.teacher_id) : undefined,
        notes: newStudent.notes || undefined,
        country: newStudent.country || undefined,
      }
      await addStudent(createData)
      const filters: any = { type: activeTab, per_page: 10000 }
      if (trialSessionFilter) filters.trial_session_attendance = trialSessionFilter
      if (teacherFilterId) filters.teacher_id = parseInt(teacherFilterId)
      await fetchStudents(filters)
      setNewStudent({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: '' as 'male' | 'female' | '',
        package_id: '',
        teacher_id: '',
        notes: '',
        country: '',
      })
      setShowAddModal(false)
    } catch (error: any) {
      alert(error.message || 'حدث خطأ أثناء الإضافة')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateTrialAttendance = async (studentId: number, newStatus: 'not_booked' | 'booked' | 'attended') => {
    try {
      // Get the student to retrieve teacher_id
      const student = await getStudent(studentId)
      
      // If status is 'booked', we need to show modal to get date, time, and teacher (if needed)
      if (newStatus === 'booked') {
        setPendingTrialUpdate({ studentId, newStatus })
        setSelectedTeacherId(student.teacher_id?.toString() || '')
        setTrialSessionDate('')
        setTrialSessionTime('')
        setTrialSessionDuration('')
        setShowTeacherSelectModal(true)
        return
      }
      
      // For other statuses, if student doesn't have a teacher_id, show modal to select one
      if (!student.teacher_id) {
        setPendingTrialUpdate({ studentId, newStatus })
        setSelectedTeacherId('')
        setTrialSessionDate('')
        setTrialSessionTime('')
        setTrialSessionDuration('')
        setShowTeacherSelectModal(true)
        return
      }
      
      // If teacher_id exists and status is not 'booked', proceed with update
      await performTrialAttendanceUpdate(studentId, newStatus, student.teacher_id)
    } catch (error: any) {
      alert(error.message || 'فشل تحميل بيانات الطالب')
    }
  }

  const performTrialAttendanceUpdate = async (
    studentId: number, 
    newStatus: 'not_booked' | 'booked' | 'attended', 
    teacherId?: number,
    trialDate?: string,
    trialTime?: string,
    sessionDuration?: string
  ) => {
    // Prevent duplicate requests
    if (updatingTrialAttendance === studentId) {
      return
    }
    setUpdatingTrialAttendance(studentId)
    try {
      const updateData: any = { trial_session_attendance: newStatus }
      // Include teacher_id if provided
      if (teacherId) {
        updateData.teacher_id = teacherId
      }
      // Include trial_session_date, trial_session_time, session_duration only when status is 'booked'
      if (newStatus === 'booked') {
        if (trialDate) {
          updateData.trial_session_date = trialDate
        }
        if (trialTime) {
          updateData.trial_session_time = trialTime
        }
        if (sessionDuration && sessionDuration.trim() !== '') {
          const duration = parseInt(sessionDuration, 10)
          if (!isNaN(duration) && duration > 0) {
            updateData.session_duration = duration
          }
        }
      }
      await updateStudent(studentId, updateData)
      // Refresh the list
      const filters: any = { type: activeTab, per_page: 10000 }
      if (trialSessionFilter) filters.trial_session_attendance = trialSessionFilter
      if (teacherFilterId) filters.teacher_id = parseInt(teacherFilterId)
      fetchStudents(filters)
      // Update viewed student if it's the same
      if (viewingId === studentId) {
        const updatedStudent = await getStudent(studentId)
        setViewedStudent(updatedStudent)
      }
    } catch (error: any) {
      alert(error.message || 'فشل تحديث حالة جلسة التجربة')
    } finally {
      setUpdatingTrialAttendance(null)
    }
  }

  const handleConfirmTeacherSelection = async () => {
    if (!pendingTrialUpdate) {
      return
    }
    // Prevent duplicate submissions
    if (updatingTrialAttendance === pendingTrialUpdate.studentId) {
      return
    }
    
    // If status is 'booked', require teacher, date, and time
    if (pendingTrialUpdate.newStatus === 'booked') {
      if (!selectedTeacherId) {
        alert('يرجى اختيار معلم')
        return
      }
      if (!trialSessionDate) {
        alert('يرجى اختيار تاريخ جلسة التجربة')
        return
      }
      if (!trialSessionTime) {
        alert('يرجى اختيار وقت جلسة التجربة')
        return
      }
    } else {
      // For other statuses, only require teacher if not already set
      if (!selectedTeacherId) {
        alert('يرجى اختيار معلم')
        return
      }
    }
    
    setShowTeacherSelectModal(false)
    await performTrialAttendanceUpdate(
      pendingTrialUpdate.studentId,
      pendingTrialUpdate.newStatus,
      parseInt(selectedTeacherId),
      trialSessionDate || undefined,
      trialSessionTime || undefined,
      trialSessionDuration || undefined
    )
    setPendingTrialUpdate(null)
    setSelectedTeacherId('')
    setTrialSessionDate('')
    setTrialSessionTime('')
    setTrialSessionDuration('')
  }

  const getTrialAttendanceBadge = (status?: string) => {
    if (!status) return null
    switch (status) {
      case 'not_booked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            غير محجوز
          </span>
        )
      case 'booked':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            محجوز
          </span>
        )
      case 'attended':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            حضر
          </span>
        )
      default:
        return null
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

  // Filter to only show students of the active tab type
  const tabStudents = filteredStudents.filter(student => student.type === activeTab)

  return (
    <div className="min-w-0 overflow-x-hidden px-3 sm:px-4 lg:px-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-3xl lg:text-4xl font-bold text-primary-900">الطلاب</h1>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="text-primary-600 font-medium text-sm sm:text-base shrink-0">إجمالي: {tabStudents.length}</div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            <Plus className="w-4 h-4 shrink-0" />
            إضافة طالب
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg sm:rounded-xl border-2 border-primary-200 p-2 mb-4 sm:mb-6 shadow-lg">
        <div className="flex gap-2 min-w-0">
          <button
            onClick={() => setActiveTab('website')}
            className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'website'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            طلاب الموقع
          </button>
          <button
            onClick={() => setActiveTab('app')}
            className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all text-sm sm:text-base ${
              activeTab === 'app'
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-primary-50 text-primary-700 hover:bg-primary-100'
            }`}
          >
            طلاب التطبيق
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Search and Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl border-2 border-primary-200 p-3 sm:p-4 mb-4 sm:mb-6 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 min-w-0">
          <div className="relative min-w-0">
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
          <div className="min-w-0">
            <select
              value={trialSessionFilter}
              onChange={(e) => setTrialSessionFilter(e.target.value as 'not_booked' | 'booked' | 'attended' | '')}
              className="w-full min-w-0 px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
              dir="rtl"
            >
              <option value="">جميع الحالات</option>
              <option value="not_booked">غير محجوز</option>
              <option value="booked">محجوز</option>
              <option value="attended">حضر</option>
            </select>
          </div>
          <div className="min-w-0">
            <SearchableTeacherSelect
              value={teacherFilterId}
              onChange={(value) => setTeacherFilterId(value)}
              teachers={teachers}
              placeholder="جميع المعلمين"
            />
          </div>
        </div>
      </div>

      {/* Students Table */}
      {isLoadingStudents ? (
        <div className="flex items-center justify-center py-10 sm:py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : tabStudents.length === 0 ? (
        <div className="bg-white rounded-lg sm:rounded-xl border-2 border-primary-200 p-6 sm:p-8 text-center text-primary-600 text-sm sm:text-base shadow-lg">
          {searchTerm || trialSessionFilter || teacherFilterId ? 'لا توجد نتائج' : `لا يوجد طلاب مسجلون ${activeTab === 'website' ? 'من الموقع' : 'من التطبيق'} بعد`}
        </div>
      ) : (
        <>
          {/* Mobile Card View */}
          <div className="md:hidden space-y-3 sm:space-y-4">
            {tabStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg sm:rounded-xl border-2 border-primary-200 p-3 sm:p-4 shadow-lg overflow-hidden min-w-0"
              >
                <div className="flex items-start justify-between gap-2 mb-3 min-w-0">
                  <h3 className="text-base sm:text-lg font-bold text-primary-900 truncate min-w-0">{student.name}</h3>
                </div>
                <div className="space-y-2 text-sm min-w-0">
                  <div className="flex justify-between gap-2 min-w-0">
                    <span className="text-primary-600 shrink-0">الهاتف:</span>
                    <span className="text-primary-900 font-medium truncate text-left" dir="ltr">{student.phone}</span>
                  </div>
                  {student.email && (
                    <div className="flex justify-between gap-2 min-w-0">
                      <span className="text-primary-600 shrink-0">البريد:</span>
                      <span className="text-primary-900 truncate text-left min-w-0">{student.email}</span>
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
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600">جلسة التجربة:</span>
                    <div className="flex flex-col items-end gap-2">
                      {getTrialAttendanceBadge(student.trial_session_attendance)}
                      <select
                        value={student.trial_session_attendance || 'not_booked'}
                        onChange={(e) => handleUpdateTrialAttendance(student.id, e.target.value as 'not_booked' | 'booked' | 'attended')}
                        disabled={updatingTrialAttendance === student.id}
                        className="text-xs px-2 py-1 border border-primary-300 rounded-lg focus:border-primary-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        dir="rtl"
                      >
                        <option value="not_booked">غير محجوز</option>
                        <option value="booked">محجوز</option>
                        <option value="attended">حضر</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center flex-wrap gap-1 sm:gap-2 mt-4 pt-4 border-t border-primary-200">
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
                  <button
                    onClick={() => handleForceDelete(student.id)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="حذف نهائي"
                  >
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-lg lg:rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] text-sm lg:text-base">
                <thead className="bg-primary-100">
                  <tr>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-right text-primary-900 font-semibold whitespace-nowrap">الاسم</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-right text-primary-900 font-semibold whitespace-nowrap">البريد</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-right text-primary-900 font-semibold whitespace-nowrap">الهاتف</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-right text-primary-900 font-semibold whitespace-nowrap">العمر</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-right text-primary-900 font-semibold whitespace-nowrap">الجنس</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-right text-primary-900 font-semibold whitespace-nowrap">الباقة</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-right text-primary-900 font-semibold whitespace-nowrap">المعلم</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-primary-900 font-semibold whitespace-nowrap">جلسة التجربة</th>
                    <th className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-center text-primary-900 font-semibold whitespace-nowrap">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {tabStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-primary-200 hover:bg-primary-50 transition-colors"
                    >
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-primary-900 font-medium max-w-[120px] lg:max-w-none truncate" title={student.name}>{student.name}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-primary-700 max-w-[100px] lg:max-w-none truncate" title={student.email || ''}>{student.email || '-'}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-primary-700 whitespace-nowrap" dir="ltr">{student.phone}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-primary-700">{student.age || '-'}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-primary-700">{student.gender_label || (student.gender === 'male' ? 'ذكر' : 'أنثى')}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-primary-700 max-w-[100px] truncate" title={student.package?.name || ''}>{student.package?.name || '-'}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4 text-primary-700 max-w-[100px] truncate" title={student.teacher?.name || ''}>{student.teacher?.name || '-'}</td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
                        <div className="flex flex-col items-center gap-2">
                          {getTrialAttendanceBadge(student.trial_session_attendance)}
                          <select
                            value={student.trial_session_attendance || 'not_booked'}
                            onChange={(e) => handleUpdateTrialAttendance(student.id, e.target.value as 'not_booked' | 'booked' | 'attended')}
                            disabled={updatingTrialAttendance === student.id}
                            className="text-xs px-2 py-1 border border-primary-300 rounded-lg focus:border-primary-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            dir="rtl"
                          >
                            <option value="not_booked">غير محجوز</option>
                            <option value="booked">محجوز</option>
                            <option value="attended">حضر</option>
                          </select>
                        </div>
                      </td>
                      <td className="px-3 py-2 md:px-4 md:py-3 lg:px-6 lg:py-4">
                        <div className="flex items-center justify-center gap-1 lg:gap-2 flex-wrap">
                          <button
                            onClick={() => handleViewStudent(student.id)}
                            className="p-1.5 lg:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="عرض التفاصيل"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(student)}
                            className="p-1.5 lg:p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="p-1.5 lg:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleForceDelete(student.id)}
                            className="p-1.5 lg:p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="حذف نهائي"
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add Student Modal (basic data only) */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto min-h-[50vh] sm:min-h-0"
            >
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primary-900 min-w-0">إضافة طالب جديد (بيانات أساسية)</h2>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الاسم الكامل</label>
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
                    <label className="block text-primary-900 font-semibold mb-2 text-right">البريد الإلكتروني (اختياري)</label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">رقم الهاتف</label>
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
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الباقة (اختياري)</label>
                    <select
                      value={newStudent.package_id}
                      onChange={(e) => setNewStudent({ ...newStudent, package_id: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                    >
                      <option value="">اختر الباقة</option>
                      {packages.map((pkg) => (
                        <option key={pkg.id} value={pkg.id}>
                          {pkg.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم (اختياري)</label>
                    <SearchableTeacherSelect
                      value={newStudent.teacher_id}
                      onChange={(value) => setNewStudent({ ...newStudent, teacher_id: value })}
                      teachers={teachers}
                      placeholder="اختر المعلم"
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الدولة (اختياري)</label>
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
                  <div className="sm:col-span-2">
                    <label className="block text-primary-900 font-semibold mb-2 text-right">ملاحظات (اختياري)</label>
                    <textarea
                      value={newStudent.notes}
                      onChange={(e) => setNewStudent({ ...newStudent, notes: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right resize-none"
                      dir="rtl"
                      rows={2}
                    />
                  </div>
                </div>
                <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 border-2 border-primary-200 text-primary-700 rounded-lg hover:bg-primary-50 transition-colors"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : 'إضافة الطالب'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Student Details Modal */}
      <AnimatePresence>
        {showViewModal && viewedStudent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto min-h-[50vh] sm:min-h-0"
            >
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primary-900 min-w-0">تفاصيل الطالب</h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="min-w-0">
                    <label className="block text-primary-600 text-sm mb-1">الاسم</label>
                    <p className="text-primary-900 font-semibold text-base sm:text-lg break-words">{viewedStudent.name}</p>
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
                  {viewedStudent.trial_session_attendance && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">حالة جلسة التجربة</label>
                      <div className="mt-1">
                        {getTrialAttendanceBadge(viewedStudent.trial_session_attendance)}
                      </div>
                    </div>
                  )}
                  {viewedStudent.monthly_subscription_price && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">سعر الاشتراك الشهري</label>
                      <p className="text-primary-900 font-semibold text-lg">
                        {viewedStudent.monthly_subscription_price} {viewedStudent.currency || 'EGP'}
                      </p>
                    </div>
                  )}
                  {viewedStudent.country && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">البلد</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.country}</p>
                    </div>
                  )}
                  {viewedStudent.currency && (
                    <div>
                      <label className="block text-primary-600 text-sm mb-1">العملة</label>
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.currency}</p>
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
                      <p className="text-primary-900 font-semibold text-lg">{viewedStudent.hourly_rate} جنيه</p>
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
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={handleCloseEditModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto min-h-[50vh] sm:min-h-0"
            >
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primary-900 min-w-0">تعديل بيانات الطالب</h2>
                <button
                  onClick={handleCloseEditModal}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 min-w-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="min-w-0">
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
                    <SearchableTeacherSelect
                      value={editForm.teacher_id}
                      onChange={(value) => setEditForm({ ...editForm, teacher_id: value })}
                      teachers={teachers}
                      placeholder="اختر المعلم (اختياري)"
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
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">سعر الاشتراك الشهري</label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={editForm.monthly_subscription_price}
                      onChange={(e) => setEditForm({ ...editForm, monthly_subscription_price: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      placeholder=""
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">عدد الأشهر المدفوعة</label>
                    <input
                      type="number"
                      min="0"
                      value={editForm.paid_months_count === '' ? '' : editForm.paid_months_count}
                      onChange={(e) => setEditForm({ ...editForm, paid_months_count: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      placeholder=""
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

                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ التعديلات'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseEditModal}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Teacher Selection Modal for Trial Attendance */}
      <AnimatePresence>
        {showTeacherSelectModal && pendingTrialUpdate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
            onClick={() => {
              setShowTeacherSelectModal(false)
              setPendingTrialUpdate(null)
              setSelectedTeacherId('')
              setTrialSessionDate('')
              setTrialSessionTime('')
              setTrialSessionDuration('')
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-t-2xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-primary-900 min-w-0">
                  {pendingTrialUpdate.newStatus === 'booked' ? 'حجز جلسة التجربة' : 'اختر المعلم'}
                </h2>
                <button
                  onClick={() => {
                    setShowTeacherSelectModal(false)
                    setPendingTrialUpdate(null)
                    setSelectedTeacherId('')
                    setTrialSessionDate('')
                    setTrialSessionTime('')
                    setTrialSessionDuration('')
                  }}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-primary-700 text-right">
                  {pendingTrialUpdate.newStatus === 'booked' 
                    ? 'يرجى اختيار المعلم وتاريخ ووقت جلسة التجربة'
                    : 'يجب اختيار معلم لتحديث حالة جلسة التجربة'}
                </p>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم</label>
                  <SearchableTeacherSelect
                    value={selectedTeacherId}
                    onChange={(value) => setSelectedTeacherId(value)}
                    teachers={teachers}
                    placeholder="اختر المعلم"
                  />
                </div>
                {pendingTrialUpdate.newStatus === 'booked' && (
                  <>
                    <div>
                      <label className="block text-primary-900 font-semibold mb-2 text-right">تاريخ جلسة التجربة</label>
                      <input
                        type="date"
                        value={trialSessionDate}
                        onChange={(e) => setTrialSessionDate(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-primary-900 font-semibold mb-2 text-right">وقت جلسة التجربة</label>
                      <input
                        type="time"
                        value={trialSessionTime}
                        onChange={(e) => setTrialSessionTime(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-primary-900 font-semibold mb-2 text-right">مدة الحصة (دقيقة)</label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        value={trialSessionDuration}
                        onChange={(e) => setTrialSessionDuration(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                        dir="rtl"
                        placeholder="مثال: 30"
                      />
                    </div>
                  </>
                )}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 pt-4">
                  <button
                    onClick={handleConfirmTeacherSelection}
                    disabled={
                      !selectedTeacherId || 
                      (pendingTrialUpdate.newStatus === 'booked' && (!trialSessionDate || !trialSessionTime))
                    }
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    تأكيد
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowTeacherSelectModal(false)
                      setPendingTrialUpdate(null)
                      setSelectedTeacherId('')
                      setTrialSessionDate('')
                      setTrialSessionTime('')
                      setTrialSessionDuration('')
                    }}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
