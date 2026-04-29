import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { PostMeta } from '@/lib/posts'
import { getCategoryLabel } from '@/lib/categories'

interface Props {
  post: PostMeta
  showCategory?: boolean
}

export default function PostCard({ post, showCategory = false }: Props) {
  const href = `/posts/${post.slug.join('/')}`
  const dateStr = post.date
    ? format(new Date(post.date), 'yyyy.MM.dd', { locale: ko })
    : ''

  return (
    <div className="nes-container post-card">
      <div className="post-card-inner">
        <div className="post-card-meta">
          {showCategory && post.categoryPath.length > 0 && (
            <span className="post-category-badge">
              {getCategoryLabel(post.categoryPath)}
            </span>
          )}
          {dateStr && <span className="post-date">{dateStr}</span>}
        </div>

        <Link href={href} className="post-card-title-link">
          <h2 className="post-card-title">{post.title}</h2>
        </Link>

        {post.description && (
          <p className="post-card-desc">{post.description}</p>
        )}

        {post.tags.length > 0 && (
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="nes-badge">
                <span className="is-primary tag-text">{tag}</span>
              </span>
            ))}
          </div>
        )}

        <div className="post-card-footer">
          <Link href={href} className="nes-btn is-small read-more-btn">
            READ MORE
          </Link>
        </div>
      </div>
    </div>
  )
}
