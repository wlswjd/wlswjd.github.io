import Link from 'next/link'
import { getAllPostMetas } from '@/lib/posts'
import MiniRoom from '@/components/diary/MiniRoom'
import NowPlaying from '@/components/diary/NowPlaying'

export default function HomePage() {
  const posts = getAllPostMetas()
  const recent = posts.slice(0, 6)

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
      <section className="diary-miniroom">
        <div className="diary-room-tabs">
          <b>Miniroom</b>
        </div>
        <div className="diary-room">
          <MiniRoom />
        </div>
      </section>
    </div>
  )
}
