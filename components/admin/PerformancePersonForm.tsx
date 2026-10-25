'use client'

import { useActionState } from 'react'
import { updatePerformancePerson, type ActionState } from '@/app/admin/actions'
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

export default function PerformancePersonForm({ entry }: { entry: PerformancePersonFormValues }) {
  const [state, formAction, pending] = useActionState(updatePerformancePerson.bind(null, entry.id), INITIAL)
  const err = state.fieldErrors ?? {}

  return (
    <FormShell action={formAction} pending={pending} state={state}>
      <Field name="role" label="Ruolo" defaultValue={entry.role} options={PERFORMANCE_ROLES} required error={err.role} />
      <Field name="character_name" label="Personaggio" defaultValue={entry.character_name} error={err.character_name} />
      <Field name="sort_order" label="Ordine nell'elenco" type="number" defaultValue={entry.sort_order?.toString()} error={err.sort_order} />
      <Field name="costume_url" label="URL costume" type="url" defaultValue={entry.costume_url} error={err.costume_url} />
      <Field name="notes" label="Note" defaultValue={entry.notes} multiline error={err.notes} />
    </FormShell>
  )
}
