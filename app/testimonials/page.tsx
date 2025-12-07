import type { Metadata } from 'next'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import TestimonialsList from '@/components/testimonials/TestimonialsList'

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
  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <section className="pt-32 pb-20">
        <div className="container-custom">
          <TestimonialsList />
        </div>
      </section>
      <Footer />
    </div>
  )
}
