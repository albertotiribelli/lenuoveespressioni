import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/lib/company'

export const metadata: Metadata = {
  title: 'Chi Siamo',
  description: 'La storia della compagnia teatrale Le Nuove Espressioni, fondata nel 2006 a Bovisio Masciago. Vent\'anni di teatro, spettacoli e collaborazioni.',
  openGraph: {
    title: 'Chi Siamo — Le Nuove Espressioni',
    description: 'La storia della compagnia teatrale Le Nuove Espressioni, fondata nel 2006 a Bovisio Masciago.',
    type: 'website',
  },
}

export default function ChiSiamoPage() {
  return (
    <article className="mx-auto max-w-3xl px-6 py-20">
      <p className="mb-4 text-xs uppercase tracking-[0.3em] text-[var(--accent)]">La compagnia</p>
      <h1 className="mb-2 font-serif text-4xl text-[var(--text)]">Chi Siamo</h1>
      <div className="mb-12 h-px w-12 bg-[var(--accent)]" />

      <section className="space-y-6 leading-relaxed text-[var(--text-muted)]">
        <h2 className="font-serif text-2xl text-[var(--text)]">La nostra storia</h2>

        <p>
          Il primo spettacolo messo in scena dagli attori della compagnia,{' '}
          <em>"Su di Noi Nemmeno una Nuvola"</em>, risale al 2006. In occasione
          dell&apos;ordinazione sacerdotale di Don Antonio Pogliani, con Sonia Turella
          nelle vesti di regista è stato realizzato un adattamento di{' '}
          <em>"Aggiungi un Posto a Tavola"</em>. Dopo la prima e la replica in Campanella,
          lo spettacolo è stato portato in scena in altri 5 teatri della zona
          (Lentate sul Seveso, Varedo, Monza, Cologno Monzese e Carate Brianza),
          ricevendo un ottimo riscontro da parte del pubblico.
        </p>

        <p>
          Gettate le basi per questa esperienza oramai decennale, il gruppo si è allargato
          notevolmente e ha intrapreso la preparazione di un nuovo spettacolo, sempre
          all&apos;interno dell&apos;oratorio di Bovisio Masciago. La regia de{' '}
          <em>"I Soliti Idioti"</em> è stata curata da Massimo Clerici. Con il nuovo
          spettacolo, <em>"Herkules"</em>, andato in scena nel 2011, si sono poste le basi
          per l&apos;attuale formazione della compagnia: è infatti da questo spettacolo che
          Stefania Belotti è l&apos;educatrice di riferimento del gruppo. Con l&apos;aiuto
          alla regia di Ivana Stranci, dopo la consueta prima al teatro "La Campanella",
          lo spettacolo è stato replicato anche a Birago e a Milano, in un teatro all&apos;aperto.
        </p>

        <p>
          Durante la gestione di Stefania Belotti sono stati realizzati altri 14 spettacoli
          principali, con la prima al "La Campanella" a cavallo di ogni primavera ed estate,
          e la replica, solitamente nello stesso teatro, tra autunno e inverno dello stesso anno.
        </p>

        <p>
          Nel 2015, in contemporanea con la realizzazione di <em>"E...State Insieme"</em>,
          la compagnia e i suoi membri storici hanno deciso di espandere i propri orizzonti,
          ufficializzando la creazione dell&apos;associazione <strong className="text-[var(--text)]">Le Nuove Espressioni</strong>{' '}
          per portare avanti a tutto tondo l&apos;attività oramai decennale. Con la creazione
          dell&apos;associazione sono state avviate diverse collaborazioni: con{' '}
          <em>"Gli Amici della Mergasciada"</em>, per cui la compagnia ha portato in scena
          diversi spettacoli in occasione della festa del paese; con l&apos;associazione{' '}
          <em>"Baule Verde"</em>, che promuove le visite a Villa Zari a Bovisio. Un&apos;importante
          collaborazione è quella con la <strong className="text-[var(--text)]">Fondazione Oratori Milanesi — FOM</strong>:
          dal 2016 una delegazione de "Le Nuove Espressioni" mette in scena spezzoni del vangelo
          davanti al pubblico di migliaia di ragazzi e del vescovo, in occasione
          dell&apos;incontro diocesano con i quindicenni al Sacro Monte di Varese. Nel 2015
          è stata inoltre realizzata una piccola scena su San Francesco per la{' '}
          <em>"Notte dei Santi"</em> in piazza Duomo a Milano.
        </p>
      </section>

      <div className="my-12 h-px w-full bg-[var(--border)]" />

      <section className="space-y-4">
        <h2 className="font-serif text-2xl text-[var(--text)]">Dove siamo</h2>
        <p className="text-[var(--text-muted)]">{COMPANY.rehearsals}</p>
        <p className="text-[var(--text-muted)]">{COMPANY.address}</p>

        <div className="mt-6 flex items-center gap-6">
          <a
            href={COMPANY.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987H7.898v-2.89h2.54V9.845c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33V21.88C18.343 21.128 22 16.991 22 12z"/>
            </svg>
          </a>
          <a
            href={COMPANY.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <Link
            href="/contatti"
            className="text-sm text-[var(--accent)] hover:underline"
          >
            Scrivici →
          </Link>
        </div>
      </section>
    </article>
  )
}
