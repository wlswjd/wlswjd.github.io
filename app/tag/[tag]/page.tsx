import { getAllTags, getPostsByTag } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ tag: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${decodeURIComponent(tag)}` }
}

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: encodeURIComponent(tag) }))
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const posts = getPostsByTag(decoded)

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">HOME</Link>
        <span className="breadcrumb-sep">&gt;</span>
        <span>#{decoded}</span>
      </div>

      <h2 className="section-title">
        <span className="nes-icon is-small star"></span>
        #{decoded}
        <span className="section-subtitle">({posts.length})</span>
      </h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>해당 태그의 포스트가 없습니다.</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <PostCard key={post.slug.join('/')} post={post} showCategory />
          ))}
        </div>
      )}
    </div>
  )
}
