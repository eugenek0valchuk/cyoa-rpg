import { Suspense } from 'react'

import { t } from '@/lib/i18n'

import { EditorForm } from './EditorForm'

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black text-sm uppercase tracking-[0.3em] text-[#75685f]">
          {t.ui.editor.preparing}
        </main>
      }
    >
      <EditorForm />
    </Suspense>
  )
}
