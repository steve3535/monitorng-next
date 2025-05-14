import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const res = await fetch('https://monitor.linkafric.com/api/devices', {
    headers: { 'x-api-key': 'P@ssNtc202!' },
    cache: 'no-store'
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