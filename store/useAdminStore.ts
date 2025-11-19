import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface AdminUser {
  isAuthenticated: boolean
  username: string
}

interface Teacher {
  id: string
  name: string
  specialization: string
  experience: string
  image: string | null
}

interface Package {
  id: string
  name: string
  price: string
  features: string[]
  popular: boolean
}

interface Testimonial {
  id: string
  name: string
  review: string
  rating: number
  package: string
}

interface HonorBoardEntry {
  id: string
  name: string
  level: string
  achievement: string
  certificates?: string[] // Array of certificate image URLs
}

interface AdminState {
  // Authentication
  admin: AdminUser
  login: (username: string, password: string) => boolean
  logout: () => void

  // Students
  students: any[]
  addStudent: (student: any) => void
  updateStudent: (id: string, student: any) => void
  deleteStudent: (id: string) => void

  // Teachers
  teachers: Teacher[]
  addTeacher: (teacher: Omit<Teacher, 'id'>) => void
  updateTeacher: (id: string, teacher: Partial<Teacher>) => void
  deleteTeacher: (id: string) => void

  // Packages
  packages: Package[]
  addPackage: (pkg: Omit<Package, 'id'>) => void
  updatePackage: (id: string, pkg: Partial<Package>) => void
  deletePackage: (id: string) => void

  // Testimonials
  testimonials: Testimonial[]
  addTestimonial: (testimonial: Omit<Testimonial, 'id'>) => void
  updateTestimonial: (id: string, testimonial: Partial<Testimonial>) => void
  deleteTestimonial: (id: string) => void

  // Honor Board
  honorBoard: HonorBoardEntry[]
  addHonorEntry: (entry: Omit<HonorBoardEntry, 'id'>) => void
  updateHonorEntry: (id: string, entry: Partial<HonorBoardEntry>) => void
  deleteHonorEntry: (id: string) => void
}

// Default admin credentials (in production, use environment variables)
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

const defaultTeachers: Teacher[] = [
  {
    id: '1',
    name: 'الشيخ أحمد محمد',
    specialization: 'حفظ القرآن والتجويد',
    experience: '15 سنة خبرة',
    image: null,
  },
  {
    id: '2',
    name: 'الشيخة فاطمة علي',
    specialization: 'تعليم النساء والأطفال',
    experience: '12 سنة خبرة',
    image: null,
  },
  {
    id: '3',
    name: 'الشيخ محمود حسن',
    specialization: 'أحكام التجويد',
    experience: '18 سنة خبرة',
    image: null,
  },
  {
    id: '4',
    name: 'الشيخة سارة أحمد',
    specialization: 'تأسيس القراءة',
    experience: '10 سنة خبرة',
    image: null,
  },
]

const defaultPackages: Package[] = [
  {
    id: 'basic',
    name: 'الباقة الأساسية',
    price: '100',
    features: ['جلسة واحدة أسبوعياً', 'متابعة فردية', 'مواد تعليمية'],
    popular: false,
  },
  {
    id: 'standard',
    name: 'الباقة المتوسطة',
    price: '180',
    features: ['جلستان أسبوعياً', 'متابعة فردية', 'مواد تعليمية', 'شهادة إتمام'],
    popular: true,
  },
  {
    id: 'premium',
    name: 'الباقة المميزة',
    price: '250',
    features: ['ثلاث جلسات أسبوعياً', 'متابعة فردية مكثفة', 'مواد تعليمية', 'شهادة معتمدة', 'تقييم دوري'],
    popular: false,
  },
]

const defaultTestimonials: Testimonial[] = [
  {
    id: '1',
    name: 'أحمد محمد',
    review: 'تجربة رائعة! المعلمون متخصصون والمنهج ممتاز.',
    rating: 5,
    package: 'الباقة المميزة',
  },
  {
    id: '2',
    name: 'فاطمة علي',
    review: 'ابني تحسن كثيراً في قراءة القرآن. شكراً لكم!',
    rating: 5,
    package: 'الباقة الأساسية',
  },
  {
    id: '3',
    name: 'خالد حسن',
    review: 'أكاديمية ممتازة بكل المقاييس. أنصح الجميع بالانضمام.',
    rating: 5,
    package: 'الباقة المميزة',
  },
]

const defaultHonorBoard: HonorBoardEntry[] = [
  {
    id: '1',
    name: 'محمد أحمد',
    level: 'المستوى الخامس',
    achievement: 'حفظ جزء عم كاملاً',
    certificates: [
      '/certificates/certificate-1.jpg',
      '/certificates/certificate-2.jpg',
    ],
  },
  {
    id: '2',
    name: 'فاطمة خالد',
    level: 'المستوى الثالث',
    achievement: 'إتقان أحكام التجويد الأساسية',
    certificates: [
      '/certificates/certificate-3.jpg',
    ],
  },
]

