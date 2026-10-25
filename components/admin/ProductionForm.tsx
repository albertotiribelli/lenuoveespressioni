'use client'

import { useActionState } from 'react'
import { updateProduction, type ActionState } from '@/app/admin/actions'
import Field from './Field'
import FormShell from './FormShell'

export interface ProductionFormValues {
  id: string
  season_year: string
  notes: string | null
}

const INITIAL: ActionState = { ok: false }

export default function ProductionForm({ production }: { production: ProductionFormValues }) {
  const [state, formAction, pending] = useActionState(updateProduction.bind(null, production.id), INITIAL)
  const err = state.fieldErrors ?? {}

  return (
    <FormShell action={formAction} pending={pending} state={state}>
      <Field name="season_year" label="Stagione (es. 2024 oppure 2019/2020)" defaultValue={production.season_year} required error={err.season_year} />
      <Field name="notes" label="Note" defaultValue={production.notes} multiline error={err.notes} />
    </FormShell>
  )
}
