'use client'

import { useActionState } from 'react'
import { sendMagicLink, type ActionState } from '@/app/admin/actions'
import Field from './Field'

const INITIAL: ActionState = { ok: false }

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(sendMagicLink, INITIAL)

  if (state.ok) {
    return (
      <p role="status" className="text-sm">
        Se l&apos;email è autorizzata riceverai un link di accesso. Controlla la posta.
      </p>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field name="email" label="Email" type="email" required error={state.error} />
      <button
        type="submit"
        disabled={pending}
        className="min-h-11 rounded-sm bg-[var(--accent)] px-4 font-bold text-white disabled:opacity-50"
      >
        {pending ? 'Invio…' : 'Invia link di accesso'}
      </button>
    </form>
  )
}
