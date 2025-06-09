import { AnalyticsChat } from '../../components/AnalyticsChat'
import { ThemeToggle } from '../../components/ThemeToggle'
import { LogoutButton } from '../../components/LogoutButton'
import AnalyticsNavbar from '../../components/AnalyticsNavbar'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 dark:border-zinc-700 bg-background">
        <div className="text-2xl font-bold tracking-tight">Monitoring réseau monétique</div>
        <div className="flex items-center gap-4">
          <LogoutButton />
          <ThemeToggle />
        </div>
      </header>
      {/* Navbar */}
      <AnalyticsNavbar />
      {/* Main split */}
      <main className="flex flex-col md:flex-row gap-6 px-4 md:px-8 py-6 max-w-7xl mx-auto">
        {/* Left: Graphs/Diagrams placeholder */}
        <section className="flex-1 min-w-0 bg-card rounded-lg border border-zinc-200 dark:border-zinc-700 p-6 mr-0 md:mr-4">
          <div className="h-full flex items-center justify-center text-zinc-400 text-lg">
            {/* (Ici, vos graphiques et diagrammes seront affichés) */}
          </div>
        </section>
        {/* Right: Analytics Chat */}
        <aside className="w-full md:w-1/4 flex-shrink-0">
          <AnalyticsChat />
        </aside>
      </main>
    </div>
  )
} 