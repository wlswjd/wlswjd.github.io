'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const SEARCH_TAB = { label: '검색', href: '/search' }

const TABS = [
  { label: '홈', href: '/' },
  { label: 'STUDY', href: '/category/study' },
  { label: 'PROJECT', href: '/category/project' },
  { label: 'DAILY', href: '/category/daily' },
]

function handlePortfolioClick(e: React.MouseEvent) {
  e.preventDefault()
  if (window.confirm('포트폴리오를 다운로드 하시겠습니까?')) {
    const a = document.createElement('a')
    a.href = '/portfolio.pdf'
    a.download = '진정맨_포트폴리오.pdf'
    a.click()
  }
}

export default function DiaryTabs() {
  const pathname = usePathname()

  return (
    <nav className="diary-tabs" aria-label="메뉴 탭">
      {TABS.map(tab => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href)
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`diary-tab ${active ? 'active' : ''}`}
            aria-current={active ? 'page' : undefined}
          >
            {tab.label}
          </Link>
        )
      })}
      <a href="/portfolio.pdf" onClick={handlePortfolioClick} className="diary-tab">
        PORTFOLIO
      </a>
      <Link
        href={SEARCH_TAB.href}
        className={`diary-tab ${pathname.startsWith(SEARCH_TAB.href) ? 'active' : ''}`}
        aria-current={pathname.startsWith(SEARCH_TAB.href) ? 'page' : undefined}
      >
        {SEARCH_TAB.label}
      </Link>
    </nav>
  )
}
