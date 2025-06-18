'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AnalyticsNavbar() {
  const pathname = usePathname()
  return (
    <nav className="px-6 py-2 border-b border-zinc-200 dark:border-zinc-700 bg-background text-sm flex gap-4">
      <Link
        href="/dashboard"
        className={
          pathname === '/dashboard'
            ? 'font-semibold text-primary'
            : 'text-zinc-500 hover:text-primary transition-colors'
        }
      >
        Dashboard
      </Link>
      <span className="text-zinc-400">|</span>
      <Link
        href="/analytics"
        className={
          pathname === '/analytics'
            ? 'font-semibold text-primary'
            : 'text-zinc-500 hover:text-primary transition-colors'
        }
      >
        Analyses
      </Link>
      <span className="text-zinc-400">|</span>
      <Link
        href="/alertes"
        className={
          pathname === '/alertes'
            ? 'font-semibold text-primary'
            : 'text-zinc-500 hover:text-primary transition-colors'
        }
      >
        Alertes
      </Link>
    </nav>
  )
} 