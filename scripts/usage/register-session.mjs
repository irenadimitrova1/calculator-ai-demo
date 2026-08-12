#!/usr/bin/env node
import { writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  formatSessionComment,
  ghJson,
  ghRun,
  parseSessionMarkers,
  readContext,
} from './lib.mjs'

const { values } = parseArgs({
  options: {
    'conversation-id': { type: 'string' },
    story: { type: 'string' },
    child: { type: 'string' },
    phase: { type: 'string' },
    'user-email': { type: 'string' },
    'dry-run': { type: 'boolean', default: false },
  },
  allowPositionals: false,
})

function resolveUserEmail(explicit) {
  if (explicit) return explicit
  try {
    const viewer = ghJson('api user')
    return viewer?.email ?? viewer?.login ?? null
  } catch {
    return null
  }
}

function issueHasConversation(issueNumber, conversationId) {
  const comments = ghJson(`issue view ${issueNumber} --json comments --jq .comments`)
  for (const comment of comments ?? []) {
    for (const session of parseSessionMarkers(comment.body ?? '')) {
      if (session.conversation_id === conversationId) return true
    }
  }
  return false
}

function postComment(issueNumber, body) {
  const tmp = join(tmpdir(), `cursor-usage-${issueNumber}-${Date.now()}.md`)
  writeFileSync(tmp, body, 'utf8')
  try {
    ghRun(`issue comment ${issueNumber} --body-file "${tmp}"`)
  } finally {
    try {
      unlinkSync(tmp)
    } catch {
      // ignore cleanup errors
    }
  }
}

async function main() {
  const context = readContext()
  const conversationId = values['conversation-id'] ?? context?.conversation_id
  if (!conversationId) {
    console.error('register-session: missing conversation_id (pass --conversation-id or set context)')
    process.exit(1)
  }

  const story = values.story
    ? Number.parseInt(values.story, 10)
    : context?.story_issue ?? null
  const child = values.child
    ? Number.parseInt(values.child, 10)
    : context?.child_issue ?? null
  const phase = values.phase ?? context?.phase ?? 'unknown'

  if (!story) {
    console.error('register-session: missing story issue (pass --story or set context.story_issue)')
    process.exit(1)
  }

  const targetIssue = child ?? story
  if (!values['dry-run'] && issueHasConversation(targetIssue, conversationId)) {
    console.log(`register-session: conversation ${conversationId} already registered on #${targetIssue}`)
    return
  }

  const session = {
    conversation_id: conversationId,
    story,
    child: child ?? null,
    phase,
    user_email: resolveUserEmail(values['user-email']),
    ts: new Date().toISOString(),
  }

  const body = formatSessionComment(session)
  if (values['dry-run']) {
    console.log(`Would register on #${targetIssue}:\n${body}`)
    return
  }

  postComment(targetIssue, body)
  console.log(`register-session: registered ${conversationId} on #${targetIssue}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
