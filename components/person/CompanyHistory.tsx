'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState, useSyncExternalStore } from 'react'
import type { TimelineEntry } from '@/lib/membershipTimeline'

const MembershipTimeline = dynamic(() => import('./MembershipTimeline'))

const FLAG = 'edespressionisimili'

type Result = { status: 'error' } | { status: 'ready'; people: TimelineEntry[]; allYears: string[] }

const subscribeNoop = () => () => {}
const hasFlag = () => new URLSearchParams(window.location.search).has(FLAG)

// /attori is statically rendered. The hidden company history (?edespressionisimili) is switched on in the
// browser after load: the regular view is the server-rendered `children`, and only when the flag is present
// the timeline data is fetched and shown instead.
export default function CompanyHistory({ children }: { children: React.ReactNode }) {
  // False on the server and during hydration, then the real value once on the client.
  const flagged = useSyncExternalStore(subscribeNoop, hasFlag, () => false)
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    if (!flagged) return
    let cancelled = false
    fetch('/api/attori/timeline')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { people: TimelineEntry[]; allYears: string[] }) => {
        if (!cancelled) setResult({ status: 'ready', people: data.people, allYears: data.allYears })
      })
      .catch(() => {
        if (!cancelled) setResult({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [flagged])

  // On error, keep showing the regular view rather than a broken page.
  if (!flagged || result?.status === 'error') return <>{children}</>

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Le Nuove Espressioni</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Storia della Compagnia</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
      {result === null ? (
        <p role="status" className="text-sm text-[var(--text-muted)]">
          Caricamento…
        </p>
      ) : (
        <MembershipTimeline people={result.people} allYears={result.allYears} />
      )}
    </section>
  )
}
