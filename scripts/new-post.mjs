#!/usr/bin/env node
/**
 * 새 블로그 글 생성기
 *
 *   npm run new
 *
 * 카테고리를 고르고 제목을 입력하면 content/ 아래에 frontmatter가 채워진
 * post-{번호}.md 파일을 만들어 준다. 번호는 기존 글 중 가장 큰 번호 + 1.
 */

import fs from 'fs'
import path from 'path'
import readline from 'readline/promises'
import { stdin, stdout } from 'process'

const CONTENT_DIR = path.join(process.cwd(), 'content')

/** content/{대분류}/{소분류} 형태의 폴더를 전부 찾는다. */
function findCategories() {
  const result = []
  for (const parent of fs.readdirSync(CONTENT_DIR, { withFileTypes: true })) {
    if (!parent.isDirectory()) continue
    const parentPath = path.join(CONTENT_DIR, parent.name)
    for (const child of fs.readdirSync(parentPath, { withFileTypes: true })) {
      if (!child.isDirectory()) continue
      result.push(`${parent.name}/${child.name}`)
    }
  }
  return result.sort()
}

/** 모든 post-NN.md 중 가장 큰 번호 + 1 */
function nextPostNumber(dir = CONTENT_DIR) {
  let max = 0
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      max = Math.max(max, nextPostNumber(full) - 1)
    } else {
      const m = entry.name.match(/^post-(\d+)\.md$/)
      if (m) max = Math.max(max, Number(m[1]))
    }
  }
  return max + 1
}

function today() {
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

function template({ title, date }) {
  return `---
title: "${title}"
date: "${date}"
description: ""
tags: []
---

여기에 도입부를 작성.

---

### 1. 첫 번째 섹션

내용.

---

### 2. 두 번째 섹션

내용.
`
}

const rl = readline.createInterface({ input: stdin, output: stdout })

try {
  const categories = findCategories()

  console.log('\n카테고리를 선택하세요:\n')
  categories.forEach((c, i) => console.log(`  ${String(i + 1).padStart(2)}. ${c}`))
  console.log('')

  const picked = await rl.question('번호 입력: ')
  const category = categories[Number(picked) - 1]
  if (!category) {
    console.error('\n잘못된 번호입니다. 중단합니다.')
    process.exit(1)
  }

  const title = (await rl.question('글 제목: ')).trim()
  if (!title) {
    console.error('\n제목이 비어 있습니다. 중단합니다.')
    process.exit(1)
  }

  const fileName = `post-${nextPostNumber()}.md`
  const filePath = path.join(CONTENT_DIR, category, fileName)

  if (fs.existsSync(filePath)) {
    console.error(`\n이미 존재하는 파일입니다: ${filePath}`)
    process.exit(1)
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, template({ title, date: today() }), 'utf-8')

  console.log(`\n생성 완료: content/${category}/${fileName}`)
  console.log('description 과 tags 는 직접 채워 넣으세요.\n')
} finally {
  rl.close()
}
