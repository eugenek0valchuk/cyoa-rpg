import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { t } from '@/lib/i18n'

import { AmbientAudioShell } from '@/components/audio/AmbientAudioShell'

import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'] })

export const metadata: Metadata = {
  title: t.ui.meta.title,
  description: t.ui.meta.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={inter.className}>
        <AmbientAudioShell>{children}</AmbientAudioShell>
      </body>
    </html>
  )
}
