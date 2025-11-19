'use client'

import { useState } from 'react'
import { useTranslation } from '@/hooks/useTranslation'
import { useStore } from '@/store/useStore'
import { Send, CheckCircle } from 'lucide-react'

export default function RegisterForm() {
  const { t } = useTranslation()
  const { addStudent, setLoading, isLoading } = useStore()
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    package: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const student = {
      id: Date.now().toString(),
      ...formData,
      age: parseInt(formData.age),
    }

    addStudent(student)
    setLoading(false)
    setSuccess(true)

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      package: '',
      message: '',
    })

    setTimeout(() => setSuccess(false), 5000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="container-custom max-w-2xl">
      <div className="text-center mb-12">
        <h1 className="section-title">{t('register.title')}</h1>
        <p className="section-subtitle">{t('register.subtitle')}</p>
      </div>

      {success && (
        <div className="mb-6 p-4 bg-green-50 border-2 border-green-400 rounded-lg flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600" />
          <p className="text-green-700 font-medium">{t('register.success')}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl border-2 border-primary-200 shadow-xl">
        <div className="space-y-6">
          <div>
            <label className="block text-primary-900 font-medium mb-2">{t('register.fullName')}</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-primary-50 border-2 border-primary-300 rounded-lg text-primary-900 focus:outline-none focus:border-accent-green transition-colors"
            />
          </div>

          <div>
            <label className="block text-primary-900 font-medium mb-2">{t('register.email')}</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-primary-50 border-2 border-primary-300 rounded-lg text-primary-900 focus:outline-none focus:border-accent-green transition-colors"
            />
          </div>

          <div>
            <label className="block text-primary-900 font-medium mb-2">{t('register.phone')}</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-primary-50 border-2 border-primary-300 rounded-lg text-primary-900 focus:outline-none focus:border-accent-green transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-primary-900 font-medium mb-2">{t('register.age')}</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min="5"
                className="w-full px-4 py-3 bg-primary-50 border-2 border-primary-300 rounded-lg text-primary-900 focus:outline-none focus:border-accent-green transition-colors"
              />
            </div>

            <div>
              <label className="block text-primary-900 font-medium mb-2">{t('register.gender')}</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-primary-50 border-2 border-primary-300 rounded-lg text-primary-900 focus:outline-none focus:border-accent-green transition-colors"
              >
                <option value="">-- {t('register.gender')} --</option>
                <option value="male">{t('register.male')}</option>
                <option value="female">{t('register.female')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-primary-900 font-medium mb-2">{t('register.package')}</label>
            <select
              name="package"
              value={formData.package}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-primary-50 border-2 border-primary-300 rounded-lg text-primary-900 focus:outline-none focus:border-accent-green transition-colors"
            >
              <option value="">-- {t('register.package')} --</option>
              <option value="basic">{t('packages.basic.name')}</option>
              <option value="standard">{t('packages.standard.name')}</option>
              <option value="premium">{t('packages.premium.name')}</option>
            </select>
          </div>

          <div>
            <label className="block text-primary-900 font-medium mb-2">{t('register.message')}</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 bg-primary-50 border-2 border-primary-300 rounded-lg text-primary-900 focus:outline-none focus:border-accent-green transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full justify-center text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              'جاري الإرسال...'
            ) : (
              <>
                <Send className="w-5 h-5" />
                {t('register.submit')}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
