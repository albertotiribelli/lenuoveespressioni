import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/lib/company'

export const metadata: Metadata = {
  title: 'Chi Siamo',
  description: 'La storia della compagnia teatrale Le Nuove Espressioni, nata nel 2007 a Bovisio Masciago. Quasi vent\'anni di teatro, spettacoli e collaborazioni.',
  openGraph: {
    title: 'Chi Siamo — Le Nuove Espressioni',
    description: 'La storia della compagnia teatrale Le Nuove Espressioni, nata nel 2007 a Bovisio Masciago.',
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
          La compagnia muove i primi passi nel 2007 con un nome derivato da alcuni scherzi e
          citazioni che emergono naturalmente durante le prove: <em>&ldquo;…ed espressioni simili&rdquo;</em>
        </p>

        <p>
          Il primo spettacolo messo in scena dalla compagnia risale al 2008:{' '}
          <Link href="/spettacoli/aggiungi_un_posto_a_tavola" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Su di Noi Nemmeno una Nuvola&rdquo;</em>
          </Link>. In occasione
          dell&apos;ordinazione sacerdotale di Don Antonio Pogliani, con la regia di Sonia
          Turella, viene realizzato un adattamento di <em>&ldquo;Aggiungi un Posto a Tavola&rdquo;</em>.
          Dopo la prima e la replica a La Campanella, lo spettacolo viene portato anche in
          altri cinque teatri della zona — Lentate sul Seveso, Varedo, Monza, Cologno
          Monzese e Carate Brianza — ottenendo un ottimo riscontro da parte del pubblico.
        </p>

        <p>
          Su queste basi il gruppo cresce, si allarga e continua il proprio percorso
          all&apos;interno dell&apos;oratorio di Bovisio Masciago, avviando la preparazione
          di un nuovo spettacolo.
        </p>

        <p>
          Nasce così{' '}
          <Link href="/spettacoli/soliti_idioti" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;I Soliti Idioti&rdquo;</em>
          </Link>, con la regia di Massimo Clerici.
        </p>

        <p>
          Nel 2011 arriva un nuovo passaggio importante: Stefania Belotti assume la regia
          come educatrice di riferimento del gruppo, affiancata da Ivana Stranci come aiuto
          regia. Nasce così{' '}
          <Link href="/spettacoli/from_zero_to_hero" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Herkules&rdquo;</em>
          </Link>, spettacolo che verrà replicato anche a Birago e a Milano, in un teatro all&apos;aperto.
        </p>

        <p>
          Questo spettacolo segna un punto di svolta nel percorso della
          compagnia. Con la regia di Stefania Belotti nasceranno infatti tanti altri
          spettacoli, tutti costruiti con una prima a La Campanella tra primavera ed estate
          e una replica tra autunno e inverno dello stesso anno. È un&apos;impostazione che,
          nei fatti, continua ancora oggi.
        </p>

        <p>
          Un altro passaggio decisivo arriva nel 2015. In quello stesso anno, mentre prende
          forma{' '}
          <Link href="/spettacoli/grease" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;E...State Insieme&rdquo;</em>
          </Link>, rivisitazione del classico{' '}
          <em>Grease</em>, la compagnia e i suoi membri storici scelgono di dare al progetto
          una struttura più definita, ufficializzando la nascita dell&apos;associazione{' '}
          <strong className="text-[var(--text)]">Le Nuove Espressioni</strong>. Fino a quel
          momento il gruppo si presentava come compagnia teatrale <em>&ldquo;... ed
          espressioni simili&rdquo;</em>; da lì in avanti prende avvio un percorso più ampio
          e indipendente.
        </p>

        <p>
          Con la nascita dell&apos;associazione si aprono anche diverse collaborazioni. Tra
          queste c&apos;è quella con <em>&ldquo;Gli Amici della Mergasciada&rdquo;</em>, per
          cui la compagnia realizza spettacoli, quiz, quadri viventi e altre iniziative in
          occasione della festa del paese.
        </p>

        <p>
          Si sviluppa anche la collaborazione con l&apos;associazione{' '}
          <em>&ldquo;Baule Verde&rdquo;</em>, impegnata nella promozione delle visite a
          Villa Zari di Bovisio Masciago.
        </p>

        <p>
          Tra le collaborazioni più significative c&apos;è anche quella con la{' '}
          <strong className="text-[var(--text)]">Fondazione Oratori Milanesi — FOM</strong>.
          Già nel 2015 viene realizzata una breve scena su San Francesco per la{' '}
          <em>&ldquo;Notte dei Santi&rdquo;</em> in piazza Duomo a Milano. Dal 2016, invece,
          una delegazione de Le Nuove Espressioni mette in scena spezzoni del Vangelo davanti
          a migliaia di ragazzi e al vescovo, durante l&apos;incontro diocesano con i
          quindicenni al Sacro Monte di Varese.
        </p>

        <p>
          Parallelamente, la compagnia inizia a porsi obiettivi sempre più ambiziosi. Nel
          2016, con{' '}
          <Link href="/spettacoli/la_bella_e_la_bestia" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Tra realtà e Magia&rdquo;</em>
          </Link>, propria versione de{' '}
          <em>&ldquo;La Bella e la Bestia&rdquo;</em>, i costumi vengono realizzati a mano
          dai membri del gruppo, ispirandosi allo stile del celebre film d&apos;animazione.
          Nel 2017 arrivano invece per la prima volta canzoni in inglese, con uno spettacolo
          più volte replicato, ispirato al musical <em>Mamma Mia!</em> e intitolato{' '}
          <Link href="/spettacoli/mamma_mia!" className="text-[var(--accent)] hover:underline">
            <em>Say I Do</em>
          </Link>. Lo spettacolo verrà poi replicato nel gennaio 2023 in memoria
          di Stefano Ronchi.
        </p>

        <p>
          Nel 2018, con{' '}
          <Link href="/spettacoli/flashdance" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;I Wanna Dance&rdquo;</em>
          </Link>, la compagnia — i cui membri
          iniziano ormai a essere anagraficamente adulti — affronta uno spettacolo più
          impegnativo sul piano dell&apos;interpretazione e del ballo.
        </p>

        <p>
          Questo percorso prepara l&apos;annata 2019/2020 e porta in scena{' '}
          <Link href="/spettacoli/romeo_e_giulietta" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Un Amore Senza Tempo&rdquo;</em>
          </Link>, liberamente ispirato allo
          shakespeariano <em>&ldquo;Romeo e Giulietta&rdquo;</em>. Molto apprezzato dal
          pubblico, lo spettacolo consolida anche la fama delle cantanti della compagnia e
          viene replicato nella cornice del Circolo Alessandro Volta di Milano.
        </p>

        <p>
          Il 2020 e il 2021 sono anni segnati da difficoltà globale che mettono in crisi
          anche il fare teatro. La compagnia, però, non si ferma: durante il periodo di
          quarantena continua a ballare e a provare a distanza, filmandosi e lavorando per
          via telematica. Un modo concreto per dimostrare che nulla può fermare la passione
          per il palcoscenico e l&apos;affetto per il proprio pubblico.
        </p>

        <p>
          Nel 2022, dopo molti mesi lontani dal sipario del Teatro La Campanella, va in scena{' '}
          <Link href="/spettacoli/footloose" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Don&apos;t Dance&rdquo;</em>
          </Link>, spettacolo che racconta la voglia di
          ballare e cantare nonostante le difficoltà esterne. Un titolo e un messaggio
          perfettamente in linea con il momento vissuto.
        </p>

        <p>
          Segue poi{' '}
          <Link href="/spettacoli/sister_act" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Sorella alla Riscossa&rdquo;</em>
          </Link>, che non è solo un altro
          successo — in una storia fatta quasi sempre di spettacoli sold out grazie a un
          pubblico affezionato — ma anche una conferma della maturità artistica raggiunta
          dalla compagnia. Replicato tre volte, di cui la terza con il patrocinio
          dell&apos;associazione <em>&ldquo;Maria Letizia Verga&rdquo;</em>, è uno
          spettacolo corale che unisce qualità canore, energia comica e capacità di stare
          in scena come gruppo, restituendo al pubblico tutta la forza della compagnia.
        </p>

        <p>
          L&apos;anno seguente la compagnia porta in scena una propria versione de{' '}
          <Link href="/spettacoli/la_famiglia_addams" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;La Famiglia Addams&rdquo;</em>
          </Link>. Anche le canzoni vengono riadattate,
          con sessioni di registrazione e arrangiamento musicale svolte in uno studio messo
          a disposizione da un genitore del gruppo, fatto poi diventare membro{' '}
          <em>ad honorem</em>.
        </p>

        <p>
          Gli anniversari contano, e per celebrare il 15° anno del gruppo si sceglie di
          riportare in scena{' '}
          <Link href="/spettacoli/from_zero_to_hero_2" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Herkules&rdquo;</em>
          </Link> in una versione più matura:
          canzoni riadattate, nuovi inserimenti musicali e scenografie di grande impatto
          disegnate da un attore che, nel frattempo, ha trasformato la propria passione in
          un percorso professionale legato alla scenografia e alle arti visive.
        </p>

        <p>
          La compagnia, oggi associazione, è guidata da un consiglio formato in gran parte
          da membri storici, che negli anni ha continuato a interrogarsi sulla direzione da
          prendere. Nel 2026 arriva un&apos;altra svolta importante: forte della crescita
          maturata nel canto, nel lavoro in studio di registrazione, nelle scenografie e nel
          rapporto con un pubblico ormai ben oltre i confini del paese, la compagnia sceglie
          di affrontare quello che, almeno per ora, è lo spettacolo più complesso del suo
          percorso,{' '}
          <Link href="/spettacoli/greatest_showman" className="text-[var(--accent)] hover:underline">
            <em>&ldquo;Freaks&apos; Heart – Impossible Come True&rdquo;</em>
          </Link>. Un
          nuovo passo avanti, ispirato alla storia di P.T. Barnum, che lascia intuire quanto
          il cammino sia ancora aperto.
        </p>

        <p>
          E allora si torna all&apos;inizio: a un gruppo di adolescenti che, con il tempo,
          ha scelto di diventare associazione. Un gruppo di amici che, forte dei legami nati
          negli anni della giovinezza, è rimasto unito continuando a portare avanti una
          passione comune.
        </p>

        <p>
          In quasi vent&apos;anni di storia sono passati tanti attori, ma molti degli ex
          membri fanno ancora fatica a lasciare il gruppo WhatsApp e spesso, la sera della
          prima, sono dietro le quinte a gridare un &ldquo;merda&rdquo; a tutti, come segno
          di buon auspicio. È anche per questo che Le Nuove Espressioni non sono solo una
          compagnia teatrale o un&apos;associazione culturale, ma un gruppo di sorelle e
          fratelli uniti da una stessa passione.
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
