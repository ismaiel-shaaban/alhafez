import { apiRequest, PaginatedResponse } from '../api-client'

export interface StudentSession {
  id: number
  student_id: number
  teacher_id?: number
  session_date: string
  session_time: string
  day_of_week: string
  day_of_week_label?: string // Localized day label (e.g., "السبت", "Saturday")
  is_completed: boolean
  completed_at?: string
  notes?: string
  student?: {
    id: number
    name: string
  }
  teacher?: {
    id: number
    name: string
  }
  created_at?: string
  updated_at?: string
}

export interface SessionFilters {
  student_id?: number
  teacher_id?: number
  is_completed?: boolean
  date_from?: string
  date_to?: string
  day_of_week?: string
  per_page?: number
}

export interface CreateSessionRequest {
  student_id: number
  teacher_id?: number
  session_date: string // YYYY-MM-DD
  session_time: string // HH:mm
  day_of_week: string
  notes?: string
}

// List sessions
export const listSessions = async (
  filters: SessionFilters = {},
  locale?: string
): Promise<{ sessions: StudentSession[]; pagination: any }> => {
  const params = new URLSearchParams()
  
  if (filters.student_id) params.append('student_id', filters.student_id.toString())
  if (filters.teacher_id) params.append('teacher_id', filters.teacher_id.toString())
  if (filters.is_completed !== undefined) params.append('is_completed', filters.is_completed.toString())
  if (filters.date_from) params.append('date_from', filters.date_from)
  if (filters.date_to) params.append('date_to', filters.date_to)
  if (filters.day_of_week) params.append('day_of_week', filters.day_of_week)
  if (filters.per_page) params.append('per_page', filters.per_page.toString())

  const query = params.toString()
  // API returns: { status: true, message: "...", data: { sessions: [...], pagination: {...} } }
  return apiRequest<{ sessions: StudentSession[]; pagination: any }>(
    `/api/student-sessions${query ? `?${query}` : ''}`,
    { locale }
  )
}

// Get session
export const getSession = async (id: number): Promise<StudentSession> => {
  return apiRequest<StudentSession>(`/api/student-sessions/${id}`)
}

// Create session
export const createSession = async (data: CreateSessionRequest): Promise<StudentSession> => {
  return apiRequest<StudentSession>('/api/student-sessions', {
    method: 'POST',
    body: data,
  })
}

// Update session
export const updateSession = async (
  id: number,
  data: Partial<CreateSessionRequest & { is_completed?: boolean }>
): Promise<StudentSession> => {
  return apiRequest<StudentSession>(`/api/student-sessions/${id}`, {
    method: 'POST',
    body: data,
  })
}

// Mark session as completed
export const completeSession = async (
  id: number,
  notes?: string
): Promise<StudentSession> => {
  return apiRequest<StudentSession>(`/api/student-sessions/${id}/complete`, {
    method: 'POST',
    body: notes ? { notes } : {},
  })
}

// Delete session
export const deleteSession = async (id: number): Promise<void> => {
  return apiRequest(`/api/student-sessions/${id}`, {
    method: 'DELETE',
  })
}

