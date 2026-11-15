import Link from 'next/link'
import { getAllPostMetas } from '@/lib/posts'
import { CATEGORY_TREE } from '@/lib/categories'
import ThemeToggle from '@/components/ThemeToggle'
import DiaryTabs from './DiaryTabs'
import DiaryMain from './DiaryMain'
import MiniGrass from './MiniGrass'

function Rings() {
  return (
    <div className="diary-rings" aria-hidden="true">
      <div><span /><span /></div>
      <div><span /><span /></div>
    </div>
  )
}

export default function DiaryFrame({ children }: { children: React.ReactNode }) {
  const posts = getAllPostMetas()
  const lastUpdated = posts[0]?.date.slice(5).replace('-', '.') ?? '--.--'
  const counts = CATEGORY_TREE.flatMap(root => root.children ?? [])
    .filter(child => !child.hidden)
    .map(child => ({
      label: child.label.replace(/\s*\(.*\)$/, ''),
      href: `/category/${child.path.join('/')}`,
      count: posts.filter(p => p.categoryPath.join('/') === child.path.join('/')).length,
    }))

  return (
    <div className="diary-desk">
      <div className="diary-shell">
        <div className="diary-binder">
          <div className="diary-binder-inner">
            {/* Top strip */}
            <div className="diary-top">
              <div className="diary-counter">
                POSTS <b className="diary-hot">{posts.length}</b> · UPDATED <b>{lastUpdated}</b>
              </div>
              <div className="diary-heading">
                <Link href="/" className="diary-title">
                  DEVLOG<span className="title-cursor">_</span> 공부하고 만들고 기록하는 방
                </Link>
                <a
                  href="https://github.com/wlswjd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="diary-url"
                >
                  github.com/wlswjd
                </a>
              </div>
            </div>

            <div className="diary-pages">
              {/* Left page: profile */}
              <aside className="diary-page diary-profile">
                <div className="diary-today">
                  <span className="diary-today-label">TODAY IS..</span>
                  <b>공부중</b>
                </div>
                <div className="diary-avatar">
                  <div className="diary-avatar-circle">
                    <div className="diary-avatar-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/profile-shark.png" alt="프로필: 8비트 픽셀 상어" />
                    </div>
                    <Link href="/" className="diary-avatar-badge" aria-label="홈으로">
                      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <path d="M6 1h2v1h1v1h1v1h1v1h1v1h1v2h-1v5H9V9H5v4H2V8H1V6h1V5h1V4h1V3h1V2h1z" fill="currentColor" />
                      </svg>
                    </Link>
                  </div>
                </div>
                <div className="diary-profile-stats">
                  <MiniGrass />
                  <nav className="diary-counts" aria-label="카테고리별 글 수">
                    {counts.map(c => (
                      <Link key={c.href} href={c.href} className="diary-count">
                        <span>{c.label}</span>
                        <b>{c.count}</b>
                      </Link>
                    ))}
                  </nav>
                </div>
                <div className="diary-contact">
                  <div className="diary-contact-icons">
                    <a href="https://github.com/wlswjd" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                      <i className="nes-icon github is-small"></i>
                    </a>
                    <a href="mailto:wlswjd010629@gmail.com" aria-label="Gmail">
                      <i className="nes-icon google is-small"></i>
                    </a>
                  </div>
                  <ThemeToggle />
                </div>
              </aside>

              <Rings />

              {/* Right page: content */}
              <DiaryMain>{children}</DiaryMain>
            </div>
          </div>
        </div>

        <DiaryTabs />
      </div>
    </div>
  )
}
