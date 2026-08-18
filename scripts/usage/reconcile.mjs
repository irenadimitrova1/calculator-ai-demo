#!/usr/bin/env node
import { writeFileSync, unlinkSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseArgs } from 'node:util'
import {
  findChildIssues,
  formatTokenCount,
  formatUsd,
  ghJson,
  ghRun,
  loadEnvLocal,
  parseSessionMarkers,
  readContext,
  readLedger,
  resolveParentStory,
  estimateEventCostCents,
  storyHasCostReport,
  sumTokens,
} from './lib.mjs'

const { values } = parseArgs({
  options: {
    story: { type: 'string' },
    issue: { type: 'string' },
    post: { type: 'boolean', default: false },
    'dry-run': { type: 'boolean', default: false },
  },
  allowPositionals: false,
})

loadEnvLocal()

function collectRegistrySessions(storyNumber) {
  const issues = [storyNumber, ...findChildIssues(storyNumber).map((i) => i.number)]
  const sessions = []
  const seen = new Set()

  for (const issueNumber of issues) {
    const issue = ghJson(`issue view ${issueNumber} --json number,comments`)
    for (const comment of issue.comments ?? []) {
      for (const session of parseSessionMarkers(comment.body ?? '')) {
        if (seen.has(session.conversation_id)) continue
        seen.add(session.conversation_id)
        sessions.push({ ...session, registered_on: issueNumber })
      }
    }
  }

  return sessions
}

function mergeLocalLedger(sessions) {
  const byId = new Map(sessions.map((s) => [s.conversation_id, s]))
  const context = readContext()
  for (const row of readLedger()) {
    if (!row.conversation_id || byId.has(row.conversation_id)) continue
    byId.set(row.conversation_id, {
      conversation_id: row.conversation_id,
      story: row.story ?? context?.story_issue ?? null,
      child: row.child ?? row.issue ?? context?.child_issue ?? null,
      phase: row.phase ?? row.event ?? 'unknown',
      user_email: row.user_email ?? null,
      ts: row.ts ?? new Date().toISOString(),
      registered_on: row.issue ?? null,
      source: 'local-ledger',
    })
  }
  return [...byId.values()]
}

async function fetchUsageEvents(startDate, endDate) {
  const apiKey = process.env.CURSOR_ADMIN_API_KEY
  if (!apiKey) {
    throw new Error('CURSOR_ADMIN_API_KEY is not set (add to .env.local)')
  }

  const auth = Buffer.from(`${apiKey}:`).toString('base64')
  const events = []
  let page = 1
  let totalPages = 1

  while (page <= totalPages) {
    const response = await fetch('https://api.cursor.com/teams/filtered-usage-events', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startDate, endDate, page, pageSize: 1000 }),
    })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`Cursor Admin API error ${response.status}: ${text}`)
    }

    const data = await response.json()
    events.push(...(data.usageEvents ?? []))
    totalPages = data.totalPages ?? 1
    page += 1
  }

  return events
}

