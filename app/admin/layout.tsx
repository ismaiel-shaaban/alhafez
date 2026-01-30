'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAdminStore } from '@/store/useAdminStore'
import Link from 'next/link'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  Package,
  MessageSquare,
  Award,
  LogOut,
  Menu,
  X,
  DollarSign,
  BookOpen,
  Video,
  Calendar,
  FileText,
  Calculator,
  UserCheck,
  AlertCircle,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { admin, logout, checkAuth } = useAdminStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    // Check authentication on mount
    const verifyAuth = async () => {
      if (pathname !== '/admin/login') {
        try {
          await checkAuth()
        } catch (error) {
          console.error('Auth check failed:', error)
        }
      }
      setIsCheckingAuth(false)
    }
    verifyAuth()
  }, [pathname, checkAuth])

  useEffect(() => {
    if (!isCheckingAuth && !admin.isAuthenticated && pathname !== '/admin/login') {
      router.push('/admin/login')
    }
    // Redirect supervisors away from restricted pages
    if (!isCheckingAuth && admin.isAuthenticated && admin.userType === 'supervisor') {
      const restrictedPaths = ['/admin/accounting', '/admin/supervisors']
      if (restrictedPaths.includes(pathname)) {
        router.push('/admin/dashboard')
      }
    }
  }, [admin.isAuthenticated, admin.userType, pathname, router, isCheckingAuth])

  if (isCheckingAuth || (!admin.isAuthenticated && pathname !== '/admin/login')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  // Filter nav items based on user type
  const allNavItems = [
    { href: '/admin/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/admin/sessions', label: 'حصص اليوم', icon: Calendar },
    { href: '/admin/website-students', label: '  الطلاب الجدد', icon: Users },
    { href: '/admin/students', label: 'الطلاب', icon: Users },
    { href: '/admin/teachers', label: 'المعلمين', icon: GraduationCap },
    { href: '/admin/teacher-salary', label: 'الرواتب', icon: DollarSign },
    { href: '/admin/accounting', label: 'المحاسبة', icon: Calculator, restricted: true },
    { href: '/admin/schedule-change-requests', label: 'طلبات تغيير المواعيد', icon: Calendar },
    { href: '/admin/student-deletion-requests', label: 'طلبات حذف الطلاب', icon: Users },
    { href: '/admin/payment-receipts', label: 'إيصالات الدفع', icon: DollarSign },
    { href: '/admin/subscription-pause-requests', label: 'طلبات الإيقاف', icon: Calendar },
    { href: '/admin/supervisors', label: 'المشرفين', icon: UserCheck, restricted: true },
    { href: '/admin/certificates', label: 'شهادات التقدير', icon: FileText },
    { href: '/admin/complaints', label: 'الشكاوى', icon: AlertCircle },
    { href: '/admin/packages', label: 'الباقات', icon: Package },
    { href: '/admin/lessons', label: 'فيديوهات من الحصص', icon: Video },
    { href: '/admin/testimonials', label: 'آراء الطلاب', icon: MessageSquare },
    { href: '/admin/honor-board', label: 'لوحة الشرف', icon: Award },
    { href: '/admin/features', label: 'المميزات', icon: BookOpen },
  ]

  // Filter out restricted items for supervisors
  const isSupervisor = admin.userType === 'supervisor'
  const navItems = isSupervisor
    ? allNavItems.filter((item: any) => !item.restricted)
    : allNavItems

  return (
    <div className="min-h-screen bg-primary-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 right-0 z-50 w-64 bg-gradient-to-b from-primary-800 to-primary-900 text-white transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-primary-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/20 flex items-center justify-center">
                <img
                  src="/images/logo.jpg"
                  alt="أكاديمية الحافظ"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                    const parent = target.parentElement
                    if (parent) {
                      const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
                      icon.setAttribute('class', 'w-6 h-6')
                      icon.setAttribute('viewBox', '0 0 24 24')
                      icon.setAttribute('fill', 'none')
                      icon.setAttribute('stroke', 'currentColor')
                      icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>'
                      parent.appendChild(icon)
                    }
                  }}
                />
              </div>
              <div>
                <h1 className="text-lg font-bold">لوحة التحكم</h1>
                <p className="text-xs text-primary-300">أكاديمية الحافظ</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item: any) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              // Double check: don't render restricted items for supervisors
              if (isSupervisor && item.restricted) {
                return null
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-700 text-white shadow-lg'
                      : 'text-primary-200 hover:bg-primary-700/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-primary-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-primary-200 hover:bg-red-600 hover:text-white transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:mr-0">
        {/* Top Bar */}
        <header className="bg-white border-b border-primary-200 px-4 lg:px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-primary-50 transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-primary-600">مرحباً،</p>
              <p className="font-bold text-primary-900">{admin?.username}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-green rounded-full flex items-center justify-center text-white font-bold">
              {admin?.username?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
