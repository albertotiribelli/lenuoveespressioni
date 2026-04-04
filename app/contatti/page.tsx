export default function ContattiPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
        Scrivici
      </p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Contatti</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />

      <div className="space-y-4 text-[var(--text-muted)]">
        <p>
          Per informazioni su spettacoli, collaborazioni e ospitalità, scrivici a:
        </p>
        <p>
          <a
            href="mailto:lenuoveespressioni@gmail.com"
            className="text-[var(--accent)] hover:underline"
          >
            lenuoveespressioni@gmail.com
          </a>
        </p>
      </div>
    </section>
  )
}
