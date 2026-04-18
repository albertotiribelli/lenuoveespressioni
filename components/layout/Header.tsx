import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { href: '/spettacoli', label: 'Spettacoli' },
  { href: '/chi-siamo', label: 'Chi Siamo' },
  { href: '/archivio', label: 'Archivio' },
  { href: '/media', label: 'Media' },
  { href: '/contatti', label: 'Contatti' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Le Nuove Espressioni"
            width={120}
            height={60}
            className="object-contain"
            priority
          />
        </Link>

        <nav>
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm tracking-wider uppercase text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
