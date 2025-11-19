'use client'

import { useState } from 'react'
import { useAdminStore } from '@/store/useAdminStore'
import { Plus, Edit, Trash2, Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StudentsPage() {
  const { students, addStudent, deleteStudent, updateStudent } = useAdminStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<any>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    package: '',
    message: '',
  })

  const filteredStudents = students.filter((student) =>
    Object.values(student).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  const handleEdit = (student: any) => {
    setEditingId(student.id)
    setEditForm(student)
  }

  const handleSaveEdit = () => {
    if (editingId) {
      updateStudent(editingId, editForm)
      setEditingId(null)
      setEditForm({})
    }
  }

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      deleteStudent(id)
    }
  }

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault()
    addStudent({
      ...newStudent,
      age: parseInt(newStudent.age),
    })
    setNewStudent({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      package: '',
      message: '',
    })
    setShowAddModal(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-primary-900">إدارة الطلاب</h1>
        <div className="flex items-center gap-4">
          <div className="text-primary-600 font-medium">إجمالي: {students.length}</div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            إضافة طالب
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl border-2 border-primary-200 p-4 mb-6 shadow-lg">
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-400 w-5 h-5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث عن طالب..."
            className="w-full pr-12 pl-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
            dir="rtl"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400 hover:text-primary-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-xl border-2 border-primary-200 overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-primary-100">
              <tr>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الاسم</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">البريد</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الهاتف</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">العمر</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الجنس</th>
                <th className="px-6 py-4 text-right text-primary-900 font-semibold">الباقة</th>
                <th className="px-6 py-4 text-center text-primary-900 font-semibold">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-primary-600">
                    {searchTerm ? 'لا توجد نتائج' : 'لا يوجد طلاب مسجلون بعد'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className="border-b border-primary-200 hover:bg-primary-50 transition-colors"
                  >
                    {editingId === student.id ? (
                      <>
                        <td>
                          <input
                            type="text"
                            value={editForm.name || ''}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            className="px-2 py-1 border border-primary-300 rounded text-right"
                            dir="rtl"
                          />
                        </td>
                        <td>
                          <input
                            type="email"
                            value={editForm.email || ''}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                            className="px-2 py-1 border border-primary-300 rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="tel"
                            value={editForm.phone || ''}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="px-2 py-1 border border-primary-300 rounded"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={editForm.age || ''}
                            onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value) })}
                            className="px-2 py-1 border border-primary-300 rounded w-20"
                          />
                        </td>
                        <td>
                          <select
                            value={editForm.gender || ''}
                            onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}
                            className="px-2 py-1 border border-primary-300 rounded"
                          >
                            <option value="ذكر">ذكر</option>
                            <option value="أنثى">أنثى</option>
                          </select>
                        </td>
                        <td>
                          <input
                            type="text"
                            value={editForm.package || ''}
                            onChange={(e) => setEditForm({ ...editForm, package: e.target.value })}
                            className="px-2 py-1 border border-primary-300 rounded text-right"
                            dir="rtl"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              حفظ
                            </button>
                            <button
                              onClick={() => {
                                setEditingId(null)
                                setEditForm({})
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              إلغاء
                            </button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-primary-900">{student.name}</td>
                        <td className="px-6 py-4 text-primary-700">{student.email}</td>
                        <td className="px-6 py-4 text-primary-700">{student.phone}</td>
                        <td className="px-6 py-4 text-primary-700">{student.age}</td>
                        <td className="px-6 py-4 text-primary-700">{student.gender}</td>
                        <td className="px-6 py-4 text-primary-700">{student.package}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEdit(student)}
                              className="p-2 text-primary-600 hover:bg-primary-100 rounded-lg transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(student.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-primary-900">إضافة طالب جديد</h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      الاسم الكامل
                    </label>
                    <input
                      type="text"
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      البريد الإلكتروني
                    </label>
                    <input
                      type="email"
                      value={newStudent.email}
                      onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">
                      رقم الهاتف
                    </label>
                    <input
                      type="tel"
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">العمر</label>
                    <input
                      type="number"
                      value={newStudent.age}
                      onChange={(e) => setNewStudent({ ...newStudent, age: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      min="1"
                      max="100"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الجنس</label>
                    <select
                      value={newStudent.gender}
                      onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      required
                    >
                      <option value="">اختر الجنس</option>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-primary-900 font-semibold mb-2 text-right">الباقة</label>
                    <select
                      value={newStudent.package}
                      onChange={(e) => setNewStudent({ ...newStudent, package: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                      dir="rtl"
                      required
                    >
                      <option value="">اختر الباقة</option>
                      <option value="الباقة الأساسية">الباقة الأساسية</option>
                      <option value="الباقة المتوسطة">الباقة المتوسطة</option>
                      <option value="الباقة المميزة">الباقة المميزة</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-primary-900 font-semibold mb-2 text-right">رسالة</label>
                  <textarea
                    value={newStudent.message}
                    onChange={(e) => setNewStudent({ ...newStudent, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border-2 border-primary-200 rounded-lg focus:border-primary-500 outline-none text-right"
                    dir="rtl"
                    placeholder="رسالة أو ملاحظات اختيارية..."
                  />
                </div>
                <div className="flex items-center gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-lg hover:from-primary-800 hover:to-primary-700 transition-all"
                  >
                    إضافة طالب
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 border-2 border-primary-300 text-primary-700 rounded-lg hover:bg-primary-50 transition-all"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
