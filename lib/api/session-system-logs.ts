import { apiRequest, Pagination } from '../api-client'

export interface SessionSystemLogUserRef {
  id: number
  name: string
}

export interface SessionSystemLog {
  id: number
  student_id: number
  student?: SessionSystemLogUserRef
  teacher_id?: number | null
  teacher?: SessionSystemLogUserRef | null
  changed_by_user_id?: number | null
  changed_by_user?: SessionSystemLogUserRef | null
  old_values?: Record<string, unknown> | null
  new_values?: Record<string, unknown> | null
  created_at?: string
}

export interface SessionSystemLogsResponse {
  logs: SessionSystemLog[]
  pagination: Pagination
}

export interface SessionSystemLogsFilters {
  search?: string
  student_id?: number
  teacher_id?: number
  changed_by_user_id?: number
  per_page?: number
  page?: number
}

export const listSessionSystemLogs = async (
  filters: SessionSystemLogsFilters = {},
  locale?: string
): Promise<SessionSystemLogsResponse> => {
  const params = new URLSearchParams()
  if (filters.search) params.append('search', filters.search)
  if (filters.student_id !== undefined) params.append('student_id', filters.student_id.toString())
  if (filters.teacher_id !== undefined) params.append('teacher_id', filters.teacher_id.toString())
  if (filters.changed_by_user_id !== undefined) {
    params.append('changed_by_user_id', filters.changed_by_user_id.toString())
  }
  if (filters.per_page !== undefined) params.append('per_page', filters.per_page.toString())
  if (filters.page !== undefined) params.append('page', filters.page.toString())

  return apiRequest<SessionSystemLogsResponse>(
    `/api/session-system/logs${params.toString() ? `?${params.toString()}` : ''}`,
    { locale }
  )
}
