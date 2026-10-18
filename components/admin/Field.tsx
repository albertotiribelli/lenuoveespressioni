interface FieldProps {
  name: string
  label: string
  defaultValue?: string | null
  type?: 'text' | 'url' | 'date' | 'time' | 'email'
  required?: boolean
  error?: string
  multiline?: boolean
}

const INPUT =
  'min-h-11 w-full rounded-sm border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-base text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none'

export default function Field({ name, label, defaultValue, type = 'text', required, error, multiline }: FieldProps) {
  const id = `field-${name}`
  const describedBy = error ? `${id}-error` : undefined
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {multiline ? (
        <textarea id={id} name={name} defaultValue={defaultValue ?? ''} rows={6} aria-invalid={!!error} aria-describedby={describedBy} className={INPUT} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          defaultValue={type === 'time' ? (defaultValue ?? '').slice(0, 5) : (defaultValue ?? '')}
          required={required}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={INPUT}
        />
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}
