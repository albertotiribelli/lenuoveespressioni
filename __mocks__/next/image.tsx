import React from 'react'

const Image = ({ src, alt, className }: { src: string; alt: string; fill?: boolean; className?: string; sizes?: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={src} alt={alt} className={className} />
)

export default Image
