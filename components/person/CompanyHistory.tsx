'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import type { TimelineEntry } from '@/lib/membershipTimeline'

const MembershipTimeline = dynamic(() => import('./MembershipTimeline'))

const FLAG = 'edespressionisimili'

type State = { status: 'idle' } | { status: 'loading' } | { status: 'error' } | { status: 'ready'; people: TimelineEntry[]; allYears: string[] }

// /attori is statically rendered. The hidden company history (?edespressionisimili) is switched on in the
// browser after load: the regular view is the server-rendered `children`, and only when the flag is present
// the timeline data is fetched and shown instead.
export default function CompanyHistory({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>({ status: 'idle' })

  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has(FLAG)) return
    let cancelled = false
    setState({ status: 'loading' })
    fetch('/api/attori/timeline')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { people: TimelineEntry[]; allYears: string[] }) => {
        if (!cancelled) setState({ status: 'ready', people: data.people, allYears: data.allYears })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error' })
      })
    return () => {
      cancelled = true
    }
  }, [])

  // On error, keep showing the regular view rather than a broken page.
  if (state.status === 'idle' || state.status === 'error') return <>{children}</>

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Le Nuove Espressioni</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Storia della Compagnia</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
      {state.status === 'loading' ? (
        <p role="status" className="text-sm text-[var(--text-muted)]">
          Caricamento…
        </p>
      ) : (
        <MembershipTimeline people={state.people} allYears={state.allYears} />
      )}
    </section>
  )
}
