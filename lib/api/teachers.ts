import { apiRequest, PaginatedResponse } from '../api-client'

export interface Teacher {
  id: number
  name: string // Localized name based on Accept-Language
  name_ar: string
  name_en?: string
  specialization: string // Localized specialization based on Accept-Language
  specialization_ar: string
  specialization_en?: string
  experience_years: number
}

export interface CreateTeacherRequest {
  name: string
  name_en?: string
  specialization: string
  specialization_en?: string
  experience_years: number
}

// List teachers
export const listTeachers = async (
  page: number = 1,
  perPage: number = 15,
  locale?: string
): Promise<{ teachers: Teacher[]; pagination: any }> => {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('per_page', perPage.toString())

  // API returns: { status: true, message: "...", data: { teachers: [...], pagination: {...} } }
  return apiRequest<{ teachers: Teacher[]; pagination: any }>(
    `/api/teachers?${params.toString()}`,
    { locale }
  )
}

// Get teacher
export const getTeacher = async (id: number): Promise<Teacher> => {
  return apiRequest<Teacher>(`/api/teachers/${id}`)
}

// Create teacher
export const createTeacher = async (data: CreateTeacherRequest): Promise<Teacher> => {
  return apiRequest<Teacher>('/api/teachers', {
    method: 'POST',
    body: data,
  })
}

// Update teacher
export const updateTeacher = async (
  id: number,
  data: Partial<CreateTeacherRequest>
): Promise<Teacher> => {
  return apiRequest<Teacher>(`/api/teachers/${id}`, {
    method: 'PUT',
    body: data,
  })
}

// Delete teacher
export const deleteTeacher = async (id: number): Promise<void> => {
  return apiRequest(`/api/teachers/${id}`, {
    method: 'DELETE',
  })
}

