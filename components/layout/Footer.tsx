export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="section-divider mt-auto">
      <div className="mx-auto max-w-6xl px-6 py-8 text-center">
        <p className="text-sm text-[var(--text-muted)]">
          &copy; {year} Le Nuove Espressioni. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  )
}
