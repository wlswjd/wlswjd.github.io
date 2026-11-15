import Link from 'next/link'
import { getAllPostMetas, getAllTags } from '@/lib/posts'
import MiniRoom from '@/components/diary/MiniRoom'
import NowPlaying from '@/components/diary/NowPlaying'

export default function HomePage() {
  const posts = getAllPostMetas()
  const recent = posts.slice(0, 8)
  const tags = getAllTags().slice(0, 12)

  return (
    <div className="diary-home">
      {/* Updated posts + now playing */}
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

        <NowPlaying />
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
