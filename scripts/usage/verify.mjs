#!/usr/bin/env node
/**
 * Smoke tests for usage tracking scripts (no Admin API or GitHub writes).
 */
import { existsSync, unlinkSync } from 'node:fs'
import { execSync } from 'node:child_process'
import {
  CONTEXT_PATH,
  LEDGER_PATH,
  formatSessionComment,
  parseSessionMarkers,
  readContext,
  readLedger,
  REPO_ROOT,
} from './lib.mjs'

let failed = 0

function assert(condition, message) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    failed += 1
  } else {
    console.log(`ok: ${message}`)
  }
}

function run(cmd) {
  return execSync(cmd, { cwd: REPO_ROOT, encoding: 'utf8' })
}

// Round-trip session marker
const session = {
  conversation_id: 'test-conv-123',
  story: 38,
  child: 41,
  phase: 'plan',
  user_email: 'dev@example.com',
  ts: '2026-08-12T18:04:00.000Z',
}
const comment = formatSessionComment(session)
const parsed = parseSessionMarkers(comment)
assert(parsed.length === 1, 'parseSessionMarkers extracts one session')
assert(parsed[0].conversation_id === session.conversation_id, 'conversation_id round-trips')

// set-context CLI
try {
  if (existsSync(CONTEXT_PATH)) unlinkSync(CONTEXT_PATH)
  run('node scripts/usage/set-context.mjs --phase grill-with-docs --feature-doc docs/product/features/calculator-v2.md')
  const ctx = readContext()
  assert(ctx?.phase === 'grill-with-docs', 'set-context writes phase')
  assert(ctx?.feature_doc?.includes('calculator-v2'), 'set-context writes feature_doc')

  run('node scripts/usage/set-context.mjs --phase plan --story 38 --child 41')
  const ctx2 = readContext()
  assert(ctx2?.story_issue === 38, 'set-context writes story_issue')
  assert(ctx2?.child_issue === 41, 'set-context writes child_issue')
} catch (error) {
  console.error('FAIL: set-context CLI', error.message)
  failed += 1
}

// Hook ledger via simulated stdin
try {
  if (existsSync(LEDGER_PATH)) unlinkSync(LEDGER_PATH)
  const payload = JSON.stringify({
    hook_event_name: 'sessionStart',
    conversation_id: 'hook-test-conv',
    session_id: 'hook-test-conv',
    transcript_path: null,
  })
  execSync('node .cursor/hooks/usage-session.mjs', {
    cwd: REPO_ROOT,
    input: payload,
    encoding: 'utf8',
  })
  const ledger = readLedger()
  assert(ledger.some((r) => r.conversation_id === 'hook-test-conv'), 'hook appends ledger row')
} catch (error) {
  console.error('FAIL: hook ledger', error.message)
  failed += 1
}

// register-session dry-run (needs gh)
try {
  run(
    'node scripts/usage/register-session.mjs --conversation-id test-dry-run --story 38 --child 41 --phase plan --dry-run',
  )
  console.log('ok: register-session dry-run exits cleanly')
} catch (error) {
  console.error('FAIL: register-session dry-run', error.message)
  failed += 1
}

if (failed > 0) {
  console.error(`\n${failed} test(s) failed`)
  process.exit(1)
}

console.log('\nAll usage tracking smoke tests passed')
