import { Suspense } from 'react'

import { EditorForm } from './EditorForm'

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-black text-sm uppercase tracking-[0.3em] text-[#75685f]">
          Preparing descent...
        </main>
      }
    >
      <EditorForm />
    </Suspense>
  )
}
