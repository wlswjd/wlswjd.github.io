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
      <span className="theme-switch-track">
        <span className="theme-switch-knob">{isDark ? '☀' : '☾'}</span>
      </span>
      <span className="theme-switch-label">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
    </button>
  )
}
