'use client'

import { useLocale } from '@/contexts/LocaleContext'
import { useTranslation as useI18nTranslation } from '@/lib/i18n'

export function useTranslation() {
  const { locale } = useLocale()
  const { t } = useI18nTranslation(locale)

  return { t, locale }
}
