import { getAllPostMetas } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export default function HomePage() {
  const posts = getAllPostMetas().slice(0, 8)

  return (
    <div>
      <div className="home-hero">
        <div className="nes-container hero-box">
          <span className="hero-greeting">Hello, World!</span>
          <h1 className="hero-title">
            Welcome to <span>DEVLOG_</span>
          </h1>
          <p className="hero-desc">
            공부 기록, 프로젝트 회고, 논문 리뷰를 모아두는 개인 공간입니다.
          </p>
        </div>
      </div>

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
