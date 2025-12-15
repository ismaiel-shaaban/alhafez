import { create } from 'zustand'
import * as websiteAPI from '@/lib/api/website'
import { getCurrentLocale } from '@/lib/website-api-client'

interface WebsiteState {
  // Website Data
  features: websiteAPI.WebsiteFeature[]
  packages: websiteAPI.WebsitePackage[]
  teachers: websiteAPI.WebsiteTeacher[]
  reviews: websiteAPI.WebsiteReview[]
  
  // Honor Boards
  honorBoards: websiteAPI.WebsiteHonorBoard[]
  honorBoardsPagination: {
    current_page: number
    total: number
    total_pages: number
  } | null
  
  // Loading states
  isLoading: boolean
  isLoadingHonorBoards: boolean
  error: string | null
  
  // Actions
  fetchWebsiteData: () => Promise<void>
  fetchHonorBoards: (studentId?: number, page?: number) => Promise<void>
  getHonorBoard: (id: number) => Promise<websiteAPI.WebsiteHonorBoard>
  fetchTeachers: (page?: number) => Promise<void>
  fetchPackages: (isPopular?: boolean, page?: number) => Promise<void>
  fetchReviews: (rating?: number, packageId?: number, page?: number) => Promise<void>
  registerStudent: (data: websiteAPI.RegisterStudentRequest) => Promise<websiteAPI.RegisterStudentResponse>
  createReview: (data: websiteAPI.CreateReviewRequest) => Promise<websiteAPI.CreateReviewResponse>
}

export const useWebsiteStore = create<WebsiteState>((set, get) => ({
  // Initial state
  features: [],
  packages: [],
  teachers: [],
  reviews: [],
  honorBoards: [],
  honorBoardsPagination: null,
  isLoading: false,
  isLoadingHonorBoards: false,
  error: null,

  // Fetch all website data
  fetchWebsiteData: async () => {
    set({ isLoading: true, error: null })
    try {
      const locale = getCurrentLocale()
      const data = await websiteAPI.getWebsiteData(locale)
      set({
        features: data.features || [],
        packages: data.packages || [],
        teachers: data.teachers || [],
        reviews: data.reviews || [],
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'فشل تحميل بيانات الموقع',
      })
    }
  },

  // Fetch honor boards
  fetchHonorBoards: async (studentId, page = 1) => {
    set({ isLoadingHonorBoards: true, error: null })
    try {
      const locale = getCurrentLocale()
      const response = await websiteAPI.listHonorBoards(studentId, page, 15, locale)
      set({
        honorBoards: response.honor_boards || [],
        honorBoardsPagination: response.pagination ? {
          current_page: response.pagination.current_page || 1,
          total: response.pagination.total || 0,
          total_pages: response.pagination.total_pages || 1,
        } : null,
        isLoadingHonorBoards: false,
      })
    } catch (error: any) {
      set({
        isLoadingHonorBoards: false,
        error: error.message || 'فشل تحميل لوحة الشرف',
      })
    }
  },
  getHonorBoard: async (id) => {
    set({ isLoading: true, error: null })
    try {
      const locale = getCurrentLocale()
      const entry = await websiteAPI.getHonorBoard(id, locale)
      set({ isLoading: false })
      return entry
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'فشل تحميل بيانات السجل',
      })
      throw error
    }
  },

  // Fetch teachers
  fetchTeachers: async (page = 1) => {
    set({ isLoading: true, error: null })
    try {
      const locale = getCurrentLocale()
      const response = await websiteAPI.listTeachers(page, 15, locale)
      set({
        teachers: response.teachers || [],
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'فشل تحميل المعلمين',
      })
    }
  },

  // Fetch packages
  fetchPackages: async (isPopular, page = 1) => {
    set({ isLoading: true, error: null })
    try {
      const locale = getCurrentLocale()
      const response = await websiteAPI.listPackages(isPopular, page, 15, locale)
      set({
        packages: response.packages || [],
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'فشل تحميل الباقات',
      })
    }
  },

  // Fetch reviews
  fetchReviews: async (rating, packageId, page = 1) => {
    set({ isLoading: true, error: null })
    try {
      const locale = getCurrentLocale()
      const response = await websiteAPI.listReviews(rating, packageId, page, 15, locale)
      set({
        reviews: response.reviews || [],
        isLoading: false,
      })
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'فشل تحميل الآراء',
      })
    }
  },

  // Register student
  registerStudent: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const locale = getCurrentLocale()
      const response = await websiteAPI.registerStudent(data, locale)
      set({ isLoading: false })
      return response
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'فشل تسجيل الطالب',
      })
      throw error
    }
  },

  // Create review
  createReview: async (data) => {
    set({ isLoading: true, error: null })
    try {
      const locale = getCurrentLocale()
      const response = await websiteAPI.createReview(data, locale)
      set({ isLoading: false })
      return response
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'فشل إرسال الرأي',
      })
      throw error
    }
  },
}))

