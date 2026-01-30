'use client'

import { useEffect, useState, useRef } from 'react'
import { Calendar as CalendarIcon, Clock, X, User, GraduationCap, CheckCircle, AlertCircle, Filter, Search, ChevronDown, FileText, Star } from 'lucide-react'
import { getSessionsByDate, StudentSession, SessionReport, SessionEvaluation } from '@/lib/api/sessions'
import { useAdminStore } from '@/store/useAdminStore'
import { motion, AnimatePresence } from 'framer-motion'

export default function SessionsPage() {
  const { teachers, fetchTeachers } = useAdminStore()
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Get today's date in YYYY-MM-DD format
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('')
  const [sessions, setSessions] = useState<StudentSession[]>([])
  const [statistics, setStatistics] = useState<{
    total_sessions: number
    completed_sessions: number
    pending_sessions: number
  } | null>(null)
  const [selectedSession, setSelectedSession] = useState<StudentSession | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Custom dropdown states
  const [isTeacherDropdownOpen, setIsTeacherDropdownOpen] = useState(false)
  const [teacherSearchTerm, setTeacherSearchTerm] = useState('')
  const teacherDropdownRef = useRef<HTMLDivElement>(null)

  // Fetch teachers on mount
  useEffect(() => {
    fetchTeachers(1, 1000)
  }, [fetchTeachers])

  // Load sessions for selected date and teacher
  useEffect(() => {
    const loadSessions = async () => {
      setLoading(true)
      try {
        const teacherId = selectedTeacherId ? parseInt(selectedTeacherId) : undefined
        const data = await getSessionsByDate(selectedDate, undefined, teacherId)
        setSessions(data?.sessions || [])
        setStatistics(data?.statistics || null)
      } catch (error) {
        console.error('Error loading sessions:', error)
        setSessions([])
        setStatistics(null)
      } finally {
        setLoading(false)
      }
    }
    loadSessions()
  }, [selectedDate, selectedTeacherId])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (teacherDropdownRef.current && !teacherDropdownRef.current.contains(event.target as Node)) {
        setIsTeacherDropdownOpen(false)
        setTeacherSearchTerm('')
      }
    }

    if (isTeacherDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isTeacherDropdownOpen])

  // Filter teachers based on search term
  const filteredTeachers = teachers.filter((teacher) => {
    if (!teacherSearchTerm) return true
    const search = teacherSearchTerm.toLowerCase()
    return (
      teacher.name.toLowerCase().includes(search) ||
      teacher.name_en?.toLowerCase().includes(search) ||
      teacher.specialization.toLowerCase().includes(search) ||
      teacher.specialization_en?.toLowerCase().includes(search)
    )
  })

  // Get selected teacher name
  const selectedTeacher = teachers.find((t) => t.id.toString() === selectedTeacherId)

  const handleTeacherSelect = (teacherId: string) => {
    setSelectedTeacherId(teacherId)
    setIsTeacherDropdownOpen(false)
    setTeacherSearchTerm('')
  }

  const handleSessionClick = (session: StudentSession) => {
    setSelectedSession(session)
    setIsModalOpen(true)
  }

  return (
    <div className="px-2 sm:px-0">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900 mb-6 sm:mb-8">الحصص اليومية</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Picker */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
            <div className="p-4 sm:p-6 border-b border-primary-200">
              <h2 className="text-lg sm:text-xl font-bold text-primary-900 mb-4">الفلترة</h2>
              
              {/* Date Picker */}
              <div className="mb-4">
                <label className="block text-primary-900 font-semibold mb-2 text-right">التاريخ</label>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="w-5 h-5 text-primary-600" />
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="flex-1 px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-primary-900"
                  />
                </div>
              </div>

              {/* Teacher Filter */}
              <div>
                <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم</label>
                <div className="relative" ref={teacherDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsTeacherDropdownOpen(!isTeacherDropdownOpen)}
                    className="w-full flex items-center gap-3 px-4 py-2 border-2 border-primary-300 rounded-lg focus:outline-none focus:border-primary-500 text-primary-900 bg-white hover:bg-primary-50 transition-colors"
                    dir="rtl"
                  >
                    <Filter className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span className="flex-1 text-right">
                      {selectedTeacher ? selectedTeacher.name : 'جميع المعلمين'}
                    </span>
                    <ChevronDown className={`w-5 h-5 text-primary-600 flex-shrink-0 transition-transform ${isTeacherDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isTeacherDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-full mt-2 bg-white border-2 border-primary-200 rounded-lg shadow-xl max-h-64 overflow-hidden"
                        dir="rtl"
                      >
                        {/* Search Input */}
                        <div className="p-3 border-b border-primary-200">
                          <div className="relative">
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                            <input
                              type="text"
                              value={teacherSearchTerm}
                              onChange={(e) => setTeacherSearchTerm(e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="ابحث عن معلم..."
                              className="w-full pr-10 pl-3 py-2 border-2 border-primary-200 rounded-lg focus:outline-none focus:border-primary-500 text-sm text-right"
                              dir="rtl"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Options List */}
                        <div className="max-h-48 overflow-y-auto">
                          {/* All Teachers Option */}
                          <button
                            type="button"
                            onClick={() => handleTeacherSelect('')}
                            className={`w-full px-4 py-2 text-right hover:bg-primary-50 transition-colors ${
                              selectedTeacherId === '' ? 'bg-primary-100 text-primary-900 font-semibold' : 'text-primary-700'
                            }`}
                          >
                            جميع المعلمين
                          </button>

                          {/* Filtered Teachers */}
                          {filteredTeachers.length === 0 ? (
                            <div className="px-4 py-8 text-center text-primary-600 text-sm">
                              لا توجد نتائج
                            </div>
                          ) : (
                            filteredTeachers.map((teacher) => (
                              <button
                                key={teacher.id}
                                type="button"
                                onClick={() => handleTeacherSelect(teacher.id.toString())}
                                className={`w-full px-4 py-2 text-right hover:bg-primary-50 transition-colors ${
                                  selectedTeacherId === teacher.id.toString()
                                    ? 'bg-primary-100 text-primary-900 font-semibold'
                                    : 'text-primary-700'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{teacher.name}</span>
                                  {teacher.specialization && (
                                    <span className="text-xs text-primary-500 mr-2">{teacher.specialization}</span>
                                  )}
                                </div>
                              </button>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Statistics */}
            {statistics && (
              <div className="p-4 sm:p-6 space-y-3">
                <h3 className="text-base sm:text-lg font-semibold text-primary-900 mb-3">إحصائيات اليوم</h3>
                <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border-2 border-blue-200">
                  <div className="text-blue-700 text-xs sm:text-sm mb-1">إجمالي الحصص</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-900">{statistics.total_sessions}</div>
                </div>
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg border-2 border-green-200">
                  <div className="text-green-700 text-xs sm:text-sm mb-1">الحصص المكتملة</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-900">{statistics.completed_sessions}</div>
                </div>
                <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border-2 border-yellow-200">
                  <div className="text-yellow-700 text-xs sm:text-sm mb-1">الحصص قيد الانتظار</div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-900">{statistics.pending_sessions}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
            <div className="p-4 sm:p-6 border-b border-primary-200">
              <h2 className="text-lg sm:text-xl font-bold text-primary-900">
                الحصص في {new Date(selectedDate).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </h2>
            </div>

            <div className="p-4 sm:p-6">
              {loading ? (
                <div className="text-center py-8 sm:py-12 text-primary-600">
                  <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm sm:text-base">جاري تحميل الحصص...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-8 sm:py-12 text-primary-600">
                  <CalendarIcon className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-primary-300" />
                  <p className="text-base sm:text-lg">لا توجد حصص في هذا التاريخ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session, index) => (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="bg-primary-50 p-3 sm:p-4 rounded-lg border-2 border-primary-200 hover:bg-primary-100 hover:border-primary-300 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between gap-3 sm:gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <span className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary-600 text-white font-bold text-base sm:text-lg flex-shrink-0">
                              {(session as any).session_number || index + 1}
                            </span>
                            <div>
                              <div className="text-base sm:text-lg font-bold text-primary-900">{session.session_time}</div>
                              <div className="text-xs sm:text-sm text-primary-600">{session.day_of_week_label || session.day_of_week}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mt-2 sm:mt-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <User className="w-4 h-4 text-primary-600 flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-primary-700 font-medium">الطالب:</span>
                              <span className="text-xs sm:text-sm text-primary-900 break-words">{session.student?.name || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <GraduationCap className="w-4 h-4 text-primary-600 flex-shrink-0" />
                              <span className="text-xs sm:text-sm text-primary-700 font-medium">المعلم:</span>
                              <span className="text-xs sm:text-sm text-primary-900 break-words">{session.teacher?.name || '-'}</span>
                            </div>
                          </div>

                          {session.notes && (
                            <div className="mt-2 sm:mt-3 text-xs sm:text-sm text-primary-600 bg-white p-2 rounded border border-primary-200">
                              <span className="font-medium">ملاحظات:</span> {session.notes}
                            </div>
                          )}
                          {session.reports && session.reports.length > 0 && (
                            <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-xs sm:text-sm text-primary-600">
                              <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>{session.reports.length} تقرير</span>
                            </div>
                          )}
                          {session.evaluation && (
                            <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-xs sm:text-sm text-amber-600">
                              <Star className="w-3.5 h-3.5 flex-shrink-0" />
                              <span>تقييم الطالب</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2 ${
                              session.is_completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {session.is_completed ? (
                              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            ) : (
                              <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            )}
                            <span className="whitespace-nowrap">{session.status_label || (session.is_completed ? 'مكتملة' : 'قيد الانتظار')}</span>
                          </span>
                          {session.new_date && (
                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded whitespace-nowrap">
                              مؤجلة
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Session Details Modal */}
      <AnimatePresence>
        {isModalOpen && selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-primary-200 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-primary-900">تفاصيل الحصة</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <X className="w-5 h-5 text-primary-700" />
                </button>
              </div>

              <div className="p-4 sm:p-6 space-y-4">
                {/* Session Number */}
                <div className="flex items-center justify-center mb-4">
                  <span className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-primary-600 text-white font-bold text-xl sm:text-2xl">
                    {(selectedSession as any).session_number || '-'}
                  </span>
                </div>

                {/* Student Info */}
                <div className="bg-primary-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    <h3 className="text-sm sm:text-base font-semibold text-primary-900">الطالب</h3>
                  </div>
                  <p className="text-sm sm:text-base text-primary-700 break-words">{selectedSession.student?.name || '-'}</p>
                </div>

                {/* Teacher Info */}
                <div className="bg-primary-50 p-3 sm:p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                    <h3 className="text-sm sm:text-base font-semibold text-primary-900">المعلم</h3>
                  </div>
                  <p className="text-sm sm:text-base text-primary-700 break-words">{selectedSession.teacher?.name || '-'}</p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-primary-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                      <h3 className="text-sm sm:text-base font-semibold text-primary-900">التاريخ</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-primary-700">
                      {new Date(selectedSession.session_date).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </p>
                    <p className="text-xs text-primary-600 mt-1">
                      {selectedSession.day_of_week_label || selectedSession.day_of_week}
                    </p>
                  </div>

                  <div className="bg-primary-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-primary-600" />
                      <h3 className="text-sm sm:text-base font-semibold text-primary-900">الوقت</h3>
                    </div>
                    <p className="text-sm sm:text-base text-primary-700">{selectedSession.session_time}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-primary-50 p-3 sm:p-4 rounded-lg">
                  <h3 className="text-sm sm:text-base font-semibold text-primary-900 mb-2">الحالة</h3>
                  <span
                    className={`inline-block px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                      selectedSession.is_completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedSession.status_label || (selectedSession.is_completed ? 'مكتملة' : 'قيد الانتظار')}
                  </span>
                  {selectedSession.completed_at && (
                    <p className="text-xs sm:text-sm text-primary-600 mt-2">
                      تم الإكمال في: {new Date(selectedSession.completed_at).toLocaleString('ar-EG')}
                    </p>
                  )}
                </div>

                {/* Rescheduled Info */}
                {selectedSession.new_date && (
                  <div className="bg-yellow-50 p-3 sm:p-4 rounded-lg border-2 border-yellow-200">
                    <h3 className="text-sm sm:text-base font-semibold text-primary-900 mb-2">تم تأجيل الحصة</h3>
                    <p className="text-xs sm:text-sm text-primary-700">
                      التاريخ الجديد: {new Date(selectedSession.new_date).toLocaleDateString('ar-EG')}
                    </p>
                    {selectedSession.new_time && (
                      <p className="text-xs sm:text-sm text-primary-700">الوقت الجديد: {selectedSession.new_time}</p>
                    )}
                    {selectedSession.reason && (
                      <p className="text-xs sm:text-sm text-primary-700 mt-2 break-words">السبب: {selectedSession.reason}</p>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedSession.notes && (
                  <div className="bg-primary-50 p-3 sm:p-4 rounded-lg">
                    <h3 className="text-sm sm:text-base font-semibold text-primary-900 mb-2">ملاحظات</h3>
                    <p className="text-xs sm:text-sm text-primary-700 break-words">{selectedSession.notes}</p>
                  </div>
                )}

                {/* Student Evaluation */}
                {selectedSession.evaluation && (
                  <div className="border-2 border-amber-200 rounded-xl overflow-hidden bg-amber-50/50">
                    <div className="bg-amber-100 px-4 py-3 flex items-center gap-2">
                      <Star className="w-5 h-5 text-amber-700" />
                      <h3 className="text-base font-bold text-primary-900">تقييم الطالب</h3>
                      {selectedSession.evaluation.created_at && (
                        <span className="mr-auto text-xs text-amber-700">
                          {new Date(selectedSession.evaluation.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      )}
                    </div>
                    <div className="p-4 sm:p-5 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                        {selectedSession.evaluation.satisfaction_level_label && (
                          <div>
                            <p className="text-primary-600 font-medium mb-0.5">مستوى الرضا</p>
                            <p className="text-primary-900 font-medium">{selectedSession.evaluation.satisfaction_level_label}</p>
                          </div>
                        )}
                        {selectedSession.evaluation.student_progress_label && (
                          <div>
                            <p className="text-primary-600 font-medium mb-0.5">تقدم الطالب</p>
                            <p className="text-primary-900 font-medium">{selectedSession.evaluation.student_progress_label}</p>
                          </div>
                        )}
                        {selectedSession.evaluation.noise_in_session_label && (
                          <div>
                            <p className="text-primary-600 font-medium mb-0.5">ضجيج في الحصة</p>
                            <p className="text-primary-900 font-medium">{selectedSession.evaluation.noise_in_session_label}</p>
                          </div>
                        )}
                        {selectedSession.evaluation.internet_quality_label && (
                          <div>
                            <p className="text-primary-600 font-medium mb-0.5">جودة الإنترنت</p>
                            <p className="text-primary-900 font-medium">{selectedSession.evaluation.internet_quality_label}</p>
                          </div>
                        )}
                        {selectedSession.evaluation.teacher_camera_on_label && (
                          <div>
                            <p className="text-primary-600 font-medium mb-0.5">كاميرا المعلم</p>
                            <p className="text-primary-900 font-medium">{selectedSession.evaluation.teacher_camera_on_label}</p>
                          </div>
                        )}
                        {selectedSession.evaluation.screen_sharing_on_label && (
                          <div>
                            <p className="text-primary-600 font-medium mb-0.5">مشاركة الشاشة</p>
                            <p className="text-primary-900 font-medium">{selectedSession.evaluation.screen_sharing_on_label}</p>
                          </div>
                        )}
                        {selectedSession.evaluation.would_recommend_label && (
                          <div>
                            <p className="text-primary-600 font-medium mb-0.5">هل تنصح بالأكاديمية</p>
                            <p className="text-primary-900 font-medium">{selectedSession.evaluation.would_recommend_label}</p>
                          </div>
                        )}
                      </div>
                      {selectedSession.evaluation.academy_advantages && (
                        <div className="p-2 bg-white rounded-lg border border-amber-200">
                          <p className="text-primary-600 font-medium text-xs mb-0.5">مميزات الأكاديمية</p>
                          <p className="text-primary-800 text-sm break-words">{selectedSession.evaluation.academy_advantages}</p>
                        </div>
                      )}
                      {selectedSession.evaluation.notes && (
                        <div className="p-2 bg-white rounded-lg border border-amber-200">
                          <p className="text-primary-600 font-medium text-xs mb-0.5">ملاحظات</p>
                          <p className="text-primary-800 text-sm break-words">{selectedSession.evaluation.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Reports */}
                {selectedSession.reports && selectedSession.reports.length > 0 && (
                  <div className="border-2 border-primary-200 rounded-xl overflow-hidden">
                    <div className="bg-primary-100 px-4 py-3 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-primary-700" />
                      <h3 className="text-base font-bold text-primary-900">تقارير الحصة ({selectedSession.reports.length})</h3>
                    </div>
                    <div className="divide-y divide-primary-200">
                      {selectedSession.reports.map((report: SessionReport, idx: number) => (
                        <div key={report.id} className="p-4 sm:p-5 bg-white">
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-semibold text-primary-600">تقرير #{idx + 1}</span>
                            {report.created_at && (
                              <span className="text-xs text-primary-500">
                                {new Date(report.created_at).toLocaleString('ar-EG', { dateStyle: 'short', timeStyle: 'short' })}
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 text-sm mb-3">
                            <div>
                              <p className="text-primary-600 font-medium mb-0.5">الحفظ الجديد</p>
                              <p className="text-primary-900 break-words">{report.new_memorization || '-'}</p>
                              {report.new_memorization_level_label && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                                  {report.new_memorization_level_label}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="text-primary-600 font-medium mb-0.5">المراجعة</p>
                              <p className="text-primary-900 break-words">{report.review || '-'}</p>
                              {report.review_level_label && (
                                <span className="inline-block mt-1 px-2 py-0.5 bg-primary-100 text-primary-800 rounded text-xs font-medium">
                                  {report.review_level_label}
                                </span>
                              )}
                            </div>
                          </div>
                          {report.notes && (
                            <div className="mb-3 p-2 bg-primary-50 rounded-lg border border-primary-200">
                              <p className="text-primary-600 font-medium text-xs mb-0.5">ملاحظات</p>
                              <p className="text-primary-800 text-sm break-words">{report.notes}</p>
                            </div>
                          )}
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-primary-600">
                            {report.student && <span>الطالب: {report.student.name}</span>}
                            {report.teacher && <span>المعلم: {report.teacher.name}</span>}
                            {report.created_by && <span>أنشئ بواسطة: {report.created_by.name}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Created At */}
                {selectedSession.created_at && (
                  <div className="text-xs sm:text-sm text-primary-600">
                    تم الإنشاء: {new Date(selectedSession.created_at).toLocaleString('ar-EG')}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
