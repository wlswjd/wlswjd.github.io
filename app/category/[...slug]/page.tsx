import { getPostMetasByCategory } from '@/lib/posts'
import { getCategoryByPath, getCategoryLabel, CATEGORY_TREE } from '@/lib/categories'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const label = getCategoryLabel(slug)
  return { title: label }
}

export async function generateStaticParams() {
  const paths: { slug: string[] }[] = []
  for (const root of CATEGORY_TREE) {
    paths.push({ slug: root.path })
    for (const child of root.children ?? []) {
      paths.push({ slug: child.path })
    }
  }
  return paths
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const posts = getPostMetasByCategory(slug)
  const category = getCategoryByPath(slug)
  const label = category?.label ?? slug[slug.length - 1]

  const parentSlug = slug.length > 1 ? slug.slice(0, -1) : null
  const parentLabel = parentSlug ? getCategoryLabel(parentSlug) : null

  return (
    <div>
      <div className="breadcrumb">
        <Link href="/">HOME</Link>
        <span className="breadcrumb-sep">&gt;</span>
        {parentSlug && parentLabel && (
          <>
            <Link href={`/category/${parentSlug.join('/')}`}>{parentLabel}</Link>
            <span className="breadcrumb-sep">&gt;</span>
          </>
        )}
        <span>{label}</span>
      </div>

      <h2 className="section-title">
        <span className="nes-icon is-small star"></span>
        {label}
        <span className="section-subtitle">({posts.length})</span>
      </h2>

      {category?.children && category.children.length > 0 && (
        <div className="sub-categories">
          {category.children.map(child => (
            <Link
              key={child.id}
              href={`/category/${child.path.join('/')}`}
              className="nes-btn sub-cat-btn"
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>아직 작성된 포스트가 없습니다.</p>
          <p className="nes-text is-disabled">Coming soon...</p>
        </div>
      ) : (
        <div className="posts-list">
          {posts.map(post => (
            <PostCard key={post.slug.join('/')} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
