'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Locale = 'ar' | 'en'

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  toggleLocale: () => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('ar')

  useEffect(() => {
    // Load locale from localStorage or default to Arabic
    const savedLocale = localStorage.getItem('locale') as Locale | null
    if (savedLocale === 'ar' || savedLocale === 'en') {
      setLocaleState(savedLocale)
      updateDocumentAttributes(savedLocale)
    } else {
      updateDocumentAttributes('ar')
    }
  }, [])

  const updateDocumentAttributes = (newLocale: Locale) => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = newLocale
      document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    }
  }

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem('locale', newLocale)
    updateDocumentAttributes(newLocale)
  }

  const toggleLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    setLocale(newLocale)
  }

  useEffect(() => {
    updateDocumentAttributes(locale)
  }, [locale])

  return (
    <LocaleContext.Provider value={{ locale, setLocale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider')
  }
  return context
}
