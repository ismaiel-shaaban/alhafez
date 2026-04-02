'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, Search, User, GraduationCap, UserCog, ChevronDown, ChevronUp } from 'lucide-react'
import { listSessionSystemLogs, type SessionSystemLog } from '@/lib/api/session-system-logs'
import type { Pagination } from '@/lib/api-client'
import { useAdminStore } from '@/store/useAdminStore'
import SearchableTeacherSelect from '@/components/admin/SearchableTeacherSelect'

const SESSION_SYSTEM_LOGS_PER_PAGE = 20

function formatValuesBlock(values: Record<string, unknown> | null | undefined) {
  if (!values || typeof values !== 'object') return '—'
  try {
    return JSON.stringify(values, null, 2)
  } catch {
    return String(values)
  }
}

export default function SessionSystemLogsPage() {
  const { teachers, fetchTeachers } = useAdminStore()
  const [logs, setLogs] = useState<SessionSystemLog[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    search: '',
    teacher_id: '',
  })

  useEffect(() => {
    fetchTeachers(1, 1000)
  }, [fetchTeachers])

  const patchFilters = (patch: Partial<typeof filters>) => {
    setFilters((f) => ({ ...f, ...patch }))
    setCurrentPage(1)
  }

  useEffect(() => {
    const loadLogs = async () => {
      setLoading(true)
      try {
        const api: Parameters<typeof listSessionSystemLogs>[0] = {
          page: currentPage,
          per_page: SESSION_SYSTEM_LOGS_PER_PAGE,
        }
        if (filters.search.trim()) api.search = filters.search.trim()
        if (filters.teacher_id.trim()) api.teacher_id = parseInt(filters.teacher_id, 10)

        const data = await listSessionSystemLogs(api)
        setLogs(data?.logs || [])
        setPagination(data?.pagination || null)
      } catch (e) {
        console.error(e)
        setLogs([])
        setPagination(null)
      } finally {
        setLoading(false)
      }
    }
    loadLogs()
  }, [currentPage, filters.search, filters.teacher_id])

  const loadLogs = async () => {
    setLoading(true)
    try {
      const api: Parameters<typeof listSessionSystemLogs>[0] = {
        page: currentPage,
        per_page: SESSION_SYSTEM_LOGS_PER_PAGE,
      }
      if (filters.search.trim()) api.search = filters.search.trim()
      if (filters.teacher_id.trim()) api.teacher_id = parseInt(filters.teacher_id, 10)
      const data = await listSessionSystemLogs(api)
      setLogs(data?.logs || [])
      setPagination(data?.pagination || null)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const totalPages = pagination?.total_pages ?? 1

  return (
    <div className="px-2 sm:px-0">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-900">طلبات تغيير نظام الحصص</h1>
        <button
          type="button"
          onClick={() => loadLogs()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors w-full sm:w-auto"
        >
          <RefreshCw className="w-5 h-5" />
          تحديث
        </button>
      </div>

      <div className="bg-white rounded-xl border-2 border-primary-200 p-4 sm:p-6 mb-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-primary-900 mb-4 text-right">فلترة السجلات</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <div className="sm:col-span-2">
            <label className="block text-primary-900 font-semibold mb-2 text-right">البحث (اسم الطالب)</label>
            <div className="relative">
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => patchFilters({ search: e.target.value })}
                placeholder="ابحث باسم الطالب..."
                className="w-full pr-12 pl-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                dir="rtl"
              />
            </div>
          </div>
          <div>
            <label className="block text-primary-900 font-semibold mb-2 text-right">المعلم</label>
            <SearchableTeacherSelect
              value={filters.teacher_id}
              onChange={(value) => patchFilters({ teacher_id: value })}
              teachers={teachers}
              placeholder="جميع المعلمين"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 text-primary-600 bg-white rounded-xl border-2 border-primary-200">
          {filters.search || filters.teacher_id
            ? 'لا توجد نتائج'
            : 'لا توجد سجلات'}
        </div>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => {
            const open = expandedId === log.id
            return (
              <motion.div
                key={log.id}
                layout
                className="bg-white rounded-xl border-2 border-primary-200 shadow-lg overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(open ? null : log.id)}
                  className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-right hover:bg-primary-50/80 transition-colors"
                >
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-primary-700">
                      <span className="font-mono text-xs text-primary-500">#{log.id}</span>
                      {log.created_at && (
                        <span>{new Date(log.created_at.replace(' ', 'T')).toLocaleString('ar-EG')}</span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <User className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-primary-600">الطالب</p>
                          <p className="font-semibold text-primary-900 break-words">
                            {log.student?.name ?? `— (${log.student_id})`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-primary-600">المعلم</p>
                          <p className="font-semibold text-primary-900 break-words">
                            {log.teacher?.name ?? (log.teacher_id != null ? `#${log.teacher_id}` : '—')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <UserCog className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs text-primary-600">من نفّذ التغيير</p>
                          <p className="font-semibold text-primary-900 break-words">
                            {log.changed_by_user?.name ??
                              (log.changed_by_user_id != null ? `#${log.changed_by_user_id}` : '—')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {open ? (
                    <ChevronUp className="w-5 h-5 text-primary-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-primary-600 shrink-0" />
                  )}
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden border-t border-primary-200"
                    >
                      <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="rounded-lg border-2 border-red-200 bg-red-50/60 overflow-hidden">
                          <div className="px-3 py-2 bg-red-100 text-red-900 text-sm font-semibold text-right">
                            القيم السابقة
                          </div>
                          <pre className="p-3 text-xs leading-relaxed text-primary-900 overflow-x-auto max-h-80 whitespace-pre-wrap break-words text-left" dir="ltr">
                            {formatValuesBlock(log.old_values as Record<string, unknown>)}
                          </pre>
                        </div>
                        <div className="rounded-lg border-2 border-green-200 bg-green-50/60 overflow-hidden">
                          <div className="px-3 py-2 bg-green-100 text-green-900 text-sm font-semibold text-right">
                            القيم الجديدة
                          </div>
                          <pre className="p-3 text-xs leading-relaxed text-primary-900 overflow-x-auto max-h-80 whitespace-pre-wrap break-words text-left" dir="ltr">
                            {formatValuesBlock(log.new_values as Record<string, unknown>)}
                          </pre>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}

      {pagination && pagination.total > 0 && (
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl border-2 border-primary-200 p-4">
          <p className="text-sm text-primary-700">
            إجمالي السجلات: <span className="font-bold">{pagination.total}</span> — الصفحة{' '}
            <span className="font-bold">{pagination.current_page}</span> من{' '}
            <span className="font-bold">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1 || loading}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-lg border-2 border-primary-300 text-primary-800 disabled:opacity-40 text-sm"
            >
              السابق
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages || loading}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="px-4 py-2 rounded-lg border-2 border-primary-300 text-primary-800 disabled:opacity-40 text-sm"
            >
              التالي
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
