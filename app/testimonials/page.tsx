import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import TestimonialsList from '@/components/testimonials/TestimonialsList'
import { getTranslations } from '@/lib/translations'

export const metadata: Metadata = {
  title: 'آراء الطلاب | أكاديمية الحافظ - تجارب الطلاب',
  description: 'اقرأ تجارب و آراء طلاب أكاديمية الحافظ حول تجربتهم في تعلم القرآن الكريم واللغة العربية.',
  keywords: 'آراء الطلاب, تجارب طلاب, تقييمات أكاديمية الحافظ, شهادات طلاب',
  openGraph: {
    title: 'آراء الطلاب | أكاديمية الحافظ',
    description: 'ماذا يقول طلابنا عنا',
    type: 'website',
  },
  alternates: {
    canonical: '/testimonials',
  },
}

export default function TestimonialsPage() {
  const t = getTranslations('ar')

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h1 className="section-title">{t.testimonials.title}</h1>
            <p className="section-subtitle">{t.testimonials.subtitle}</p>
          </div>
          <TestimonialsList />
        </div>
      </section>
      <Footer />
    </div>
  )
}
