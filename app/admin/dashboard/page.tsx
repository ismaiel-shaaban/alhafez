'use client'

import { useEffect } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { useStore } from '@/store/useStore'
import { Users, BookOpen, DollarSign, TrendingUp, GraduationCap, MessageSquare, Award } from 'lucide-react'
import Link from 'next/link'

export default function AdminDashboard() {
  const { students, teachers, packages, testimonials, honorBoard } = useAdminStore()
  const { students: registeredStudents } = useStore()

  // Sync registered students to admin store
  useEffect(() => {
    registeredStudents.forEach((student) => {
      const exists = students.find((s) => s.id === student.id)
      if (!exists) {
        useAdminStore.getState().addStudent(student)
      }
    })
  }, [registeredStudents, students])

  const stats = [
    {
      title: 'إجمالي الطلاب',
      value: students.length.toString(),
      icon: <Users className="w-8 h-8" />,
      color: 'bg-blue-500',
      href: '/admin/students',
    },
    {
      title: 'المعلمين',
      value: teachers.length.toString(),
      icon: <GraduationCap className="w-8 h-8" />,
      color: 'bg-green-500',
      href: '/admin/teachers',
    },
    {
      title: 'الباقات',
      value: packages.length.toString(),
      icon: <BookOpen className="w-8 h-8" />,
      color: 'bg-purple-500',
      href: '/admin/packages',
    },
    {
      title: 'آراء الطلاب',
      value: testimonials.length.toString(),
      icon: <MessageSquare className="w-8 h-8" />,
      color: 'bg-yellow-500',
      href: '/admin/testimonials',
    },
    {
      title: 'لوحة الشرف',
      value: honorBoard.length.toString(),
      icon: <Award className="w-8 h-8" />,
      color: 'bg-orange-500',
      href: '/admin/honor-board',
    },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold text-primary-900 mb-8">لوحة التحكم</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link
            key={index}
            href={stat.href}
            className="bg-white p-6 rounded-xl border-2 border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary-400 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.color} p-3 rounded-lg text-white group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-primary-700 text-sm mb-2">{stat.title}</h3>
            <p className="text-4xl font-bold text-primary-900">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent Students Table */}
      <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
        <div className="p-6 border-b border-primary-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-primary-900">الطلاب المسجلون</h2>
          <Link
            href="/admin/students"
            className="text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            عرض الكل →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-100">
              <tr>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الاسم</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">البريد</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الهاتف</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الباقة</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الجنس</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-primary-600">
                    لا يوجد طلاب مسجلون بعد
                  </td>
                </tr>
              ) : (
                students.slice(0, 5).map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-primary-200 hover:bg-primary-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-primary-900">{student.name}</td>
                    <td className="px-6 py-4 text-primary-700">{student.email}</td>
                    <td className="px-6 py-4 text-primary-700">{student.phone}</td>
                    <td className="px-6 py-4 text-primary-700">{student.package}</td>
                    <td className="px-6 py-4 text-primary-700">{student.gender}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
