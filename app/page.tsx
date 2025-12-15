import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Features from '@/components/home/Features'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import PackagesList from '@/components/packages/PackagesList'
import LessonsList from '@/components/lessons/LessonsList'
import TeachersList from '@/components/teachers/TeachersList'
import TestimonialsList from '@/components/testimonials/TestimonialsList'
import AnimatedSection from '@/components/home/AnimatedSection'
import SectionWrapper from '@/components/home/SectionWrapper'

export const metadata: Metadata = {
  title: 'أكاديمية الحافظ | Al-Hafez Academy - تعليم القرآن الكريم',
  description: 'أكاديمية الحافظ لتأسيس وتحفيظ القرآن الكريم لجميع الأعمار رجالاً ونساءً. تعلم أحكام التجويد وتأسيس القراءة للأطفال.',
  keywords: 'حفظ القرآن, تعليم القرآن, تجويد, تعليم العربية, أكاديمية الحافظ, Quran academy, Arabic learning',
  openGraph: {
    title: 'أكاديمية الحافظ | Al-Hafez Academy',
    description: 'أكاديمية الحافظ لتأسيس وتحفيظ القرآن الكريم لجميع الأعمار',
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
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      
      {/* Packages Section */}
      <AnimatedSection id="packages" className="py-20 bg-white" delay={0.2}>
        <div className="container-custom">
          <SectionWrapper delay={0.4}>
            <PackagesList headingLevel="h2" />
          </SectionWrapper>
        </div>
      </AnimatedSection>

      {/* Lessons Section */}
      <AnimatedSection id="lessons" className="py-20 bg-primary-50" delay={0.2}>
        <div className="container-custom">
          <SectionWrapper delay={0.4}>
            <LessonsList headingLevel="h2" limit={6} />
          </SectionWrapper>
        </div>
      </AnimatedSection>

      {/* Teachers Section */}
      <AnimatedSection id="teachers" className="py-20 bg-white" delay={0.2}>
        <div className="container-custom">
          <SectionWrapper delay={0.4}>
            <TeachersList headingLevel="h2" limit={4} />
          </SectionWrapper>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection id="testimonials" className="py-20 bg-white" delay={0.2}>
        <div className="container-custom">
          <SectionWrapper delay={0.4}>
            <TestimonialsList headingLevel="h2" carousel={true} />
          </SectionWrapper>
        </div>
      </AnimatedSection>

      <Footer />
    </main>
  )
}
