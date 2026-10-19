'use client'

import { useActionState } from 'react'
import { updateDate, type ActionState } from '@/app/admin/actions'
import Field from './Field'
import FormShell from './FormShell'

export interface DateFormValues {
  id: string
  date: string
  time: string | null
  theater_name: string
  city: string | null
  notes: string | null
  tickets_url: string | null
  gphotos_url: string | null
}

const INITIAL: ActionState = { ok: false }

export default function DateForm({ date }: { date: DateFormValues }) {
  const [state, formAction, pending] = useActionState(updateDate.bind(null, date.id), INITIAL)
  const err = state.fieldErrors ?? {}

  return (
    <FormShell action={formAction} pending={pending} state={state}>
      <Field name="date" label="Data" type="date" defaultValue={date.date} required error={err.date} />
      <Field name="time" label="Orario" type="time" defaultValue={date.time} error={err.time} />
      <Field name="theater_name" label="Teatro" defaultValue={date.theater_name} required error={err.theater_name} />
      <Field name="city" label="Città" defaultValue={date.city} error={err.city} />
      <Field name="tickets_url" label="Link biglietti (URL, oppure coming-soon)" defaultValue={date.tickets_url} error={err.tickets_url} />
      <Field name="gphotos_url" label="Link foto (Google Photos)" type="url" defaultValue={date.gphotos_url} error={err.gphotos_url} />
      <Field name="notes" label="Note" defaultValue={date.notes} multiline error={err.notes} />
    </FormShell>
  )
}
