export default function PublicTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">Page publique</h1>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          Cette page est accessible sans authentification
        </p>
        <div className="mt-4">
          <a 
            href="/login"
            className="text-blue-600 hover:text-blue-800 underline"
          >
            → Aller au login
          </a>
        </div>
      </div>
    </div>
  )
} 