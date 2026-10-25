import type { ActionState } from '@/app/admin/actions'

interface FormShellProps {
  action: (formData: FormData) => void
  pending: boolean
  state: ActionState
  children: React.ReactNode
}

export default function FormShell({ action, pending, state, children }: FormShellProps) {
  return (
    <form action={action} className="flex flex-col gap-4">
      {children}
      <div className="fixed inset-x-0 bottom-0 border-t border-[var(--border)] bg-[var(--card-bg)] p-3 sm:static sm:border-0 sm:bg-transparent sm:p-0">
        <div className="mx-auto flex max-w-2xl items-center gap-3">
          <button
            type="submit"
            disabled={pending}
            className="min-h-11 flex-1 rounded-sm bg-[var(--accent)] px-4 font-bold text-white disabled:opacity-50 sm:flex-none"
          >
            {pending ? 'Salvataggio…' : 'Salva'}
          </button>
          <p role="status" aria-live="polite" className="text-sm">
            {state.ok && !pending && <span className="text-green-400">Salvato ✓</span>}
            {state.error && !pending && <span className="text-red-400">{state.error}</span>}
            {state.fieldErrors && !pending && <span className="text-red-400">Controlla i campi evidenziati</span>}
          </p>
        </div>
      </div>
    </form>
  )
}
