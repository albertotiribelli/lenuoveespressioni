interface Props {
  params: { slug: string }
}

export default function AttorePage({ params }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">
        Attore
      </p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">
        {params.slug.replace(/-/g, ' ')}
      </h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />
      <p className="text-[var(--text-muted)]">
        Pagina in costruzione.
      </p>
    </section>
  )
}
