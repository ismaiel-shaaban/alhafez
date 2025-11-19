import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import PackagesList from '@/components/packages/PackagesList'
import { getTranslations } from '@/lib/translations'

export const metadata: Metadata = {
  title: 'الباقات | أكاديمية الحافظ - خطط التعلم',
  description: 'اختر الباقة المناسبة لك من باقات أكاديمية الحافظ لتعلم القرآن الكريم واللغة العربية. باقات مرنة تناسب جميع الاحتياجات.',
  keywords: 'باقات تعليمية, أسعار الكورسات, باقات القرآن, تعليم عربي',
  openGraph: {
    title: 'الباقات | أكاديمية الحافظ',
    description: 'اختر الباقة المناسبة لك',
    type: 'website',
  },
  alternates: {
    canonical: '/packages',
  },
}

export default function PackagesPage() {
  const t = getTranslations('ar')

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="section-title">{t.packages.title}</h1>
            <p className="section-subtitle">{t.packages.subtitle}</p>
          </div>
          <PackagesList />
        </div>
      </section>
      <Footer />
    </div>
  )
}
