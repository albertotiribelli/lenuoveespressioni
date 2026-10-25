#!/usr/bin/env node
// Minimal stand-in for the Supabase REST API, used by CI so `next build` can prerender the data
// pages without a real database, network access or secrets. Every table is empty.
//
//   node scripts/fake-supabase.mjs [port]     (default 54321)
//
// It does NOT make the build lenient: the real site build still fails if Supabase is unreachable,
// which is what we want in production (a failed deploy beats publishing empty pages).
import { createServer } from 'node:http'

const port = Number(process.argv[2] ?? 54321)

const server = createServer((req, res) => {
  if (req.url === '/__health') {
    res.writeHead(200).end('ok')
    return
  }

  // PostgREST answers `.single()` (object accept header) on an empty result with 406 + PGRST116
  if (req.method === 'GET' && (req.headers.accept ?? '').includes('application/vnd.pgrst.object+json')) {
    res.writeHead(406, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ code: 'PGRST116', details: 'The result contains 0 rows', hint: null, message: 'Cannot coerce the result to a single JSON object' }))
    return
  }

  if (req.method === 'GET' || req.method === 'HEAD') {
    res.writeHead(200, { 'content-type': 'application/json', 'content-range': '*/0' })
    res.end(req.method === 'HEAD' ? undefined : '[]')
    return
  }

  res.writeHead(401, { 'content-type': 'application/json' })
  res.end(JSON.stringify({ message: 'read-only fake' }))
})

server.listen(port, '127.0.0.1', () => console.log(`fake supabase on http://127.0.0.1:${port}`))
