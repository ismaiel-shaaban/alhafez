'use client'

import Link from 'next/link'
import { useTranslation } from '@/hooks/useTranslation'
import { Check } from 'lucide-react'
import { motion } from 'framer-motion'

export default function PackagesList() {
  const { t } = useTranslation()

  const packages = [
    {
      id: 'basic',
      name: t('packages.basic.name'),
      price: t('packages.basic.price'),
      features: t('packages.basic.features', { returnObjects: true }) as string[],
      popular: false,
    },
    {
      id: 'standard',
      name: t('packages.standard.name'),
      price: t('packages.standard.price'),
      features: t('packages.standard.features', { returnObjects: true }) as string[],
      popular: true,
    },
    {
      id: 'premium',
      name: t('packages.premium.name'),
      price: t('packages.premium.price'),
      features: t('packages.premium.features', { returnObjects: true }) as string[],
      popular: false,
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
    >
      {packages.map((pkg) => (
        <motion.div
          key={pkg.id}
          variants={itemVariants}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          whileHover={{ y: -8, scale: 1.02 }}
          className={`relative bg-white p-8 rounded-xl border-2 ${
            pkg.popular
              ? 'border-accent-green scale-105 shadow-2xl ring-4 ring-accent-green/20'
              : 'border-primary-300 hover:border-primary-400 shadow-lg'
          } transition-all duration-300 hover:shadow-2xl`}
        >
          {pkg.popular && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-gradient-to-r from-accent-green to-primary-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                الأكثر شعبية
              </span>
            </div>
          )}

          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-primary-900 mb-4">{pkg.name}</h3>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-primary-700 to-primary-600 bg-clip-text text-transparent">{pkg.price}</span>
              <span className="text-primary-600">ر.س/شهرياً</span>
            </div>
          </div>

          <ul className="space-y-4 mb-8">
            {pkg.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-gradient-to-br from-accent-green to-primary-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-white" />
                </div>
                <span className="text-primary-700">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/register"
            className={`block w-full text-center py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
              pkg.popular
                ? 'bg-gradient-to-r from-accent-green to-primary-500 hover:from-primary-500 hover:to-accent-green text-white shadow-lg hover:shadow-xl'
                : 'bg-primary-100 hover:bg-primary-200 text-primary-900 border-2 border-primary-400'
            }`}
          >
            {t('packages.select')}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )
}
