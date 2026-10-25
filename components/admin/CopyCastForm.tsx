'use client'

import { useActionState } from 'react'
import { copyCastFromDate, type ActionState } from '@/app/admin/actions'
import Field from './Field'

export interface CopyCastSource {
  id: string
  label: string
}

const INITIAL: ActionState = { ok: false }

// Copies the cast of another date of the same production onto `dateId`.
export default function CopyCastForm({ dateId, sources }: { dateId: string; sources: CopyCastSource[] }) {
  const [state, formAction, pending] = useActionState(copyCastFromDate.bind(null, dateId), INITIAL)
  if (sources.length === 0) return null

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-3">
      <h2 className="font-bold">Copia il cast da un&apos;altra data</h2>
      <Field
        name="source_date_id"
        label="Data di partenza"
        options={sources.map((s) => ({ value: s.id, label: s.label }))}
        required
        error={state.fieldErrors?.source_date_id}
      />
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 self-start rounded-sm border border-[var(--accent)] px-4 text-[var(--accent)] disabled:opacity-50"
      >
        {pending ? 'Copia in corso…' : 'Copia le voci'}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-red-400">
        {state.error}
      </p>
    </form>
  )
}
