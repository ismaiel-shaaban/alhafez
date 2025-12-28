'use client'

import { useEffect, useState, useRef } from 'react'
import { Calendar as CalendarIcon, Clock, X, User, GraduationCap, CheckCircle, AlertCircle, Filter, Search, ChevronDown } from 'lucide-react'
import { getSessionsByDate, StudentSession } from '@/lib/api/sessions'
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
    <div>
      <h1 className="text-4xl font-bold text-primary-900 mb-8">الحصص اليومية</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Picker */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
            <div className="p-6 border-b border-primary-200">
              <h2 className="text-xl font-bold text-primary-900 mb-4">الفلترة</h2>
              
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
              <div className="p-6 space-y-3">
                <h3 className="text-lg font-semibold text-primary-900 mb-3">إحصائيات اليوم</h3>
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200">
                  <div className="text-blue-700 text-sm mb-1">إجمالي الحصص</div>
                  <div className="text-2xl font-bold text-blue-900">{statistics.total_sessions}</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                  <div className="text-green-700 text-sm mb-1">الحصص المكتملة</div>
                  <div className="text-2xl font-bold text-green-900">{statistics.completed_sessions}</div>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                  <div className="text-yellow-700 text-sm mb-1">الحصص قيد الانتظار</div>
                  <div className="text-2xl font-bold text-yellow-900">{statistics.pending_sessions}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sessions List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
            <div className="p-6 border-b border-primary-200">
              <h2 className="text-xl font-bold text-primary-900">
                الحصص في {new Date(selectedDate).toLocaleDateString('ar-EG', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  weekday: 'long'
                })}
              </h2>
            </div>

            <div className="p-6">
              {loading ? (
                <div className="text-center py-12 text-primary-600">
                  <div className="inline-block w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>جاري تحميل الحصص...</p>
                </div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-12 text-primary-600">
                  <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-primary-300" />
                  <p className="text-lg">لا توجد حصص في هذا التاريخ</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      onClick={() => handleSessionClick(session)}
                      className="bg-primary-50 p-4 rounded-lg border-2 border-primary-200 hover:bg-primary-100 hover:border-primary-300 cursor-pointer transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="bg-primary-200 p-2 rounded-lg">
                              <Clock className="w-5 h-5 text-primary-700" />
                            </div>
                            <div>
                              <div className="text-lg font-bold text-primary-900">{session.session_time}</div>
                              <div className="text-sm text-primary-600">{session.day_of_week_label || session.day_of_week}</div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary-600" />
                              <span className="text-primary-700 font-medium">الطالب:</span>
                              <span className="text-primary-900">{session.student?.name || '-'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <GraduationCap className="w-4 h-4 text-primary-600" />
                              <span className="text-primary-700 font-medium">المعلم:</span>
                              <span className="text-primary-900">{session.teacher?.name || '-'}</span>
                            </div>
                          </div>

                          {session.notes && (
                            <div className="mt-3 text-sm text-primary-600 bg-white p-2 rounded border border-primary-200">
                              <span className="font-medium">ملاحظات:</span> {session.notes}
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                              session.is_completed
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {session.is_completed ? (
                              <CheckCircle className="w-4 h-4" />
                            ) : (
                              <AlertCircle className="w-4 h-4" />
                            )}
                            {session.status_label || (session.is_completed ? 'مكتملة' : 'قيد الانتظار')}
                          </span>
                          {session.new_date && (
                            <span className="text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded">
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

              <div className="p-6 space-y-4">
                {/* Student Info */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-primary-900">الطالب</h3>
                  </div>
                  <p className="text-primary-700">{selectedSession.student?.name || '-'}</p>
                </div>

                {/* Teacher Info */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="w-5 h-5 text-primary-600" />
                    <h3 className="font-semibold text-primary-900">المعلم</h3>
                  </div>
                  <p className="text-primary-700">{selectedSession.teacher?.name || '-'}</p>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CalendarIcon className="w-5 h-5 text-primary-600" />
                      <h3 className="font-semibold text-primary-900">التاريخ</h3>
                    </div>
                    <p className="text-primary-700">
                      {new Date(selectedSession.session_date).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'long'
                      })}
                    </p>
                    <p className="text-sm text-primary-600 mt-1">
                      {selectedSession.day_of_week_label || selectedSession.day_of_week}
                    </p>
                  </div>

                  <div className="bg-primary-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-primary-600" />
                      <h3 className="font-semibold text-primary-900">الوقت</h3>
                    </div>
                    <p className="text-primary-700">{selectedSession.session_time}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-primary-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-primary-900 mb-2">الحالة</h3>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      selectedSession.is_completed
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {selectedSession.status_label || (selectedSession.is_completed ? 'مكتملة' : 'قيد الانتظار')}
                  </span>
                  {selectedSession.completed_at && (
                    <p className="text-sm text-primary-600 mt-2">
                      تم الإكمال في: {new Date(selectedSession.completed_at).toLocaleString('ar-EG')}
                    </p>
                  )}
                </div>

                {/* Rescheduled Info */}
                {selectedSession.new_date && (
                  <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-200">
                    <h3 className="font-semibold text-primary-900 mb-2">تم تأجيل الحصة</h3>
                    <p className="text-primary-700">
                      التاريخ الجديد: {new Date(selectedSession.new_date).toLocaleDateString('ar-EG')}
                    </p>
                    {selectedSession.new_time && (
                      <p className="text-primary-700">الوقت الجديد: {selectedSession.new_time}</p>
                    )}
                    {selectedSession.reason && (
                      <p className="text-primary-700 mt-2">السبب: {selectedSession.reason}</p>
                    )}
                  </div>
                )}

                {/* Notes */}
                {selectedSession.notes && (
                  <div className="bg-primary-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-primary-900 mb-2">ملاحظات</h3>
                    <p className="text-primary-700">{selectedSession.notes}</p>
                  </div>
                )}

                {/* Created At */}
                {selectedSession.created_at && (
                  <div className="text-sm text-primary-600">
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
