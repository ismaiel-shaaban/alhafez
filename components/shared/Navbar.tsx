'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { useLocale } from '@/contexts/LocaleContext'
import { Menu, X, BookOpen, Globe } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false)
  const { t } = useTranslation()
  const { setLocale, locale } = useLocale()

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleLangMenu = () => setIsLangMenuOpen(!isLangMenuOpen)

  const changeLanguage = (locale: 'ar' | 'en') => {
    setLocale(locale)
    setIsLangMenuOpen(false)
  }

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/#features', label: t('nav.features') },
    { href: '/honor-board', label: t('nav.honorBoard') },
    { href: '/teachers', label: t('nav.teachers') },
    { href: '/packages', label: t('nav.packages') },
    { href: '/testimonials', label: t('nav.testimonials') },
    { href: '/register', label: t('nav.register') },
  ]

  return (
    <nav className="fixed top-0 w-full bg-navbar backdrop-blur-sm z-50 border-b border-primary shadow-md">
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <img
                src="/images/logo.jpg"
                alt="أكاديمية الحافظ"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent) {
                    parent.innerHTML = '<div class="w-full h-full bg-gradient-to-br from-secondary via-accent-green to-secondary-dark rounded-full flex items-center justify-center"><svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"></path></svg></div>'
                  }
                }}
              />
            </div>
            <span className="text-xl font-bold text-primary-900 hidden sm:block">
              أكاديمية الحافظ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-primary-700 hover:text-accent-green transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Language Switcher & Mobile Menu Button */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={toggleLangMenu}
                className="flex items-center gap-2 text-primary-700 hover:text-accent-green transition-colors p-2"
              >
                <Globe className="w-5 h-5" />
                <span className="hidden sm:inline">{locale === 'ar' ? 'العربية' : 'English'}</span>
              </button>
              {isLangMenuOpen && (
                <div className="absolute left-0 mt-2 w-32 bg-white rounded-lg shadow-xl border border-primary-300">
                  <button
                    onClick={() => changeLanguage('ar')}
                    className="block w-full text-right px-4 py-2 hover:bg-primary-100 rounded-t-lg text-primary-900"
                  >
                    العربية
                  </button>
                  <button
                    onClick={() => changeLanguage('en')}
                    className="block w-full text-right px-4 py-2 hover:bg-primary-100 rounded-b-lg text-primary-900"
                  >
                    English
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-primary-900 p-2"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden pb-4 border-t border-primary-300 mt-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block py-3 text-primary-700 hover:text-accent-green transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
