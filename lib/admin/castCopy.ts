// lib/admin/castCopy.ts — pick the cast entries to copy from one date to another

export interface CastRow {
  person_id: string | null
  role: string
  character_name: string | null
  sort_order: number | null
  costume_url: string | null
  notes: string | null
}

const key = (r: Pick<CastRow, 'person_id' | 'role' | 'character_name'>) =>
  `${r.person_id}|${r.role}|${r.character_name ?? ''}`

// Entries of `source` that are not already on the target date (same person, role and character),
// so copying onto a date that already has some cast never creates duplicates.
export function castRowsToCopy(source: readonly CastRow[], existing: readonly CastRow[], targetDateId: string) {
  const have = new Set(existing.map(key))
  return source
    .filter((r) => r.person_id && !have.has(key(r)))
    .map((r) => ({
      date_id: targetDateId,
      person_id: r.person_id,
      role: r.role,
      character_name: r.character_name,
      sort_order: r.sort_order,
      costume_url: r.costume_url,
      notes: r.notes,
    }))
}
