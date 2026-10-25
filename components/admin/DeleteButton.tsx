'use client'

import { useActionState, useState } from 'react'
import type { ActionState } from '@/app/admin/actions'

interface DeleteButtonProps {
  // A delete server action bound to the row id, e.g. deletePlay.bind(null, id)
  action: (prev: ActionState, formData: FormData) => Promise<ActionState>
  // What is being deleted, e.g. "questo spettacolo"
  label: string
}

const INITIAL: ActionState = { ok: false }

// Two-step delete: the first tap asks for confirmation, the second submits. The server action
// redirects on success, so only the error state is rendered here.
export default function DeleteButton({ action, label }: DeleteButtonProps) {
  const [state, formAction, pending] = useActionState(action, INITIAL)
  const [confirming, setConfirming] = useState(false)

  return (
    <form action={formAction} className="flex flex-col gap-3 border-t border-[var(--border)] pt-6">
      <h2 className="font-bold">Elimina</h2>
      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="min-h-11 self-start rounded-sm border border-red-400 px-4 text-red-400"
        >
          Elimina {label}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm">Vuoi eliminare {label}? L&apos;operazione non si può annullare.</p>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={pending}
              className="min-h-11 rounded-sm bg-red-500 px-4 font-bold text-white disabled:opacity-50"
            >
              {pending ? 'Eliminazione…' : 'Conferma eliminazione'}
            </button>
            <button type="button" disabled={pending} onClick={() => setConfirming(false)} className="min-h-11 rounded-sm border border-[var(--border)] px-4">
              Annulla
            </button>
          </div>
        </div>
      )}
      <p role="status" aria-live="polite" className="text-sm text-red-400">
        {state.error}
      </p>
    </form>
  )
}
