'use client'

import { useActionState } from 'react'
import { createCastEntry, updatePerformancePerson, type ActionState } from '@/app/admin/actions'
import { PERFORMANCE_ROLES } from '@/lib/admin/validation'
import Field from './Field'
import FormShell from './FormShell'

export interface PerformancePersonFormValues {
  id: string
  role: string
  character_name: string | null
  sort_order: number | null
  costume_url: string | null
  notes: string | null
}

const INITIAL: ActionState = { ok: false }

interface PerformancePersonFormProps {
  entry?: PerformancePersonFormValues
  // Needed to create: the date the entry belongs to and the people to choose from
  dateId?: string
  people?: { id: string; name: string }[]
}

// Edit a cast entry, or add one to `dateId` when no `entry` is given.
export default function PerformancePersonForm({ entry, dateId, people = [] }: PerformancePersonFormProps) {
  const [state, formAction, pending] = useActionState(
    entry ? updatePerformancePerson.bind(null, entry.id) : createCastEntry.bind(null, dateId ?? ''),
    INITIAL
  )
  const err = state.fieldErrors ?? {}

  return (
    <FormShell action={formAction} pending={pending} state={state}>
      {!entry && (
        <Field
          name="person_id"
          label="Persona"
          options={people.map((p) => ({ value: p.id, label: p.name }))}
          required
          error={err.person_id}
        />
      )}
      <Field name="role" label="Ruolo" defaultValue={entry?.role} options={PERFORMANCE_ROLES} required error={err.role} />
      <Field name="character_name" label="Personaggio" defaultValue={entry?.character_name} error={err.character_name} />
      <Field name="sort_order" label="Ordine nell'elenco" type="number" defaultValue={entry?.sort_order?.toString()} error={err.sort_order} />
      <Field name="costume_url" label="URL costume" type="url" defaultValue={entry?.costume_url} error={err.costume_url} />
      <Field name="notes" label="Note" defaultValue={entry?.notes} multiline error={err.notes} />
    </FormShell>
  )
}
