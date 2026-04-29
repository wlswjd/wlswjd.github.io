import { getPostBySlug, getAllPostSlugs } from '@/lib/posts'
import { getCategoryLabel } from '@/lib/categories'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export async function generateStaticParams() {
  return getAllPostSlugs().map(slug => ({ slug }))
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const dateStr = post.date
    ? format(new Date(post.date), 'yyyy년 MM월 dd일', { locale: ko })
    : ''

  const categoryHref = `/category/${post.categoryPath.join('/')}`
  const categoryLabel = getCategoryLabel(post.categoryPath)

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">HOME</Link>
        <span className="breadcrumb-sep">&gt;</span>
        <Link href={categoryHref}>{categoryLabel}</Link>
        <span className="breadcrumb-sep">&gt;</span>
        <span>{post.title}</span>
      </div>

      <div className="nes-container post-detail">
        <div className="post-detail-header">
          <h1 className="post-detail-title">{post.title}</h1>
          <div className="post-detail-meta">
            <Link href={categoryHref} className="post-category-badge">
              {categoryLabel}
            </Link>
            {dateStr && <span className="post-detail-date">{dateStr}</span>}
          </div>
          {post.tags.length > 0 && (
            <div className="post-tags" style={{ marginTop: '12px' }}>
              {post.tags.map(tag => (
                <span key={tag} className="nes-badge">
                  <span className="is-primary tag-text">{tag}</span>
                </span>
              ))}
            </div>
          )}
        </div>

        <article
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="post-nav">
          <Link href={categoryHref} className="nes-btn">
            ← 목록으로
          </Link>
          <Link href="/" className="nes-btn is-primary">
            HOME
          </Link>
        </div>
      </div>
    </div>
  )
}