const defaultStudents: any[] = [
  {
    id: '1',
    name: 'أحمد محمد علي',
    email: 'ahmed.mohamed@example.com',
    phone: '0501234567',
    age: 25,
    gender: 'ذكر',
    package: 'الباقة المميزة',
    message: 'أريد البدء في حفظ القرآن الكريم',
  },
  {
    id: '2',
    name: 'فاطمة أحمد خالد',
    email: 'fatima.ahmed@example.com',
    phone: '0512345678',
    age: 30,
    gender: 'أنثى',
    package: 'الباقة المتوسطة',
    message: 'أريد تعلم أحكام التجويد',
  },
  {
    id: '3',
    name: 'محمد خالد حسن',
    email: 'mohamed.khalid@example.com',
    phone: '0523456789',
    age: 15,
    gender: 'ذكر',
    package: 'الباقة الأساسية',
    message: 'أريد تأسيس قراءة القرآن',
  },
  {
    id: '4',
    name: 'سارة علي محمود',
    email: 'sara.ali@example.com',
    phone: '0534567890',
    age: 22,
    gender: 'أنثى',
    package: 'الباقة المميزة',
    message: 'أريد تحسين تلاوة القرآن',
  },
  {
    id: '5',
    name: 'خالد عبدالله',
    email: 'khalid.abdullah@example.com',
    phone: '0545678901',
    age: 28,
    gender: 'ذكر',
    package: 'الباقة المتوسطة',
    message: 'أريد حفظ جزء تبارك',
  },
  {
    id: '6',
    name: 'نورا محمد',
    email: 'nora.mohamed@example.com',
    phone: '0556789012',
    age: 18,
    gender: 'أنثى',
    package: 'الباقة الأساسية',
    message: 'أريد البدء من الصفر',
  },
]

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      // Authentication
      admin: {
        isAuthenticated: false,
        username: '',
      },
      login: (username: string, password: string) => {
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
          set({
            admin: {
              isAuthenticated: true,
              username,
            },
          })
          return true
        }
        return false
      },
      logout: () => {
        set({
          admin: {
            isAuthenticated: false,
            username: '',
          },
        })
      },

      // Students
      students: defaultStudents,
      addStudent: (student) =>
        set((state) => {
          // Check if student already exists to avoid duplicates
          const exists = state.students.find((s) => s.email === student.email)
          if (exists) return state
          return {
            students: [...state.students, { ...student, id: Date.now().toString() }],
          }
        }),
      updateStudent: (id, student) =>
        set((state) => ({
          students: state.students.map((s) => (s.id === id ? { ...s, ...student } : s)),
        })),
      deleteStudent: (id) =>
        set((state) => ({
          students: state.students.filter((s) => s.id !== id),
        })),

      // Teachers
      teachers: defaultTeachers,
      addTeacher: (teacher) =>
        set((state) => ({
          teachers: [...state.teachers, { ...teacher, id: Date.now().toString() }],
        })),
      updateTeacher: (id, teacher) =>
        set((state) => ({
          teachers: state.teachers.map((t) => (t.id === id ? { ...t, ...teacher } : t)),
        })),
      deleteTeacher: (id) =>
        set((state) => ({
          teachers: state.teachers.filter((t) => t.id !== id),
        })),

      // Packages
      packages: defaultPackages,
      addPackage: (pkg) =>
        set((state) => ({
          packages: [...state.packages, { ...pkg, id: Date.now().toString() }],
        })),
      updatePackage: (id, pkg) =>
        set((state) => ({
          packages: state.packages.map((p) => (p.id === id ? { ...p, ...pkg } : p)),
        })),
      deletePackage: (id) =>
        set((state) => ({
          packages: state.packages.filter((p) => p.id !== id),
        })),

      // Testimonials
      testimonials: defaultTestimonials,
      addTestimonial: (testimonial) =>
        set((state) => ({
          testimonials: [...state.testimonials, { ...testimonial, id: Date.now().toString() }],
        })),
      updateTestimonial: (id, testimonial) =>
        set((state) => ({
          testimonials: state.testimonials.map((t) =>
            t.id === id ? { ...t, ...testimonial } : t
          ),
        })),
      deleteTestimonial: (id) =>
        set((state) => ({
          testimonials: state.testimonials.filter((t) => t.id !== id),
        })),

      // Honor Board
      honorBoard: defaultHonorBoard,
      addHonorEntry: (entry) =>
        set((state) => ({
          honorBoard: [...state.honorBoard, { ...entry, id: Date.now().toString() }],
        })),
      updateHonorEntry: (id, entry) =>
        set((state) => ({
          honorBoard: state.honorBoard.map((e) => (e.id === id ? { ...e, ...entry } : e)),
        })),
      deleteHonorEntry: (id) =>
        set((state) => ({
          honorBoard: state.honorBoard.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'admin-storage',
      storage: createJSONStorage(() => localStorage),
      merge: (persistedState: any, currentState: AdminState) => {
        // Merge persisted state with current state, but use defaults if arrays are empty
        return {
          ...currentState,
          ...persistedState,
          // If persisted students is empty or doesn't exist, use defaults
          students:
            persistedState?.students && persistedState.students.length > 0
              ? persistedState.students
              : currentState.students,
          // If persisted teachers is empty or doesn't exist, use defaults
          teachers:
            persistedState?.teachers && persistedState.teachers.length > 0
              ? persistedState.teachers
              : currentState.teachers,
          // If persisted packages is empty or doesn't exist, use defaults
          packages:
            persistedState?.packages && persistedState.packages.length > 0
              ? persistedState.packages
              : currentState.packages,
          // If persisted testimonials is empty or doesn't exist, use defaults
          testimonials:
            persistedState?.testimonials && persistedState.testimonials.length > 0
              ? persistedState.testimonials
              : currentState.testimonials,
          // If persisted honorBoard is empty or doesn't exist, use defaults
          honorBoard:
            persistedState?.honorBoard && persistedState.honorBoard.length > 0
              ? persistedState.honorBoard
              : currentState.honorBoard,
        }
      },
    }
  )
)
