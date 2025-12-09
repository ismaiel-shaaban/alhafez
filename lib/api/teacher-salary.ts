import { apiRequest, Pagination } from '../api-client'

export interface TeacherSalaryStudent {
  id: number
  name: string
  email: string
  phone: string
  sessions_count: number
  total_hours: number
  hourly_rate: number
  total_amount: number
}

export interface TeacherSalarySummary {
  total_students: number
  total_sessions: number
  total_hours: number
  total_amount: number
}

export interface TeacherPayment {
  id: number
  teacher_id: number
  month: string // YYYY-MM
  total_amount: number
  is_paid: boolean
  payment_proof_image?: string
  paid_at?: string
  notes?: string
  created_at?: string
  teacher?: {
    id: number
    name: string
    name_en?: string
  }
}

export interface TeacherSalaryResponse {
  teacher: {
    id: number
    name: string
    name_en?: string
    specialization?: string
  }
  month: string // YYYY-MM
  students: TeacherSalaryStudent[]
  summary: TeacherSalarySummary
  payment: TeacherPayment | null
}

export interface MarkPaymentRequest {
  month: string // YYYY-MM, required
  payment_proof_image: File // Required, payment proof image file (image file: jpeg, png, jpg, gif, max: 5MB)
  notes?: string // Optional
}

// Get teacher salary calculation
export const getTeacherSalary = async (
  teacherId: number,
  month: string, // YYYY-MM
  locale?: string
): Promise<TeacherSalaryResponse> => {
  return apiRequest<TeacherSalaryResponse>(
    `/api/teachers/${teacherId}/salary?month=${month}`,
    { locale }
  )
}

// Mark payment as paid
export const markPaymentAsPaid = async (
  teacherId: number,
  data: MarkPaymentRequest
): Promise<TeacherPayment> => {
  // Use FormData for multipart/form-data (payment_proof_image is a file)
  const formData = new FormData()
  formData.append('month', data.month)
  formData.append('payment_proof_image', data.payment_proof_image)
  if (data.notes) formData.append('notes', data.notes)
  
  return apiRequest<TeacherPayment>(`/api/teachers/${teacherId}/salary/pay`, {
    method: 'POST',
    body: formData,
  })
}

// Get teacher payments history
export const getTeacherPayments = async (
  teacherId: number,
  page: number = 1,
  perPage: number = 15,
  locale?: string
): Promise<{ payments: TeacherPayment[]; pagination: Pagination }> => {
  const params = new URLSearchParams()
  params.append('page', page.toString())
  params.append('per_page', perPage.toString())

  return apiRequest<{ payments: TeacherPayment[]; pagination: Pagination }>(
    `/api/teachers/${teacherId}/payments?${params.toString()}`,
    { locale }
  )
}

