import Link from 'next/link'
import { getAllPostMetas, getAllTags } from '@/lib/posts'
import { CATEGORY_TREE } from '@/lib/categories'
import MiniRoom from '@/components/diary/MiniRoom'

export default function HomePage() {
  const posts = getAllPostMetas()
  const recent = posts.slice(0, 8)
  const tags = getAllTags().slice(0, 12)

  const counts = CATEGORY_TREE.flatMap(root => root.children ?? [])
    .filter(child => !child.hidden)
    .map(child => ({
      label: child.label.replace(/\s*\(.*\)$/, ''),
      href: `/category/${child.path.join('/')}`,
      count: posts.filter(p => p.categoryPath.join('/') === child.path.join('/')).length,
    }))

  return (
    <div className="diary-home">
      {/* Updated posts + counts */}
      <section className="diary-updated">
        <div className="diary-news">
          <h2 className="diary-section-title">Updated posts</h2>
          <ul className="diary-news-list">
            {recent.map(post => (
              <li key={post.slug.join('/')}>
                <Link href={`/posts/${post.slug.join('/')}`} className="diary-news-item">
                  <span className={`diary-badge is-${post.categoryPath[0]}`}>
                    {post.categoryPath[0]?.toUpperCase()}
                  </span>
                  <span className="diary-news-title">{post.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="diary-counts">
          {counts.map(c => (
            <Link key={c.href} href={c.href} className="diary-count">
              <span>{c.label}</span>
              <b>{c.count}</b>
            </Link>
          ))}
        </div>
      </section>

      {/* Mini room */}
      <section>
        <div className="diary-room-tabs">
          <b>Miniroom</b>
        </div>
        <div className="diary-room">
          <MiniRoom />
          <div className="tag-cloud">
            {tags.map(({ tag }) => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="tag-cloud-item">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
