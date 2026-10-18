import Link from 'next/link'
import { requireAdminPage } from '@/lib/admin/guard'

const CARD = 'flex min-h-11 flex-col gap-1 rounded-sm border border-[var(--border)] bg-[var(--card-bg)] p-4 hover:border-[var(--accent)]'

export default async function AdminHome() {
  await requireAdminPage()
  return (
    <nav className="grid gap-4 sm:grid-cols-2">
      <Link href="/admin/people" className={CARD}>
        <span className="font-bold">Persone</span>
        <span className="text-sm opacity-70">Bio, foto, ruolo, stato</span>
      </Link>
      <Link href="/admin/dates" className={CARD}>
        <span className="font-bold">Date</span>
        <span className="text-sm opacity-70">Teatro, orario, link biglietti</span>
      </Link>
    </nav>
  )
}
