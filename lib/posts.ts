import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkGfm from 'remark-gfm'
import remarkHtml from 'remark-html'

const CONTENT_DIR = path.join(process.cwd(), 'content')

export interface PostMeta {
  title: string
  date: string
  description: string
  tags: string[]
  slug: string[]
  categoryPath: string[]
}

export interface Post extends PostMeta {
  contentHtml: string
}

function walkDir(dir: string): string[] {
  const results: string[] = []
  if (!fs.existsSync(dir)) return results
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...walkDir(fullPath))
    } else if (entry.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

function parsePostMeta(filePath: string): PostMeta {
  const rel = path.relative(CONTENT_DIR, filePath)
  const parts = rel.replace(/\.md$/, '').split(path.sep)
  const { data } = matter(fs.readFileSync(filePath, 'utf-8'))
  return {
    title: data.title ?? parts[parts.length - 1],
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    slug: parts,
    categoryPath: parts.slice(0, -1),
  }
}

export function getAllPostMetas(): PostMeta[] {
  return walkDir(CONTENT_DIR)
    .map(parsePostMeta)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function getPostMetasByCategory(categoryPath: string[]): PostMeta[] {
  const prefix = categoryPath.join('/')
  return getAllPostMetas().filter(p => p.categoryPath.join('/').startsWith(prefix))
}

export async function getPostBySlug(slug: string[]): Promise<Post | null> {
  const filePath = path.join(CONTENT_DIR, ...slug) + '.md'
  if (!fs.existsSync(filePath)) return null

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content)

  const parts = slug
  return {
    title: data.title ?? parts[parts.length - 1],
    date: data.date ?? '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    slug: parts,
    categoryPath: parts.slice(0, -1),
    contentHtml: processed.toString(),
  }
}

export function getAllPostSlugs(): string[][] {
  return walkDir(CONTENT_DIR).map(filePath => {
    const rel = path.relative(CONTENT_DIR, filePath)
    return rel.replace(/\.md$/, '').split(path.sep)
  })
}

export function getAllTags(): { tag: string; count: number }[] {
  const tagMap = new Map<string, number>()
  for (const post of getAllPostMetas()) {
    for (const tag of post.tags) {
      tagMap.set(tag, (tagMap.get(tag) ?? 0) + 1)
    }
  }
  return Array.from(tagMap.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
}

export function getPostsByTag(tag: string): PostMeta[] {
  return getAllPostMetas().filter(p => p.tags.includes(tag))
}
