'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowRight, History, Loader2, Phone, User } from 'lucide-react'
import {
  getStudentAuditLogs,
  type StudentAuditLogsData,
  type StudentAuditLog,
} from '@/lib/api/students'

function formatAuditValue(value: unknown): string {
  if (value === null || value === undefined) return '—'
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2)
    } catch {
      return String(value)
    }
  }
  return String(value)
}

function methodBadgeClass(method: string): string {
  switch (method?.toUpperCase()) {
    case 'POST':
      return 'bg-emerald-100 text-emerald-800'
    case 'PUT':
    case 'PATCH':
      return 'bg-amber-100 text-amber-900'
    case 'DELETE':
      return 'bg-red-100 text-red-800'
    case 'GET':
      return 'bg-slate-100 text-slate-800'
    default:
      return 'bg-primary-100 text-primary-800'
  }
}

function statusBadgeClass(code: number): string {
  if (code >= 200 && code < 300) return 'bg-emerald-50 text-emerald-900 ring-1 ring-emerald-200'
  if (code >= 400) return 'bg-red-50 text-red-900 ring-1 ring-red-200'
  return 'bg-slate-50 text-slate-800 ring-1 ring-slate-200'
}

export default function StudentAuditLogsPage() {
  const params = useParams()
  const idParam = params?.id
  const studentId = typeof idParam === 'string' ? parseInt(idParam, 10) : NaN

  const [data, setData] = useState<StudentAuditLogsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!Number.isFinite(studentId) || studentId < 1) {
      setLoading(false)
      setError('معرّف الطالب غير صالح')
      return
    }
    let cancelled = false
    ;(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await getStudentAuditLogs(studentId)
        if (!cancelled) setData(res)
      } catch (e: any) {
        if (!cancelled) setError(e?.message || 'فشل تحميل السجل')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [studentId])

  return (
    <div className="w-full min-w-0 max-w-full mx-auto px-0 sm:px-0" dir="rtl">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/admin/students"
            className="inline-flex items-center gap-2 text-primary-700 hover:text-primary-900 font-medium text-sm shrink-0"
          >
            <ArrowRight className="w-4 h-4 shrink-0" />
            العودة إلى الطلاب
          </Link>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6 sm:mb-8 min-w-0">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-100 text-primary-700">
          <History className="w-6 h-6" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary-900 break-words">
            سجل العمليات
          </h1>
          {data?.student && (
            <p className="text-primary-600 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-semibold text-primary-900">{data.student.name}</span>
              <span className="text-primary-500 text-sm">معرّف الطالب: {data.student.id}</span>
              {data.student.phone && (
                <span className="inline-flex items-center gap-1 tabular-nums text-primary-800" dir="ltr">
                  <Phone className="w-3.5 h-3.5 opacity-70 shrink-0" />
                  {data.student.phone}
                </span>
              )}
            </p>
          )}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20 text-primary-600 gap-2">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span>جاري التحميل...</span>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border-2 border-red-200 bg-red-50 px-4 py-3 text-red-800">{error}</div>
      )}

      {!loading && !error && data && (
        <div className="space-y-5 lg:space-y-6 w-full min-w-0">
          {data.logs.length === 0 ? (
            <div className="rounded-xl border-2 border-primary-200 bg-white px-4 py-12 text-center text-primary-600">
              لا توجد عمليات مسجّلة لهذا الطالب
            </div>
          ) : (
            data.logs.map((log: StudentAuditLog) => {
              const rawLog = log as unknown as Record<string, unknown>
              return (
                <article
                  key={log.id}
                  className="rounded-xl border-2 border-primary-200 bg-white p-3 sm:p-5 md:p-6 lg:p-8 shadow-sm space-y-4 lg:space-y-6 w-full min-w-0 max-w-full overflow-hidden"
                >
                  <div className="flex flex-col gap-2 border-b border-primary-100 pb-3 min-w-0 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-primary-900 shrink-0">سجل #{log.id}</h2>
                    <div
                      className="w-full min-w-0 max-w-full text-left text-[11px] sm:text-xs text-primary-500 font-mono break-all"
                      dir="ltr"
                    >
                      {log.created_at}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8 xl:gap-10 w-full min-w-0">
                  {/* طلب HTTP — كل الحقول */}
                  <section className="min-w-0">
                    <h3 className="text-sm font-bold text-primary-800 mb-2">الطلب</h3>
                    <div className="rounded-lg border border-primary-100 bg-primary-50/40 divide-y divide-primary-100 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,8rem)_1fr] lg:grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1 px-3 py-2 sm:items-start">
                        <span className="text-primary-600 font-medium shrink-0">رقم السجل</span>
                        <span className="font-mono font-semibold text-primary-950">{log.id}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,8rem)_1fr] lg:grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1 px-3 py-2 sm:items-start">
                        <span className="text-primary-600 font-medium shrink-0">تاريخ ووقت التنفيذ</span>
                        <div>
                          <div className="text-primary-900 text-sm sm:text-base break-words">
                            {new Date(log.created_at).toLocaleString('ar-EG', {
                              dateStyle: 'medium',
                              timeStyle: 'short',
                            })}
                          </div>
                          <div className="text-xs text-primary-500 font-mono mt-0.5" dir="ltr">
                            {log.created_at}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,8rem)_1fr] lg:grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1 px-3 py-2 sm:items-start">
                        <span className="text-primary-600 font-medium shrink-0">المسار (path)</span>
                        <span className="font-mono text-xs break-all text-primary-900 min-w-0" dir="ltr">
                          {log.path}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,8rem)_1fr] lg:grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1 px-3 py-2 sm:items-center">
                        <span className="text-primary-600 font-medium shrink-0">طريقة HTTP</span>
                        <span>
                          <span
                            className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold font-mono ${methodBadgeClass(log.http_method)}`}
                          >
                            {log.http_method}
                          </span>
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,8rem)_1fr] lg:grid-cols-[minmax(0,10rem)_1fr] gap-x-3 gap-y-1 px-3 py-2 sm:items-center">
                        <span className="text-primary-600 font-medium shrink-0">رمز الاستجابة</span>
                        <span
                          className={`inline-flex w-fit px-2 py-0.5 rounded-md text-xs font-bold tabular-nums ${statusBadgeClass(log.response_status)}`}
                        >
                          {log.response_status}
                        </span>
                      </div>
                    </div>
                  </section>

                  {/* المنفّذ — كل حقول actor */}
                  <section className="min-w-0">
                    <h3 className="text-sm font-bold text-primary-800 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 shrink-0" />
                      المنفّذ (actor)
                    </h3>
                    <div className="rounded-lg border border-emerald-100 bg-emerald-50/30 divide-y divide-emerald-100 text-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,9rem)_1fr] lg:grid-cols-[minmax(0,11rem)_1fr] gap-x-3 gap-y-1 px-3 py-2">
                        <span className="text-primary-600 font-medium shrink-0">نوع المنفّذ (type)</span>
                        <span className="font-mono text-primary-900">{log.actor?.type ?? '—'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,9rem)_1fr] lg:grid-cols-[minmax(0,11rem)_1fr] gap-x-3 gap-y-1 px-3 py-2">
                        <span className="text-primary-600 font-medium shrink-0">وصف النوع (type_label)</span>
                        <span className="text-primary-900">{log.actor?.type_label ?? '—'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,9rem)_1fr] lg:grid-cols-[minmax(0,11rem)_1fr] gap-x-3 gap-y-1 px-3 py-2">
                        <span className="text-primary-600 font-medium shrink-0">معرّف المستخدم (id)</span>
                        <span className="font-mono tabular-nums text-primary-900">
                          {log.actor?.id != null ? String(log.actor.id) : '—'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,9rem)_1fr] lg:grid-cols-[minmax(0,11rem)_1fr] gap-x-3 gap-y-1 px-3 py-2">
                        <span className="text-primary-600 font-medium shrink-0">الاسم (name)</span>
                        <span className="font-semibold text-primary-950">{log.actor?.name ?? '—'}</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,9rem)_1fr] lg:grid-cols-[minmax(0,11rem)_1fr] gap-x-3 gap-y-1 px-3 py-2">
                        <span className="text-primary-600 font-medium shrink-0">الهاتف (phone)</span>
                        <span className="font-mono tabular-nums text-primary-900" dir="ltr">
                          {log.actor?.phone ?? '—'}
                        </span>
                      </div>
                    </div>
                  </section>
                  </div>

                  {/* التغييرات */}
                  <section className="w-full min-w-0">
                    <h3 className="text-sm font-bold text-primary-800 mb-2">التغييرات على الحقول (changes)</h3>
                    {!log.changes || log.changes.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-primary-200 bg-slate-50/80 px-2 py-4 text-xs sm:text-sm text-primary-600 text-center leading-relaxed">
                        لا توجد تغييرات مسجّلة على مستوى الحقول (مصفوفة changes فارغة). قد يكون السجل يوثّق
                        العملية فقط دون تفاصيل قبل/بعد.
                      </div>
                    ) : (
                      <>
                        {/* شاشات صغيرة: بطاقات بدون تمرير أفقي */}
                        <div className="md:hidden space-y-3 w-full min-w-0">
                          {log.changes.map((ch, idx) => (
                            <div
                              key={`${log.id}-m-${idx}-${ch.field}`}
                              className="rounded-lg border border-primary-100 bg-primary-50/30 p-3 space-y-2.5 text-sm w-full min-w-0 max-w-full"
                            >
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-primary-600 mb-0.5">معرّف الحقل</p>
                                <p className="font-mono text-xs text-primary-800 break-all">{ch.field}</p>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-primary-600 mb-0.5">الوصف</p>
                                <p className="text-primary-900 break-words">{ch.label || '—'}</p>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-primary-600 mb-0.5">قبل</p>
                                <pre className="font-mono text-xs text-primary-800 whitespace-pre-wrap break-words overflow-x-auto max-w-full rounded bg-white/80 p-2 border border-primary-100">
                                  {formatAuditValue(ch.before)}
                                </pre>
                              </div>
                              <div className="min-w-0">
                                <p className="text-[11px] font-semibold text-primary-600 mb-0.5">بعد</p>
                                <pre className="font-mono text-xs text-primary-950 whitespace-pre-wrap break-words overflow-x-auto max-w-full rounded bg-white/80 p-2 border border-primary-100">
                                  {formatAuditValue(ch.after)}
                                </pre>
                              </div>
                            </div>
                          ))}
                        </div>
                        {/* md فأعلى: جدول */}
                        <div className="hidden md:block overflow-x-auto rounded-lg border border-primary-100 w-full min-w-0 max-w-full">
                          <table className="w-full min-w-0 text-sm">
                            <thead className="bg-primary-50">
                              <tr>
                                <th className="px-2 sm:px-3 xl:px-4 py-2 text-right font-semibold text-primary-800 whitespace-nowrap xl:w-[10%]">
                                  معرّف الحقل (field)
                                </th>
                                <th className="px-2 sm:px-3 xl:px-4 py-2 text-right font-semibold text-primary-800 xl:w-[14%]">
                                  الوصف (label)
                                </th>
                                <th className="px-2 sm:px-3 xl:px-4 py-2 text-right font-semibold text-primary-800 xl:w-[38%]">
                                  قبل (before)
                                </th>
                                <th className="px-2 sm:px-3 xl:px-4 py-2 text-right font-semibold text-primary-800 xl:w-[38%]">
                                  بعد (after)
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {log.changes.map((ch, idx) => (
                                <tr key={`${log.id}-${idx}-${ch.field}`} className="border-t border-primary-100 align-top">
                                  <td className="px-2 sm:px-3 xl:px-4 py-2 font-mono text-xs text-primary-600 align-top break-all min-w-0">
                                    {ch.field}
                                  </td>
                                  <td className="px-2 sm:px-3 xl:px-4 py-2 text-primary-800 font-medium align-top break-words min-w-0">
                                    {ch.label || '—'}
                                  </td>
                                  <td className="px-2 sm:px-3 xl:px-4 py-2 text-primary-800 font-mono text-xs align-top min-w-0 break-words whitespace-pre-wrap">
                                    {formatAuditValue(ch.before)}
                                  </td>
                                  <td className="px-2 sm:px-3 xl:px-4 py-2 text-primary-950 font-mono text-xs align-top min-w-0 break-words whitespace-pre-wrap">
                                    {formatAuditValue(ch.after)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </section>

                  {/* أي حقول إضافية من الـ API */}
                  {(() => {
                    const known = new Set([
                      'id',
                      'created_at',
                      'path',
                      'http_method',
                      'response_status',
                      'actor',
                      'changes',
                    ])
                    const extraKeys = Object.keys(rawLog).filter((k) => !known.has(k))
                    if (extraKeys.length === 0) return null
                    return (
                      <section>
                        <h3 className="text-sm font-bold text-primary-800 mb-2">حقول إضافية من الخادم</h3>
                        <pre className="text-xs font-mono bg-amber-50 border border-amber-100 rounded-lg p-3 overflow-x-auto text-amber-950 w-full min-w-0 max-w-full" dir="ltr">
                          {JSON.stringify(
                            Object.fromEntries(extraKeys.map((k) => [k, rawLog[k]])),
                            null,
                            2
                          )}
                        </pre>
                      </section>
                    )
                  })()}

                  <details className="rounded-lg border border-slate-200 bg-slate-50/80 text-sm w-full min-w-0">
                    <summary className="cursor-pointer list-none px-2 sm:px-3 py-2 font-medium text-slate-700 hover:bg-slate-100 rounded-lg text-xs sm:text-sm leading-snug break-words [&::-webkit-details-marker]:hidden">
                      عرض السجل كاملًا (JSON) — لجميع الحقول كما وردت من الـ API
                    </summary>
                    <pre className="mt-2 px-3 pb-3 text-xs font-mono text-slate-800 overflow-x-auto max-h-80 overflow-y-auto whitespace-pre-wrap break-words w-full min-w-0 max-w-full" dir="ltr">
                      {JSON.stringify(log, null, 2)}
                    </pre>
                  </details>
                </article>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
