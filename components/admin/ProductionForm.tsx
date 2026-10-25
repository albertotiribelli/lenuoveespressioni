'use client'

import { useActionState } from 'react'
import { createProduction, updateProduction, type ActionState } from '@/app/admin/actions'
import Field from './Field'
import FormShell from './FormShell'

export interface ProductionFormValues {
  id: string
  season_year: string
  notes: string | null
}

const INITIAL: ActionState = { ok: false }

// Edit a production, or create one under `playId` when no `production` is given.
export default function ProductionForm({ production, playId }: { production?: ProductionFormValues; playId?: string }) {
  const [state, formAction, pending] = useActionState(
    production ? updateProduction.bind(null, production.id) : createProduction.bind(null, playId ?? ''),
    INITIAL
  )
  const err = state.fieldErrors ?? {}

  return (
    <FormShell action={formAction} pending={pending} state={state}>
      <Field name="season_year" label="Stagione (es. 2024 oppure 2019/2020)" defaultValue={production?.season_year} required error={err.season_year} />
      <Field name="notes" label="Note" defaultValue={production?.notes} multiline error={err.notes} />
    </FormShell>
  )
}
