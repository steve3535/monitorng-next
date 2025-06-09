'use client'
import React, { useState, useRef } from 'react'

interface ChatMessage {
  role: 'user' | 'ai'
  content: string
}

export function AnalyticsChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const chatEndRef = useRef<HTMLDivElement>(null)

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    setMessages(msgs => [...msgs, { role: 'user', content: input }])
    setIsLoading(true)
    setError(null)
    setInput('')
    try {
      const res = await fetch('/api/analytics-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: input })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setMessages(msgs => [...msgs, { role: 'ai', content: data.answer }])
    } catch {
      setError('Erreur lors de la requête. Veuillez réessayer.')
    } finally {
      setIsLoading(false)
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col h-[60vh] border rounded-lg shadow bg-card border-zinc-200 dark:border-zinc-700">
      <div className="px-4 pt-4 pb-2 border-b border-zinc-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Chat Analytics</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Posez une question sur vos données réseau…</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-zinc-400 mt-8 text-sm">Aucune question posée pour l&apos;instant.</div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-3 py-2 max-w-[80%] whitespace-pre-line text-sm ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-zinc-100 dark:bg-zinc-800 text-foreground'}`}>{msg.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-3 py-2 bg-zinc-100 dark:bg-zinc-800 text-foreground animate-pulse text-sm">Analyse en cours…</div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={sendMessage} className="p-3 border-t flex gap-2 bg-zinc-50 dark:bg-zinc-900">
        <input
          type="text"
          className="flex-1 rounded border px-3 py-2 focus:outline-none focus:ring focus:border-primary text-sm bg-background"
          placeholder="Votre question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground px-4 py-2 rounded font-semibold disabled:opacity-50 text-sm"
          disabled={isLoading || !input.trim()}
        >
          Envoyer
        </button>
      </form>
      {error && <div className="text-red-600 text-xs text-center p-2">{error}</div>}
    </div>
  )
} 