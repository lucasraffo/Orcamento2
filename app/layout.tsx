import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Orçamento',
  description: 'Raffo Refrigeração',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
