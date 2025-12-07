import { apiRequest, PaginatedResponse } from '../api-client'

export interface Student {
  id: number
  name: string
  email: string
  phone: string
  age: number
  gender: 'male' | 'female'
  gender_label?: string // Localized gender label (e.g., "ذكر", "أنثى")
  package_id?: number
  teacher_id?: number
  hour?: string
  monthly_sessions?: number
  weekly_sessions?: number
  weekly_days?: string[]
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
  }
  created_at?: string
  updated_at?: string
}

export interface StudentFilters {
  package_id?: number
  gender?: 'male' | 'female'
  teacher_id?: number
  per_page?: number
  page?: number
}

export interface CreateStudentRequest {
  name: string
  email: string
  phone: string
  age: number
  gender: 'male' | 'female'
  package_id?: number
  teacher_id?: number
  hour?: string
  monthly_sessions?: number
  weekly_sessions?: number
  weekly_days?: string[]
  session_duration?: number
  hourly_rate?: number
  notes?: string
}

// List students
export const listStudents = async (
  filters: StudentFilters = {},
  locale?: string
): Promise<{ students: Student[]; pagination: any }> => {
  const params = new URLSearchParams()
  
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
    method: 'PUT',
    body: data,
  })
}

// Delete student
export const deleteStudent = async (id: number): Promise<void> => {
  return apiRequest(`/api/students/${id}`, {
    method: 'DELETE',
  })
}

