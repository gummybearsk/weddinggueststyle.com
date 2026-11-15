#!/usr/bin/env node
/**
 * Prebuild gate: nothing visible may render inside <head>.
 *
 *   node scripts/check-head-markup.mjs [projectDir]
 *   node check-head-markup.mjs --fleet "<folder of projects>"
 *
 * WHY (2026-11-07, energypips.com): the root layout rendered <Analytics /> inside
 * <head>. Analytics also rendered the EEA/UK cookie banner, so the banner's <div>
 * and its Accept button ended up under <head>, which browsers never display. UK
 * and EU visitors could not accept, GA never loaded for them, and for two months
 * GA showed 0 UK/IE/NL Google sessions against 39 GSC clicks. The build, the
 * types and every HTTP check passed; only a London-timezone browser showed it.
 *
 * What it checks, in every App Router layout/page/template under app/ or src/app:
 *   - inside a literal <head>…</head>, lowercase tags must be head elements
 *     (meta, link, script, style, title, base, noscript);
 *   - every Capitalized component there is resolved through its import and
 *     scanned (3 levels deep). It passes only if it renders head-safe output:
 *     next/script <Script>, head tags, or JSON-LD. Anything that renders a div,
 *     button, banner etc. FAILS. A component that cannot be resolved also FAILS,
 *     unless the line above it carries `head-check: allow <Name> — <reason>`.
 */
import fs from 'node:fs'
import path from 'node:path'

const HEAD_TAGS = new Set(['meta', 'link', 'script', 'style', 'title', 'base', 'noscript'])
const SAFE_COMPONENTS = new Set(['Script', 'Fragment', 'React.Fragment'])
const VISIBLE = /<(div|button|section|aside|dialog|form|p|span|a|nav|footer|header|main|ul|ol|li|img|h[1-6]|label|input|iframe|svg)[\s>/]/

function stripComments(s) {
  return s.replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

function resolveImport(fromFile, name, root) {
  const src = fs.readFileSync(fromFile, 'utf8')
  const re = new RegExp(`import\\s+(?:\\{[^}]*\\b${name}\\b[^}]*\\}|${name})(?:\\s*,\\s*\\{[^}]*\\})?\\s+from\\s+['"]([^'"]+)['"]`)
  const m = src.match(re)
  if (!m) return null
  let spec = m[1]
  if (!spec.startsWith('.') && !spec.startsWith('@/') && !spec.startsWith('~/')) return { pkg: spec }
  let base
  if (spec.startsWith('@/') || spec.startsWith('~/')) {
    const rel = spec.slice(2)
    base = fs.existsSync(path.join(root, 'src')) && !fs.existsSync(path.join(root, rel.split('/')[0]))
      ? path.join(root, 'src', rel) : path.join(root, rel)
    if (!candidates(base).some(fs.existsSync)) base = path.join(root, 'src', rel)
  } else base = path.resolve(path.dirname(fromFile), spec)
  return { file: candidates(base).find(fs.existsSync) ?? null }
}
const candidates = (b) => [b, ...['.tsx', '.ts', '.jsx', '.js'].map((e) => b + e), ...['.tsx', '.ts', '.jsx', '.js'].map((e) => path.join(b, 'index' + e))]

/** returns null if head-safe, else a reason string */
function componentProblem(file, name, root, depth = 0) {
  if (SAFE_COMPONENTS.has(name) || /(Schema|JsonLd|JSONLD|StructuredData)$/.test(name)) return null
  const r = resolveImport(file, name, root)
  if (!r) return `cannot resolve import of <${name}>`
  if (r.pkg) return r.pkg === 'next/script' ? null : `<${name}> comes from package "${r.pkg}" — cannot verify it renders head-safe markup`
  if (!r.file) return `import of <${name}> points at a missing file`
  const body = stripComments(fs.readFileSync(r.file, 'utf8'))
  const vis = body.match(VISIBLE)
  if (vis) return `<${name}> (${path.relative(root, r.file)}) renders <${vis[1]}>, which is invisible inside <head>`
  if (depth >= 3) return null
  for (const m of body.matchAll(/<([A-Z][\w.]*)[\s>/]/g)) {
    const p = componentProblem(r.file, m[1], root, depth + 1)
    if (p) return `<${name}> → ${p}`
  }
  return null
}

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.')) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, out)
    else if (/^(layout|page|template)\.(tsx|jsx|js)$/.test(e.name)) out.push(p)
  }
  return out
}

export function checkProject(root) {
  const files = [...walk(path.join(root, 'app')), ...walk(path.join(root, 'src', 'app'))]
  const fails = []
  for (const f of files) {
    const raw = fs.readFileSync(f, 'utf8')
    const src = stripComments(raw)
    for (const m of src.matchAll(/<head>([\s\S]*?)<\/head>/g)) {
      for (const t of m[1].matchAll(/<([A-Za-z][\w.]*)[\s>/]/g)) {
        const name = t[1]
        if (/^[a-z]/.test(name)) {
          if (!HEAD_TAGS.has(name)) fails.push(`${path.relative(root, f)}: <${name}> inside <head> is never displayed`)
          continue
        }
        if (new RegExp(`head-check:\\s*allow\\s+${name}\\b`).test(raw)) continue
        const p = componentProblem(f, name, root)
        if (p) fails.push(`${path.relative(root, f)}: ${p}`)
      }
    }
  }
  return fails
}

const args = process.argv.slice(2)
if (args[0] === '--fleet') {
  const folder = path.resolve(args[1] ?? '.')
  let bad = 0
  for (const d of fs.readdirSync(folder, { withFileTypes: true })) {
    if (!d.isDirectory()) continue
    const root = path.join(folder, d.name)
    if (!fs.existsSync(path.join(root, 'package.json'))) continue
    const f = checkProject(root)
    if (f.length) bad++
    console.log(`${f.length ? 'FAIL' : 'PASS'}  ${d.name}${f.length ? '\n      ' + f.join('\n      ') : ''}`)
  }
  process.exit(bad ? 1 : 0)
} else {
  const root = path.resolve(args[0] ?? '.')
  const fails = checkProject(root)
  if (fails.length) {
    console.error('check-head-markup: FAIL — visible UI would render inside <head> (browsers hide it):')
    for (const f of fails) console.error('  ' + f)
    console.error('fix: move the component into <body> (end of body for analytics/consent). If it truly renders only <script>/<meta>, add `{/* head-check: allow <Name> — reason */}` above it.')
    process.exit(1)
  }
  console.log('check-head-markup: PASS — nothing visible renders inside <head>.')
}
