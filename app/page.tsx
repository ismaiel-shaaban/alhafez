import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import PackagesList from '@/components/packages/PackagesList'
import TeachersList from '@/components/teachers/TeachersList'
import TestimonialsList from '@/components/testimonials/TestimonialsList'
import AnimatedSection from '@/components/home/AnimatedSection'
import SectionWrapper from '@/components/home/SectionWrapper'
import { getTranslations } from '@/lib/translations'

export const metadata: Metadata = {
  title: 'أكاديمية الحافظ | Al-Hafez Academy - تعليم القرآن الكريم',
  description: 'أكاديمية الحافظ لتعليم القرآن الكريم واللغة العربية لجميع الأعمار رجالاً ونساءً. تعلم أحكام التجويد وتأسيس القراءة للأطفال.',
  keywords: 'حفظ القرآن, تعليم القرآن, تجويد, تعليم العربية, أكاديمية الحافظ, Quran academy, Arabic learning',
  openGraph: {
    title: 'أكاديمية الحافظ | Al-Hafez Academy',
    description: 'أكاديمية الحافظ لتعليم القرآن الكريم واللغة العربية لجميع الأعمار',
    type: 'website',
    locale: 'ar_AR',
    alternateLocale: 'en_US',
  },
  alternates: {
    canonical: '/',
    languages: {
      'ar': '/',
      'en': '/en',
    },
  },
}

export default function Home() {
  const t = getTranslations('ar')

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Packages Section */}
      <AnimatedSection id="packages" className="py-20 bg-white" delay={0.2}>
        <div className="container-custom">
          <SectionWrapper delay={0.3}>
            <div className="text-center mb-12">
              <h2 className="section-title">{t.packages.title}</h2>
              <p className="section-subtitle">{t.packages.subtitle}</p>
            </div>
          </SectionWrapper>
          <SectionWrapper delay={0.4}>
            <PackagesList />
          </SectionWrapper>
        </div>
      </AnimatedSection>

      {/* Teachers Section */}
      <AnimatedSection id="teachers" className="py-20 bg-white" delay={0.2}>
        <div className="container-custom">
          <SectionWrapper delay={0.3}>
            <div className="text-center mb-12">
              <h2 className="section-title">{t.teachers.title}</h2>
              <p className="section-subtitle">{t.teachers.subtitle}</p>
            </div>
          </SectionWrapper>
          <SectionWrapper delay={0.4}>
            <TeachersList />
          </SectionWrapper>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection id="testimonials" className="py-20 bg-white" delay={0.2}>
        <div className="container-custom">
          <SectionWrapper delay={0.3}>
            <div className="text-center mb-12">
              <h2 className="section-title">{t.testimonials.title}</h2>
              <p className="section-subtitle">{t.testimonials.subtitle}</p>
            </div>
          </SectionWrapper>
          <SectionWrapper delay={0.4}>
            <TestimonialsList />
          </SectionWrapper>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  )
}
