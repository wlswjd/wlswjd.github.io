import Link from 'next/link'
import { getAllPostMetas } from '@/lib/posts'
import ThemeToggle from '@/components/ThemeToggle'
import PixelAvatar from './PixelAvatar'
import DiaryTabs from './DiaryTabs'
import DiaryMain from './DiaryMain'

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
                  <PixelAvatar size={128} />
                </div>
                <p className="diary-intro">
                  머신러닝 · LLM Agent · 게임 AI
                  <br />
                  오늘도 한 칸씩 ▶
                </p>
                <div className="diary-spacer" />
                <div className="diary-contact">
                  <a href="https://github.com/wlswjd" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <i className="nes-icon github is-small"></i>
                  </a>
                  <a href="mailto:wlswjd010629@gmail.com" aria-label="Gmail">
                    <i className="nes-icon google is-small"></i>
                  </a>
                </div>
                <ThemeToggle />
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
