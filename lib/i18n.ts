

type Locale = 'ar' | 'en'

// Load translations synchronously for server/client compatibility
let translations: Record<Locale, any> = {} as any

if (typeof window === 'undefined') {
  // Server-side
  try {
    const fs = require('fs')
    const path = require('path')
    const arPath = path.join(process.cwd(), 'public', 'locales', 'ar', 'common.json')
    const enPath = path.join(process.cwd(), 'public', 'locales', 'en', 'common.json')
    translations.ar = JSON.parse(fs.readFileSync(arPath, 'utf8'))
    translations.en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
  } catch (e) {
    console.error('Error loading translations:', e)
  }
} else {
  // Client-side - will be populated on first use
}

export async function loadTranslations(locale: Locale) {
  if (translations[locale]) return translations[locale]
  
  try {
    const response = await fetch(`/locales/${locale}/common.json`)
    translations[locale] = await response.json()
    return translations[locale]
  } catch (e) {
    console.error('Error loading translations:', e)
    // Fallback to Arabic
    if (!translations.ar) {
      try {
        const response = await fetch('/locales/ar/common.json')
        translations.ar = await response.json()
      } catch {}
    }
    return translations.ar || {}
  }
}

// Pre-load translations on client
if (typeof window !== 'undefined') {
  // Load translations on mount
  loadTranslations('ar').catch(() => {})
  loadTranslations('en').catch(() => {})
}

export function useTranslation(locale: Locale = 'ar') {
  const t = (key: string, options?: { returnObjects?: boolean }): any => {
    const keys = key.split('.')
    let value: any = translations[locale] || translations.ar || {}

    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) {
        // Fallback to Arabic if translation is missing
        value = translations.ar || {}
        for (const fallbackKey of keys) {
          value = value?.[fallbackKey]
        }
        break
      }
    }

    // Handle returnObjects option
    if (options?.returnObjects && (typeof value === 'object' || Array.isArray(value))) {
      return value
    }

    return value ?? key
  }

  return { t }
}

// Server-side helper to get translations object directly
export function getTranslations(locale: Locale = 'ar'): any {
  return translations[locale] || translations.ar || {}
}