function buildReport(storyNumber, sessions, usageEvents) {
  const conversationIds = new Set(sessions.map((s) => s.conversation_id))
  const matchedEvents = usageEvents.filter((e) => conversationIds.has(e.conversationId))

  const sessionMeta = new Map(sessions.map((s) => [s.conversation_id, s]))
  const byGroup = new Map()
  const byContributor = new Map()

  for (const event of matchedEvents) {
    const meta = sessionMeta.get(event.conversationId) ?? {}
    const phase = meta.phase ?? 'unknown'
    const child = meta.child ?? null
    const contributor = event.userEmail ?? meta.user_email ?? 'unknown'
    const groupKey = `${phase}|${child ?? ''}|${contributor}`

    if (!byGroup.has(groupKey)) {
      byGroup.set(groupKey, {
        phase,
        child,
        contributor,
        sessions: new Set(),
        tokens: 0,
        cents: 0,
        estCents: 0,
      })
    }
    const group = byGroup.get(groupKey)
    group.sessions.add(event.conversationId)
    group.tokens += sumTokens(event.tokenUsage)
    group.cents += event.chargedCents ?? 0
    group.estCents += estimateEventCostCents(event)

    if (!byContributor.has(contributor)) {
      byContributor.set(contributor, { tokens: 0, cents: 0, estCents: 0 })
    }
    const contrib = byContributor.get(contributor)
    contrib.tokens += sumTokens(event.tokenUsage)
    contrib.cents += event.chargedCents ?? 0
    contrib.estCents += estimateEventCostCents(event)
  }

  const rows = [...byGroup.values()].sort((a, b) => {
    if (a.phase !== b.phase) return a.phase.localeCompare(b.phase)
    return (a.child ?? 0) - (b.child ?? 0)
  })

  const totalSessions = new Set(matchedEvents.map((e) => e.conversationId)).size
  const totalTokens = rows.reduce((sum, r) => sum + r.tokens, 0)
  const totalCents = rows.reduce((sum, r) => sum + r.cents, 0)
  const totalEstCents = rows.reduce((sum, r) => sum + r.estCents, 0)

  const childNumbers = findChildIssues(storyNumber)
    .map((i) => i.number)
    .sort((a, b) => a - b)
  const childRange =
    childNumbers.length > 0
      ? `#${childNumbers[0]}–#${childNumbers[childNumbers.length - 1]}`
      : 'none'

  let markdown = '## AI implementation cost\n\n'
  markdown += '| Phase | Issue | Contributor | Sessions | Tokens | Est. cost (USD) | Cost (USD) |\n'
  markdown += '|-------|-------|-------------|----------|--------|-----------------|------------|\n'

  for (const row of rows) {
    const issueLabel = row.child ? `#${row.child}` : '—'
    markdown += `| ${row.phase} | ${issueLabel} | ${row.contributor} | ${row.sessions.size} | ${formatTokenCount(row.tokens)} | ${formatUsd(row.estCents)} | ${formatUsd(row.cents)} |\n`
  }

  markdown += `| **Story total** | **#${storyNumber}** | | **${totalSessions}** | **${formatTokenCount(totalTokens)}** | **${formatUsd(totalEstCents)}** | **${formatUsd(totalCents)}** |\n\n`
  markdown += '### Per-contributor subtotals\n\n'
  markdown += '| Contributor | Tokens | Est. cost (USD) | Cost (USD) |\n'
  markdown += '|-------------|--------|-----------------|------------|\n'

  for (const [contributor, totals] of [...byContributor.entries()].sort((a, b) =>
    a[0].localeCompare(b[0]),
  )) {
    markdown += `| ${contributor} | ${formatTokenCount(totals.tokens)} | ${formatUsd(totals.estCents)} | ${formatUsd(totals.cents)} |\n`
  }

  const reconciledAt = new Date().toISOString()
  markdown += `\n_Reconciled from Cursor Admin API at ${reconciledAt}. Registry: story #${storyNumber} + children ${childRange}. Subagent tokens included. Est. cost = tokenUsage.totalCents + Cursor Token Rate; Cost = billed chargedCents._\n`

  const latestSessionTs = sessions.reduce((max, s) => {
    const ts = Date.parse(s.ts ?? '')
    return Number.isFinite(ts) && ts > max ? ts : max
  }, 0)
  const hourAgo = Date.now() - 60 * 60 * 1000
  const incomplete = latestSessionTs > hourAgo

  return {
    story: storyNumber,
    sessionsRegistered: sessions.length,
    sessionsMatched: totalSessions,
    totalTokens,
    totalCents,
    totalEstCents,
    incomplete,
    markdown,
  }
}

function resolveStoryNumber() {
  if (values.story) return Number.parseInt(values.story, 10)
  if (!values.issue) return null
  return resolveParentStory(Number.parseInt(values.issue, 10))
}

async function main() {
  const storyNumber = resolveStoryNumber()
  if (!storyNumber) {
    console.error('reconcile: pass --story <N> or --issue <N>')
    process.exit(1)
  }

  let sessions = collectRegistrySessions(storyNumber)
  sessions = mergeLocalLedger(sessions)

  if (sessions.length === 0) {
    console.error(`reconcile: no registered sessions found for story #${storyNumber}`)
    process.exit(1)
  }

  const timestamps = sessions
    .map((s) => Date.parse(s.ts ?? ''))
    .filter((t) => Number.isFinite(t))
  const startDate = Math.min(...timestamps, Date.now()) - 24 * 60 * 60 * 1000
  const endDate = Date.now() + 60 * 60 * 1000

  const usageEvents = await fetchUsageEvents(startDate, endDate)
  const report = buildReport(storyNumber, sessions, usageEvents)

  if (report.incomplete) {
    console.warn('Warning: some sessions ended within the last hour — totals may be incomplete.')
  }

  if (values['dry-run'] || !values.post) {
    console.log(report.markdown)
    console.log(JSON.stringify(report, null, 2))
    return
  }

  if (storyHasCostReport(storyNumber)) {
    console.log(`reconcile: story #${storyNumber} already has a cost roll-up comment — skipping post`)
    console.log(report.markdown)
    return
  }

  const tmp = join(tmpdir(), `cursor-usage-rollup-${storyNumber}.md`)
  writeFileSync(tmp, report.markdown, 'utf8')
  try {
    ghRun(`issue comment ${storyNumber} --body-file "${tmp}"`)
    try {
      ghRun(`issue edit ${storyNumber} --add-label cost-reported`)
    } catch {
      try {
        ghRun('label create cost-reported --description "AI usage cost roll-up posted" --color BFD4F2')
      } catch {
        // label may already exist
      }
      ghRun(`issue edit ${storyNumber} --add-label cost-reported`)
    }
  } finally {
    try {
      unlinkSync(tmp)
    } catch {
      // ignore
    }
  }

  console.log(`reconcile: posted roll-up to story #${storyNumber}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
