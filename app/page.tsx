import Link from 'next/link'
import { getAllPostMetas, getAllTags } from '@/lib/posts'
import { CATEGORY_TREE } from '@/lib/categories'

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

      {/* Mini room → 잔디밭 */}
      <section>
        <div className="diary-room-tabs">
          <b>잔디밭</b> | 태그
        </div>
        <div className="diary-room">
          <img
            className="github-chart"
            src="https://ghchart.rshah.org/209cee/wlswjd"
            alt="GitHub 기여 그래프"
          />
          <div className="tag-cloud">
            {tags.map(({ tag }) => (
              <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} className="tag-cloud-item">
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Guestbook (prototype placeholder) */}
      <section>
        <h2 className="diary-section-title">방명록 한 줄</h2>
        <div className="diary-guestbook">
          <label htmlFor="guestbook" className="visually-hidden">방명록 남기기</label>
          <input
            id="guestbook"
            className="nes-input"
            type="text"
            placeholder="준비 중이에요 (GitHub 로그인 방명록 예정)"
            disabled
          />
          <button type="button" className="nes-btn is-disabled" disabled>
            남기기
          </button>
        </div>
      </section>
    </div>
  )
}
