import { apiRequest, PaginatedResponse } from '../api-client'

export interface Teacher {
  id: number
  name: string // Localized name based on lang header
  name_ar: string
  name_en?: string
  specialization: string // Localized specialization based on lang header
  specialization_ar: string
  specialization_en?: string
  experience_years: number
  image?: string // Teacher profile image URL
  created_at?: string
}

export interface CreateTeacherRequest {
  name: string // Required, name in Arabic
  name_en?: string // Optional, name in English
  specialization: string // Required, specialization in Arabic
  specialization_en?: string // Optional, specialization in English
  experience_years: number // Required, min: 0
  image?: File // Optional, teacher profile image (image file: jpeg, png, jpg, gif, max: 5MB)
  phone?: string // Optional, phone number for teacher login
  email?: string // Optional, email address for teacher account
  password?: string // Optional, password for teacher login (min: 6 characters). If provided along with phone or email, a User account will be automatically created/updated for the teacher. Password will be automatically hashed.
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
  // Use FormData if image, phone, email, or password is provided
  // (API supports both JSON and FormData, but FormData is required for file uploads)
  if (data.image || data.phone || data.email || data.password) {
    const formData = new FormData()
    formData.append('name', data.name)
    if (data.name_en) formData.append('name_en', data.name_en)
    formData.append('specialization', data.specialization)
    if (data.specialization_en) formData.append('specialization_en', data.specialization_en)
    formData.append('experience_years', data.experience_years.toString())
    if (data.image) formData.append('image', data.image)
    if (data.phone) formData.append('phone', data.phone)
    if (data.email) formData.append('email', data.email)
    if (data.password) formData.append('password', data.password)
    
    return apiRequest<Teacher>('/api/teachers', {
      method: 'POST',
      body: formData,
    })
  }
  
  // Otherwise, use JSON
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
  // Use FormData if image, phone, email, or password is provided
  // (API supports both JSON and FormData, but FormData is required for file uploads)
  if (data.image || data.phone || data.email || data.password) {
    const formData = new FormData()
    if (data.name) formData.append('name', data.name)
    if (data.name_en) formData.append('name_en', data.name_en)
    if (data.specialization) formData.append('specialization', data.specialization)
    if (data.specialization_en) formData.append('specialization_en', data.specialization_en)
    if (data.experience_years !== undefined) formData.append('experience_years', data.experience_years.toString())
    if (data.image) formData.append('image', data.image)
    if (data.phone) formData.append('phone', data.phone)
    if (data.email) formData.append('email', data.email)
    if (data.password) formData.append('password', data.password)
    
    return apiRequest<Teacher>(`/api/teachers/${id}`, {
      method: 'PUT',
      body: formData,
    })
  }
  
  // Otherwise, use JSON
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

