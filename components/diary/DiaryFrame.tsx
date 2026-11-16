import Link from 'next/link'
import { getAllPostMetas } from '@/lib/posts'
import { CATEGORY_TREE } from '@/lib/categories'
import ThemeToggle from '@/components/ThemeToggle'
import DiaryTabs from './DiaryTabs'
import DiaryMain from './DiaryMain'
import MiniGrass from './MiniGrass'
import { NOW_PLAYING } from './NowPlaying'

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
                  DEVLOG<span className="title-cursor">_</span>
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
                <div className="diary-today" title={`${NOW_PLAYING.title} - ${NOW_PLAYING.artist}`}>
                  <span className="diary-today-label">
                    <span className="now-playing-eq" aria-hidden="true"><i /><i /><i /></span>
                    NOW
                  </span>
                  <span className="diary-marquee">
                    <span className="diary-marquee-track">
                      <b>{NOW_PLAYING.title} · {NOW_PLAYING.artist}</b>
                      <b aria-hidden="true">{NOW_PLAYING.title} · {NOW_PLAYING.artist}</b>
                    </span>
                  </span>
                </div>
                <div className="diary-avatar">
                  <div className="diary-avatar-circle">
                    <div className="diary-avatar-photo">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/profile-shark.png" alt="프로필: 8비트 픽셀 상어" />
                    </div>
                    <a
                      href="https://github.com/wlswjd"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="diary-avatar-badge"
                      aria-label="GitHub (새 창)"
                    >
                      <i className="nes-icon github is-small"></i>
                    </a>
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
