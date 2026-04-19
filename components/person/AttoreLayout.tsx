'use client'

import { useState } from 'react'
import Image from 'next/image'
import CompanyTimeline from './CompanyTimeline'

interface PersonData {
  readonly name: string
  readonly photo_url: string | null
  readonly bio: string | null
  readonly role: string
}

interface HistoryEntry {
  readonly character_name: string | null
  readonly costume_url: string | null
  readonly role: string
  readonly notes: string | null
  readonly dates: {
    readonly date: string
    readonly theater_name: string
    readonly city: string | null
    readonly productions: {
      readonly season_year: string
      readonly plays: {
        readonly title: string
        readonly slug: string
      }
    }
  }
}

interface AttoreLayoutProps {
  readonly person: PersonData
  readonly roleLabel: string
  readonly history: readonly HistoryEntry[]
}

export default function AttoreLayout({ person, roleLabel, history }: AttoreLayoutProps) {
  const [costumeUrl, setCostumeUrl] = useState<string | null>(null)

  const showCostume = costumeUrl !== null

  return (
    <>
      <div className="mb-12 flex flex-col gap-8 sm:flex-row sm:items-start">
        <div className="relative h-48 w-36 flex-shrink-0 overflow-hidden rounded-sm bg-[var(--border)]">
          {/* Profile photo */}
          {person.photo_url && (
            <Image
              src={person.photo_url}
              alt={person.name}
              fill
              className={`object-cover object-top transition-opacity duration-300 ${showCostume ? 'opacity-0' : 'opacity-100'}`}
              priority
              sizes="144px"
            />
          )}
          {/* Costume photo overlay */}
          {costumeUrl && (
            <Image
              src={costumeUrl}
              alt={`${person.name} in costume`}
              fill
              className="object-cover object-top transition-opacity duration-300 opacity-100"
              sizes="144px"
            />
          )}
          {!person.photo_url && !costumeUrl && (
            <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        <div>
          <p className="mb-1 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
            {roleLabel}
          </p>
          <h1 className="mb-4 font-serif text-4xl text-[var(--text)]">{person.name}</h1>
          {person.bio && (
            <p className="leading-relaxed text-[var(--text-muted)]">{person.bio}</p>
          )}
        </div>
      </div>

      <div className="h-px w-full bg-[var(--border)]" />

      <section className="mt-10">
        <h2 className="mb-6 text-xs uppercase tracking-widest text-[var(--accent)]">
          Storia in compagnia
        </h2>
        <CompanyTimeline history={history} onPlayHover={setCostumeUrl} />
      </section>
    </>
  )
}
