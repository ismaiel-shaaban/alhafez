import type { Metadata } from 'next'
import { Tajawal, Poppins } from 'next/font/google'
import './globals.css'
import { LocaleProvider } from '@/contexts/LocaleContext'

const tajawal = Tajawal({
  subsets: ['latin', 'arabic'],
  variable: '--font-tajawal',
  weight: ['300', '400', '500', '700', '800'],
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'أكاديمية الحافظ | Al-Hafez Academy',
  description: 'أكاديمية الحافظ لتأسيس وتحفيظ القرآن الكريم',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${tajawal.variable} ${poppins.variable} font-arabic antialiased`}>
        <LocaleProvider>
          {children}
        </LocaleProvider>
      </body>
    </html>
  )
}
