import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
export const REPO_ROOT = join(__dirname, '..', '..')
export const USAGE_DIR = join(REPO_ROOT, '.scratch', 'usage')
export const LEDGER_PATH = join(USAGE_DIR, 'ledger.jsonl')
export const CONTEXT_PATH = join(USAGE_DIR, 'context.json')

export const SESSION_MARKER_START = '<!-- cursor-usage-session'
export const SESSION_MARKER_END = '-->'

export function ensureUsageDir() {
  if (!existsSync(USAGE_DIR)) {
    mkdirSync(USAGE_DIR, { recursive: true })
  }
}

export function appendLedger(row) {
  ensureUsageDir()
  appendFileSync(LEDGER_PATH, `${JSON.stringify(row)}\n`, 'utf8')
}

export function readLedger() {
  if (!existsSync(LEDGER_PATH)) return []
  return readFileSync(LEDGER_PATH, 'utf8')
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try {
        return JSON.parse(line)
      } catch {
        return null
      }
    })
    .filter(Boolean)
}

export function readContext() {
  if (!existsSync(CONTEXT_PATH)) return null
  try {
    return JSON.parse(readFileSync(CONTEXT_PATH, 'utf8'))
  } catch {
    return null
  }
}

export function writeContext(context) {
  ensureUsageDir()
  writeFileSync(CONTEXT_PATH, `${JSON.stringify(context, null, 2)}\n`, 'utf8')
}

export function getGitBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
  } catch {
    return null
  }
}

export function inferIssueFromBranch(branch) {
  if (!branch) return null
  const match = branch.match(/^issue-(\d+)-/i)
  return match ? Number.parseInt(match[1], 10) : null
}

export function nowIso() {
  return new Date().toISOString()
}

export function parseSessionMarkers(text) {
  const sessions = []
  const regex = /<!-- cursor-usage-session\s*([\s\S]*?)-->/g
  let match
  while ((match = regex.exec(text)) !== null) {
    try {
      sessions.push(JSON.parse(match[1].trim()))
    } catch {
      // skip malformed markers
    }
  }
  return sessions
}

export function formatSessionComment(session) {
  const childLabel = session.child ? `child #${session.child}` : 'story'
  const human = `[cursor-usage] ${session.user_email ?? 'unknown'} · ${session.phase} · ${childLabel} · started ${session.ts}`
  const payload = JSON.stringify({
    conversation_id: session.conversation_id,
    story: session.story,
    child: session.child ?? null,
    phase: session.phase,
    user_email: session.user_email ?? null,
    ts: session.ts,
  })
  return `${human}\n\n${SESSION_MARKER_START}\n${payload}\n${SESSION_MARKER_END}`
}

export function sumTokens(tokenUsage) {
  if (!tokenUsage) return 0
  return (
    (tokenUsage.inputTokens ?? 0) +
    (tokenUsage.outputTokens ?? 0) +
    (tokenUsage.cacheReadTokens ?? 0) +
    (tokenUsage.cacheWriteTokens ?? 0)
  )
}

export function formatTokenCount(n) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${Math.round(n / 1_000)}k`
  return String(n)
}

export function formatUsd(cents) {
  return `$${(cents / 100).toFixed(2)}`
}

export function ghJson(args) {
  try {
    const out = execSync(`gh ${args}`, {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
    return JSON.parse(out)
  } catch (error) {
    const message = error.stderr?.toString?.() ?? error.message
    throw new Error(`gh command failed: ${message}`)
  }
}

export function ghRun(args) {
  execSync(`gh ${args}`, { cwd: REPO_ROOT, stdio: ['ignore', 'inherit', 'inherit'] })
}

export function loadEnvLocal() {
  const envPath = join(REPO_ROOT, '.env.local')
  if (!existsSync(envPath)) return
  for (const line of readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}
