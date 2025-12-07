import { apiRequest, PaginatedResponse } from '../api-client'

export interface HonorBoardEntry {
  id: number
  student_id: number
  level: string // Localized level based on Accept-Language
  level_ar: string
  level_en?: string
  achievement: string // Localized achievement based on Accept-Language
  achievement_ar: string
  achievement_en?: string
  certificate_images: string[]
  student?: {
    id: number
    name: string
  }
}

export interface CreateHonorBoardRequest {
  student_id: number
  level: string
  level_en?: string
  achievement: string
  achievement_en?: string
  certificate_images: string[]
}

// List honor boards
export const listHonorBoards = async (
  studentId?: number,
  perPage: number = 15,
  locale?: string
): Promise<{ honor_boards: HonorBoardEntry[]; pagination: any }> => {
  const params = new URLSearchParams()
  if (studentId) params.append('student_id', studentId.toString())
  params.append('per_page', perPage.toString())

  // API returns: { status: true, message: "...", data: { honor_boards: [...], pagination: {...} } }
  return apiRequest<{ honor_boards: HonorBoardEntry[]; pagination: any }>(
    `/api/honor-boards?${params.toString()}`,
    { locale }
  )
}

// Get honor board entry
export const getHonorBoard = async (id: number): Promise<HonorBoardEntry> => {
  return apiRequest<HonorBoardEntry>(`/api/honor-boards/${id}`)
}

// Create honor board entry
export const createHonorBoard = async (
  data: CreateHonorBoardRequest
): Promise<HonorBoardEntry> => {
  return apiRequest<HonorBoardEntry>('/api/honor-boards', {
    method: 'POST',
    body: data,
  })
}

// Update honor board entry
export const updateHonorBoard = async (
  id: number,
  data: Partial<CreateHonorBoardRequest>
): Promise<HonorBoardEntry> => {
  return apiRequest<HonorBoardEntry>(`/api/honor-boards/${id}`, {
    method: 'PUT',
    body: data,
  })
}

// Delete honor board entry
export const deleteHonorBoard = async (id: number): Promise<void> => {
  return apiRequest(`/api/honor-boards/${id}`, {
    method: 'DELETE',
  })
}

