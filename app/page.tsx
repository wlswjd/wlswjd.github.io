import { getAllPostMetas } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function HomePage() {
  const posts = getAllPostMetas().slice(0, 8)

  return (
    <div>
      <h2 className="section-title">
        <span className="nes-icon is-small star"></span>
        RECENT POSTS
      </h2>

      {posts.length === 0 ? (
        <div className="empty-state">
          <p>아직 작성된 포스트가 없습니다.</p>
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
