import { buildEmbedUrl } from '@/lib/youtube'

interface YoutubeEmbedProps {
  url: string | null
  title?: string
}

export default function YoutubeEmbed({ url, title = 'Trailer' }: YoutubeEmbedProps) {
  const embedUrl = buildEmbedUrl(url)
  if (!embedUrl) return null

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-sm">
      <iframe
        src={embedUrl}
        title={title}
        // Trailers are below the fold: do not load YouTube's player until the user scrolls near it.
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  )
}
