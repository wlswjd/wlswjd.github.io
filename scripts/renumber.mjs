#!/usr/bin/env node
/**
 * 모든 글의 파일명을 작성일(date) 오름차순 기준으로 post-1.md ... post-N.md 로 재정렬.
 *
 *   node scripts/renumber.mjs --dry   (미리보기만)
 *   node scripts/renumber.mjs         (실제 변경)
 *
 * 날짜가 같으면 기존 파일명을 보조 기준으로 써서 상대 순서를 유지한다.
 * 이름 충돌을 피하기 위해 임시 파일명을 거쳐 2단계로 변경한다.
 */

import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const DRY_RUN = process.argv.includes('--dry')

function walk(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) out.push(...walk(full))
    else if (entry.name.endsWith('.md')) out.push(full)
  }
  return out
}

function readDate(filePath) {
  const text = fs.readFileSync(filePath, 'utf-8')
  const m = text.match(/^date:\s*"?([^"\n]+)"?/m)
  return m ? m[1].trim() : ''
}

/** 날짜가 같을 때 쓸 보조 정렬키: 기존 post-NN 번호, 없으면 매우 큰 수 */
function legacyNumber(filePath) {
  const m = path.basename(filePath).match(/^post-(\d+)\.md$/)
  return m ? Number(m[1]) : Number.MAX_SAFE_INTEGER
}

const files = walk(CONTENT_DIR)

const missingDate = files.filter(f => !readDate(f))
if (missingDate.length > 0) {
  console.error('date 값이 없는 파일이 있어 중단합니다:')
  missingDate.forEach(f => console.error('  ' + path.relative(process.cwd(), f)))
  process.exit(1)
}

const ordered = files.sort((a, b) => {
  const d = readDate(a).localeCompare(readDate(b))
  if (d !== 0) return d
  const n = legacyNumber(a) - legacyNumber(b)
  if (n !== 0) return n
  return a.localeCompare(b)
})

const plan = ordered.map((from, i) => ({
  from,
  to: path.join(path.dirname(from), `post-${i + 1}.md`),
  date: readDate(from),
}))

const changed = plan.filter(p => p.from !== p.to)

console.log(`총 ${plan.length}개 중 ${changed.length}개 이름 변경\n`)
for (const p of plan) {
  const mark = p.from === p.to ? '  ' : '→ '
  console.log(
    `${mark}${p.date}  ${path.relative(CONTENT_DIR, p.from)}` +
      (p.from === p.to ? '' : `  ⇒  ${path.basename(p.to)}`)
  )
}

if (DRY_RUN) {
  console.log('\n[미리보기] 실제로는 아무것도 변경하지 않았습니다.')
  process.exit(0)
}

// 1단계: 전부 임시 이름으로 (기존 파일명과 충돌 방지)
const temps = plan.map((p, i) => {
  const tmp = path.join(path.dirname(p.from), `__renumber_tmp_${i}.md`)
  fs.renameSync(p.from, tmp)
  return { tmp, to: p.to }
})

// 2단계: 최종 이름으로
for (const t of temps) {
  fs.renameSync(t.tmp, t.to)
}

console.log('\n재정렬 완료.')
