import LoginForm from '@/components/admin/LoginForm'

const MESSAGES: Record<string, string> = {
  forbidden: 'Questo account non è autorizzato.',
  link: 'Link non valido o scaduto. Richiedine uno nuovo.',
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-serif text-2xl">Accesso</h1>
      {error && MESSAGES[error] && (
        <p role="alert" className="text-sm text-red-400">
          {MESSAGES[error]}
        </p>
      )}
      <LoginForm />
    </section>
  )
}
