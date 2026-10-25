interface FieldProps {
  name: string
  label: string
  defaultValue?: string | null
  type?: 'text' | 'url' | 'date' | 'time' | 'email' | 'number'
  required?: boolean
  error?: string
  multiline?: boolean
  options?: readonly (string | { value: string; label: string })[]
}

const INPUT =
  'min-h-11 w-full rounded-sm border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-base text-[var(--foreground)] focus:border-[var(--accent)] focus:outline-none'

export default function Field({ name, label, defaultValue, type = 'text', required, error, multiline, options }: FieldProps) {
  const id = `field-${name}`
  const describedBy = error ? `${id}-error` : undefined
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-bold">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {options ? (
        <select id={id} name={name} defaultValue={defaultValue ?? ''} required={required} aria-invalid={!!error} aria-describedby={describedBy} className={INPUT}>
          {!defaultValue && <option value="" />}
          {defaultValue && !options.some((o) => (typeof o === 'string' ? o : o.value) === defaultValue) && (
            <option value={defaultValue}>{defaultValue}</option>
          )}
          {options.map((o) => {
            const { value, label } = typeof o === 'string' ? { value: o, label: o } : o
            return (
              <option key={value} value={value}>
                {label}
              </option>
            )
          })}
        </select>
      ) : multiline ? (
        <textarea id={id} name={name} defaultValue={defaultValue ?? ''} rows={6} aria-invalid={!!error} aria-describedby={describedBy} className={INPUT} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          {...(type === 'number' && { inputMode: 'numeric' as const, min: 0 })}
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
