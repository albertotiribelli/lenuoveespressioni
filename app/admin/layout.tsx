import type { Metadata } from 'next'
import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { signOut } from './actions'

export const metadata: Metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient()
  const { data } = await supabase.auth.getUser()

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
        <Link href="/admin" className="min-h-11 content-center font-serif text-lg">
          Admin
        </Link>
        {data.user && (
          <form action={signOut} className="flex items-center gap-3 text-sm">
            <span className="truncate">{data.user.email}</span>
            <button type="submit" className="min-h-11 underline">
              Esci
            </button>
          </form>
        )}
      </header>
      {children}
    </div>
  )
}
