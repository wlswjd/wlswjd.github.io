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

  // 하위 카테고리 버튼 줄: 상위 페이지면 자기 자식들, 하위 페이지면 형제들(현재 것은 선택 표시)
  const rowSource = category?.children?.length ? category : parentSlug ? getCategoryByPath(parentSlug) : undefined
  const subCategories = (rowSource?.children ?? []).filter(child => !child.hidden)

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

      {subCategories.length > 0 && (
        <div className="sub-categories">
          {subCategories.map(child => {
            const active = child.path.join('/') === slug.join('/')
            // 선택된 버튼을 다시 누르면 상위 카테고리(전체 보기)로 돌아간다
            const href = active && parentSlug ? `/category/${parentSlug.join('/')}` : `/category/${child.path.join('/')}`
            return (
              <Link
                key={child.id}
                href={href}
                className={`sub-cat-btn ${active ? 'is-active' : ''}`}
                aria-current={active ? 'page' : undefined}
                title={active ? '전체 보기로 돌아가기' : undefined}
              >
                {child.label}
              </Link>
            )
          })}
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
