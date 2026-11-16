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
      role="switch"
      aria-checked={isDark}
      aria-label="다크 모드 전환"
      onClick={toggle}
      className="theme-switch"
    >
      {/* 현재 모드 표시: 라이트=해, 다크=달 (data-theme 기준 CSS로 전환) */}
      <span className="theme-mode-icon" aria-hidden="true">
        <svg className="theme-icon-sun" width="16" height="16" viewBox="0 0 16 16" shapeRendering="crispEdges">
          <path fill="#f7b51d" d="M7 0h2v2H7zM7 14h2v2H7zM0 7h2v2H0zM14 7h2v2h-2zM2 2h2v2H2zM12 2h2v2h-2zM2 12h2v2H2zM12 12h2v2h-2z" />
          <path fill="#f7d51d" d="M6 4h4v1h1v1h1v4h-1v1h-1v1H6v-1H5v-1H4V6h1V5h1z" />
        </svg>
        <svg className="theme-icon-moon" width="16" height="16" viewBox="0 0 16 16" shapeRendering="crispEdges">
          <path fill="#ffe08a" d="M6 1h4v1H8v1H7v2H6v6h1v2h1v1h2v1H6v-1H4v-1H3v-1H2V5h1V4h1V3h1V2h1z" />
          <path fill="#ffe08a" d="M12 3h1v1h-1zM14 6h1v1h-1z" />
        </svg>
      </span>
      <span className="theme-switch-track">
        <span className="theme-switch-knob">{isDark ? '☀' : '☾'}</span>
      </span>
      <span className="theme-switch-label">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  )
}
