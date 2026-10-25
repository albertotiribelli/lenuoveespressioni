'use client'

import { useActionState } from 'react'
import { updatePlay, type ActionState } from '@/app/admin/actions'
import Field from './Field'
import FormShell from './FormShell'

export interface PlayFormValues {
  id: string
  title: string
  short_desc: string | null
  description: string | null
  poster_url: string | null
  trailer_url: string | null
  youtube_url: string | null
}

const INITIAL: ActionState = { ok: false }

export default function PlayForm({ play }: { play: PlayFormValues }) {
  const [state, formAction, pending] = useActionState(updatePlay.bind(null, play.id), INITIAL)
  const err = state.fieldErrors ?? {}

  return (
    <FormShell action={formAction} pending={pending} state={state}>
      <Field name="title" label="Titolo" defaultValue={play.title} required error={err.title} />
      <Field name="short_desc" label="Descrizione breve" defaultValue={play.short_desc} multiline error={err.short_desc} />
      <Field name="description" label="Descrizione" defaultValue={play.description} multiline error={err.description} />
      <Field name="poster_url" label="URL locandina" type="url" defaultValue={play.poster_url} error={err.poster_url} />
      <Field name="trailer_url" label="URL trailer" type="url" defaultValue={play.trailer_url} error={err.trailer_url} />
      <Field name="youtube_url" label="URL video YouTube" type="url" defaultValue={play.youtube_url} error={err.youtube_url} />
    </FormShell>
  )
}
