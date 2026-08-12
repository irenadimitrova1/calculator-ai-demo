#!/usr/bin/env node
import { parseArgs } from 'node:util'
import { readContext, writeContext } from './lib.mjs'

const { values } = parseArgs({
  options: {
    phase: { type: 'string' },
    story: { type: 'string' },
    child: { type: 'string' },
    'feature-doc': { type: 'string' },
    'conversation-id': { type: 'string' },
  },
  allowPositionals: false,
})

const existing = readContext() ?? {}
const story = values.story ? Number.parseInt(values.story, 10) : existing.story_issue ?? null
const childRaw = values.child
const child =
  childRaw === 'null' || childRaw === ''
    ? null
    : childRaw
      ? Number.parseInt(childRaw, 10)
      : existing.child_issue ?? null

const context = {
  feature_doc: values['feature-doc'] ?? existing.feature_doc ?? null,
  story_issue: story,
  phase: values.phase ?? existing.phase ?? null,
  child_issue: child,
  conversation_id: values['conversation-id'] ?? existing.conversation_id ?? null,
  updated_at: new Date().toISOString(),
}

writeContext(context)
console.log(JSON.stringify(context, null, 2))
