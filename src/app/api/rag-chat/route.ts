import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const res = await fetch('https://monitor.linkafric.com/api/rag-chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })

  let data
  try {
    data = await res.json()
  } catch {
    const text = await res.text()
    return NextResponse.json({ error: 'API error', detail: text }, { status: res.status })
  }

  return NextResponse.json(data, { status: res.status })
} 