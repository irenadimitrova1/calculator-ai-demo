#!/usr/bin/env node
/**
 * Cursor hook handler — logs sessions locally and registers on GitHub when context exists.
 */
import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  appendLedger,
  getGitBranch,
  inferIssueFromBranch,
  nowIso,
  readContext,
  writeContext,
} from '../../scripts/usage/lib.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(__dirname, '..', '..')

function fireAndForgetRegister(conversationId, context) {
  if (!context?.story_issue) return
  const script = join(REPO_ROOT, 'scripts', 'usage', 'register-session.mjs')
  const args = [
    script,
    '--conversation-id',
    conversationId,
    '--story',
    String(context.story_issue),
    '--phase',
    context.phase ?? 'unknown',
  ]
  if (context.child_issue) {
    args.push('--child', String(context.child_issue))
  }
  const child = spawn(process.execPath, args, {
    cwd: REPO_ROOT,
    detached: true,
    stdio: 'ignore',
  })
  child.unref()
}

async function readStdinJson() {
  const rl = createInterface({ input: process.stdin })
  const lines = []
  for await (const line of rl) lines.push(line)
  if (lines.length === 0) return {}
  try {
    return JSON.parse(lines.join('\n'))
  } catch {
    return {}
  }
}

async function main() {
  const input = await readStdinJson()
  const event = input.hook_event_name ?? 'unknown'
  const conversationId = input.conversation_id ?? input.session_id ?? null
  const branch = getGitBranch()
  const issueFromBranch = inferIssueFromBranch(branch)
  let context = readContext()

  if (event === 'sessionStart' && conversationId && context) {
    context = { ...context, conversation_id: conversationId, updated_at: nowIso() }
    writeContext(context)
  }

  if (conversationId && context?.story_issue) {
    fireAndForgetRegister(conversationId, context)
  }

  appendLedger({
    conversation_id: conversationId,
    event,
    ts: nowIso(),
    branch,
    issue: context?.child_issue ?? issueFromBranch ?? context?.story_issue ?? null,
    story: context?.story_issue ?? null,
    child: context?.child_issue ?? issueFromBranch ?? null,
    phase: context?.phase ?? null,
    transcript_path: input.transcript_path ?? null,
    user_email: input.user_email ?? null,
    status: input.status ?? input.reason ?? null,
    loop_count: input.loop_count ?? null,
  })

  process.stdout.write('{}\n')
}

main().catch((error) => {
  console.error('[usage-session hook]', error.message)
  process.stdout.write('{}\n')
  process.exit(0)
})
