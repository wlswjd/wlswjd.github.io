'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
    setTheme(current)
  }, [])

  function toggle() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem('theme', next)
    } catch {}
  }

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      title={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      onClick={toggle}
      className="theme-switch theme-icon-btn"
    >
      {/* 현재 모드 표시: 라이트=해, 다크=달 (data-theme 기준 CSS로 전환) */}
      <span className="theme-mode-icon" aria-hidden="true">
        <svg className="theme-icon-sun" width="24" height="24" viewBox="0 0 16 16" shapeRendering="crispEdges">
          <path fill="#f7b51d" d="M7 0h2v2H7zM7 14h2v2H7zM0 7h2v2H0zM14 7h2v2h-2zM2 2h2v2H2zM12 2h2v2h-2zM2 12h2v2H2zM12 12h2v2h-2z" />
          <path fill="#f7d51d" d="M6 4h4v1h1v1h1v4h-1v1h-1v1H6v-1H5v-1H4V6h1V5h1z" />
        </svg>
        <svg className="theme-icon-moon" width="24" height="24" viewBox="0 0 16 16" shapeRendering="crispEdges">
          <path fill="#ffe08a" d="M5 2h2v1h-2zM4 3h2v1h-2zM3 4h3v1h-3zM2 5h4v1h-4zM2 6h4v1h-4zM1 7h5v1h-5zM1 8h6v1h-6zM1 9h7v1h-7zM2 10h8v1h-8zM2 11h11v1h-11zM3 12h9v1h-9zM4 13h7v1h-7zM6 14h3v1h-3z" />
          <path fill="#ffe08a" d="M11 3h1v1h-1zM14 6h1v1h-1z" />
        </svg>
      </span>
    </button>
  )
}
