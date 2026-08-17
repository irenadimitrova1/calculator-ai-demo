#!/usr/bin/env node
/**
 * CI entry — post AI cost roll-up when a story's implementation children are all closed.
 * Invoked by GitHub Actions on PR merge or daily schedule (API lag retry).
 */
import { spawnSync } from 'node:child_process'
import { parseArgs } from 'node:util'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import {
  allImplementationChildrenClosed,
  ghJson,
  REPO_ROOT,
  resolveParentStory,
  storyHasCostReport,
} from './lib.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))

const { values } = parseArgs({
  options: {
    issues: { type: 'string' },
    story: { type: 'string' },
    'scan-stories': { type: 'boolean', default: false },
  },
  allowPositionals: false,
})

function runReconcile(storyNumber) {
  const script = join(__dirname, 'reconcile.mjs')
  const result = spawnSync(process.execPath, [script, '--story', String(storyNumber), '--post'], {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: 'inherit',
  })
  if (result.status !== 0) {
    process.exit(result.status ?? 1)
  }
}

function storiesReadyForRollup() {
  const stories = ghJson('issue list --label story --state all --limit 100 --json number,labels')
  return stories
    .map((s) => s.number)
    .filter((storyNumber) => {
      if (storyHasCostReport(storyNumber)) return false
      return allImplementationChildrenClosed(storyNumber)
    })
}

function storiesFromClosedIssues(issueNumbers) {
  const storySet = new Set()
  for (const issueNumber of issueNumbers) {
    const story = resolveParentStory(issueNumber)
    if (story) storySet.add(story)
  }
  return [...storySet]
}

function parseIssueList(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      return parsed.map((n) => Number.parseInt(String(n), 10)).filter((n) => Number.isFinite(n))
    }
  } catch {
    // fall through
  }
  return raw
    .split(/[,\s]+/)
    .map((n) => Number.parseInt(n, 10))
    .filter((n) => Number.isFinite(n))
}

function main() {
  let storyNumbers = []

  if (values['scan-stories']) {
    storyNumbers = storiesReadyForRollup()
    console.log(`scan-stories: found ${storyNumbers.length} story(ies) ready for roll-up`)
  } else if (values.story) {
    storyNumbers = [Number.parseInt(values.story, 10)]
  } else if (values.issues) {
    const closedIssues = parseIssueList(values.issues)
    storyNumbers = storiesFromClosedIssues(closedIssues)
    console.log(`closed issues ${closedIssues.join(', ')} → stories ${storyNumbers.join(', ')}`)
  } else if (process.env.CLOSED_ISSUE_NUMBERS) {
    const closedIssues = parseIssueList(process.env.CLOSED_ISSUE_NUMBERS)
    storyNumbers = storiesFromClosedIssues(closedIssues)
  } else {
    console.error('reconcile-on-merge: pass --issues, --story, or --scan-stories')
    process.exit(1)
  }

  const posted = []
  for (const storyNumber of storyNumbers) {
    if (!Number.isFinite(storyNumber)) continue

    if (storyHasCostReport(storyNumber)) {
      console.log(`story #${storyNumber}: cost roll-up already posted — skip`)
      continue
    }

    if (!allImplementationChildrenClosed(storyNumber)) {
      console.log(`story #${storyNumber}: implementation children not all closed — skip`)
      continue
    }

    console.log(`story #${storyNumber}: all children closed — posting roll-up`)
    runReconcile(storyNumber)
    posted.push(storyNumber)
  }

  if (posted.length === 0) {
    console.log('reconcile-on-merge: nothing to post')
  } else {
    console.log(`reconcile-on-merge: posted roll-up for story(s) ${posted.join(', ')}`)
  }
}

main()
