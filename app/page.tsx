import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">AI Choose Your Adventure</h1>
      <Link href="/editor" className="bg-blue-500 text-white px-4 py-2 rounded">
        Start Game
      </Link>
    </main>
  )
}
