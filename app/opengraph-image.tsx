import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { COMPANY } from '@/lib/company'

// Default social preview (1200x630) for every page that does not set its own image: home, company,
// archive, media, about and contact. Plays and people use their own poster or photo.
export const alt = `${COMPANY.name} — compagnia teatrale`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const logo = await readFile(join(process.cwd(), 'public', 'logo.png'))
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 80px',
          backgroundColor: '#1A1B26',
          backgroundImage: 'linear-gradient(135deg, #1A1B26 0%, #1E2033 100%)',
          color: '#FFFFFF',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 600 }}>
          <div style={{ fontSize: 26, letterSpacing: 8, textTransform: 'uppercase', color: '#E94560' }}>Compagnia Teatrale</div>
          <div style={{ marginTop: 24, fontSize: 92, fontWeight: 700, lineHeight: 1.05 }}>{COMPANY.name}</div>
          <div style={{ marginTop: 32, width: 96, height: 4, backgroundColor: '#E94560' }} />
          <div style={{ marginTop: 32, fontSize: 32, lineHeight: 1.3, color: '#7C8DB5' }}>La magia del teatro prende vita!</div>
          <div style={{ marginTop: 16, fontSize: 24, color: '#7C8DB5' }}>{COMPANY.address}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={410} height={212} alt="" style={{ objectFit: 'contain' }} />
      </div>
    ),
    size
  )
}
