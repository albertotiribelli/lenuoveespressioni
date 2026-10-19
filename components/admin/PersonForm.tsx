'use client'

import { useActionState } from 'react'
import { updatePerson, type ActionState } from '@/app/admin/actions'
import Field from './Field'
import FormShell from './FormShell'

export interface PersonFormValues {
  id: string
  name: string
  role: string
  bio: string | null
  photo_url: string | null
  joined_at: string
  is_active: boolean | null
}

const INITIAL: ActionState = { ok: false }

export default function PersonForm({ person }: { person: PersonFormValues }) {
  const [state, formAction, pending] = useActionState(updatePerson.bind(null, person.id), INITIAL)
  const err = state.fieldErrors ?? {}

  return (
    <FormShell action={formAction} pending={pending} state={state}>
      <Field name="name" label="Nome" defaultValue={person.name} required error={err.name} />
      <Field name="role" label="Ruolo (actor, director, technician, other)" defaultValue={person.role} required error={err.role} />
      <Field name="joined_at" label="Data di ingresso" type="date" defaultValue={person.joined_at} required error={err.joined_at} />
      <label className="flex min-h-11 items-center gap-3">
        <input type="checkbox" name="is_active" defaultChecked={!!person.is_active} className="h-5 w-5" />
        <span className="text-sm font-bold">Membro attivo</span>
      </label>
      <Field name="photo_url" label="URL foto" type="url" defaultValue={person.photo_url} error={err.photo_url} />
      <Field name="bio" label="Biografia" defaultValue={person.bio} multiline error={err.bio} />
    </FormShell>
  )
}
