import type { Metadata } from 'next'
import { COMPANY } from '@/lib/company'

export const revalidate = 86400

export const metadata: Metadata = {
  title: 'Contatti',
  description: 'Contatta la compagnia teatrale Le Nuove Espressioni per collaborazioni, ospitalità e informazioni sugli spettacoli.',
  alternates: { canonical: '/contatti' },
  openGraph: {
    title: 'Contatti — Le Nuove Espressioni',
    description: 'Contatta la compagnia teatrale Le Nuove Espressioni per collaborazioni, ospitalità e informazioni sugli spettacoli.',
    type: 'website',
    images: [{ url: '/logo.png' }],
  },
}

export default function ContattiPage() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">Scrivici</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Contatti</h1>
      <div className="mb-10 h-px w-12 bg-[var(--accent)]" />

      <div className="grid gap-12 sm:grid-cols-2">
        <div className="space-y-6 text-[var(--text-muted)]">
          <div>
            <h2 className="mb-2 text-xs uppercase tracking-widest text-[var(--accent)]">Email</h2>
            <a
              href={`mailto:${COMPANY.email}`}
              className="text-[var(--text)] hover:text-[var(--accent)] transition-colors"
            >
              {COMPANY.email}
            </a>
          </div>

          <div>
            <h2 className="mb-2 text-xs uppercase tracking-widest text-[var(--accent)]">Dove siamo</h2>
            <p>{COMPANY.address}</p>
          </div>

          <div>
            <h2 className="mb-2 text-xs uppercase tracking-widest text-[var(--accent)]">Prove</h2>
            <p>{COMPANY.rehearsals}</p>
          </div>

          <div>
            <h2 className="mb-2 text-xs uppercase tracking-widest text-[var(--accent)]">Social</h2>
            <div className="flex items-center gap-4">
              <a
                href={COMPANY.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z"/>
                </svg>
                Facebook
              </a>
              <a
                href={COMPANY.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="rounded-sm border border-[var(--border)] p-6 text-sm text-[var(--text-muted)]">
          <p className="mb-4 font-serif text-lg text-[var(--text)]">Per teatri e organizzatori</p>
          <p className="leading-relaxed">
            Siamo disponibili per ospitalità, collaborazioni e nuove date.
            Scriveteci per ricevere il nostro dossier di compagnia e il calendario
            degli spettacoli disponibili.
          </p>
        </div>
      </div>
    </section>
  )
}
