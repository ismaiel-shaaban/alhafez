import { apiRequest, PaginatedResponse } from '../api-client'

export interface Review {
  id: number
  student_id: number
  package_id?: number
  rating: number
  review: string // Localized review based on Accept-Language
  review_ar: string
  review_en?: string
  student?: {
    id: number
    name: string
  }
  package?: {
    id: number
    name: string
    name_en?: string
  }
}

export interface ReviewFilters {
  rating?: number
  package_id?: number
  student_id?: number
  per_page?: number
}

export interface CreateReviewRequest {
  student_id: number
  package_id?: number
  rating: number
  review: string
  review_en?: string
}

// List reviews
export const listReviews = async (
  filters: ReviewFilters = {},
  locale?: string
): Promise<{ reviews: Review[]; pagination: any }> => {
  const params = new URLSearchParams()
  
  if (filters.rating) params.append('rating', filters.rating.toString())
  if (filters.package_id) params.append('package_id', filters.package_id.toString())
  if (filters.student_id) params.append('student_id', filters.student_id.toString())
  if (filters.per_page) params.append('per_page', filters.per_page.toString())

  const query = params.toString()
  // API returns: { status: true, message: "...", data: { reviews: [...], pagination: {...} } }
  return apiRequest<{ reviews: Review[]; pagination: any }>(
    `/api/reviews${query ? `?${query}` : ''}`,
    { locale }
  )
}

// Get review
export const getReview = async (id: number): Promise<Review> => {
  return apiRequest<Review>(`/api/reviews/${id}`)
}

// Create review
export const createReview = async (data: CreateReviewRequest): Promise<Review> => {
  return apiRequest<Review>('/api/reviews', {
    method: 'POST',
    body: data,
  })
}

// Update review
export const updateReview = async (
  id: number,
  data: Partial<CreateReviewRequest>
): Promise<Review> => {
  return apiRequest<Review>(`/api/reviews/${id}`, {
    method: 'PUT',
    body: data,
  })
}

// Delete review
export const deleteReview = async (id: number): Promise<void> => {
  return apiRequest(`/api/reviews/${id}`, {
    method: 'DELETE',
  })
}

