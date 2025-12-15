import { apiRequest, PaginatedResponse } from '../api-client'

export interface Student {
  id: number
  type?: 'website' | 'admin' // Registration type
  name: string
  email?: string // Optional
  phone: string
  age?: number // Optional
  gender: 'male' | 'female'
  gender_label?: string // Localized gender label (e.g., "ذكر", "أنثى")
  package_id?: number
  teacher_id?: number
  hour?: string // Default session time (used if weekly_schedule not provided)
  monthly_sessions?: number
  weekly_sessions?: number
  weekly_days?: string[] // Used if weekly_schedule not provided
  weekly_schedule?: Record<string, string> // Object with day names as keys and times as values (e.g., {"السبت": "17:00", "الثلاثاء": "14:00"})
  session_duration?: number
  hourly_rate?: number
  notes?: string
  package?: {
    id: number
    name: string
    name_en?: string
  }
  teacher?: {
    id: number
    name: string
    name_en?: string
    specialization?: string
  }
  subscriptions?: any[] // Student subscriptions
  subscriptions_statistics?: {
    total_subscriptions: number
    paid_subscriptions: number
    unpaid_subscriptions: number
  }
  past_months_count?: number // Optional, may be returned by API
  paid_months_count?: number // Optional, may be returned by API
  subscription_start_date?: string // Optional, may be returned by API
  created_at?: string
  updated_at?: string
}

export interface StudentFilters {
  type?: 'website' | 'admin' // Filter by registration type
  package_id?: number
  gender?: 'male' | 'female'
  teacher_id?: number
  per_page?: number
  page?: number
}

export interface CreateStudentRequest {
  name: string
  email?: string // Optional, unique
  phone: string
  age?: number // Optional, 1-120
  gender: 'male' | 'female'
  package_id?: number
  teacher_id?: number
  hour?: string // Default session time (format: HH:mm) - used if weekly_schedule not provided
  monthly_sessions?: number
  weekly_sessions?: number
  weekly_days?: string[] // Days of the week (array: ["saturday", "tuesday"]) - used if weekly_schedule not provided
  weekly_schedule?: Record<string, string> // Weekly schedule with specific times per day (JSON object: {"السبت": "17:00", "الثلاثاء": "14:00"}). Takes precedence over hour and weekly_days.
  session_duration?: number
  hourly_rate?: number
  notes?: string
  password?: string // Optional, min: 6 characters. Password will be automatically hashed.
  past_months_count?: number // Optional, integer, min: 0, max: 120. Number of past months to create subscriptions for.
  paid_months_count?: number // Optional, integer, min: 0, max: 120. Number of paid months.
  subscription_start_date?: string // Optional, YYYY-MM-DD format. Required if past_months_count is provided. Used to calculate past subscriptions.
}

// List students
export const listStudents = async (
  filters: StudentFilters = {},
  locale?: string
): Promise<{ students: Student[]; pagination: any }> => {
  const params = new URLSearchParams()
  
  if (filters.type) params.append('type', filters.type)
  if (filters.package_id) params.append('package_id', filters.package_id.toString())
  if (filters.gender) params.append('gender', filters.gender)
  if (filters.teacher_id) params.append('teacher_id', filters.teacher_id.toString())
  if (filters.per_page) params.append('per_page', filters.per_page.toString())
  if (filters.page) params.append('page', filters.page.toString())

  const query = params.toString()
  // API returns: { status: true, message: "...", data: { students: [...], pagination: {...} } }
  return apiRequest<{ students: Student[]; pagination: any }>(
    `/api/students${query ? `?${query}` : ''}`,
    { locale }
  )
}

// Get student
export const getStudent = async (id: number, locale?: string): Promise<Student> => {
  return apiRequest<Student>(`/api/students/${id}`, { locale })
}

// Create student
export const createStudent = async (data: CreateStudentRequest): Promise<Student> => {
  return apiRequest<Student>('/api/students', {
    method: 'POST',
    body: data,
  })
}

// Update student
export const updateStudent = async (
  id: number,
  data: Partial<CreateStudentRequest>
): Promise<Student> => {
  return apiRequest<Student>(`/api/students/${id}`, {
    method: 'POST',
    body: data,
  })
}

// Delete student
export const deleteStudent = async (id: number): Promise<void> => {
  return apiRequest(`/api/students/${id}`, {
    method: 'DELETE',
  })
}

