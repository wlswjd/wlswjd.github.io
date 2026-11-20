'use client'

import Link from 'next/link'
import { useCallback, useRef, useState, type MouseEvent } from 'react'
import { GAMES } from '@/lib/games'

const PAGE_SIZE = 8
const MAX_TILT = 12 // deg

function GameCover({ title, cover, href }: { title: string; cover: string; href: string }) {
  const ref = useRef<HTMLAnchorElement>(null)

  const onMove = useCallback((e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    const rotateY = (x - 0.5) * MAX_TILT * 2
    const rotateX = (0.5 - y) * MAX_TILT * 2
    el.style.transform =
      `perspective(700px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.04, 1.04, 1.04)`
    el.style.setProperty('--glare-x', `${x * 100}%`)
    el.style.setProperty('--glare-y', `${y * 100}%`)
    el.dataset.tilting = '1'
  }, [])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    el.dataset.tilting = '0'
  }, [])

  return (
    <Link
      ref={ref}
      href={href}
      className="game-card-tilt"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      aria-label={`${title} QA 보기`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="game-card-thumb" src={cover} alt={title} loading="lazy" />
      <span className="game-card-glare" aria-hidden="true" />
    </Link>
  )
}

export default function GameClient() {
  const [page, setPage] = useState(0)
  const totalPages = Math.ceil(GAMES.length / PAGE_SIZE)
  const items = GAMES.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE)

  return (
    <div className="game-page">
      <h2 className="section-title">
        <span className="nes-icon is-small star"></span>
        GAME
      </h2>

      <div className="game-grid">
        {items.map(game => (
          <article key={game.slug} className="game-card">
            <GameCover title={game.title} cover={game.cover} href={`/search/${game.slug}`} />
            <Link href={`/search/${game.slug}`} className="game-card-title">
              {game.title}
            </Link>
          </article>
        ))}
      </div>

      <nav className="game-pager" aria-label="게임 목록 페이지">
        <button
          type="button"
          className="nes-btn game-pager-btn"
          disabled={page === 0}
          onClick={() => setPage(p => Math.max(0, p - 1))}
          aria-label="이전 페이지"
        >
          {'<'}
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            type="button"
            className={`nes-btn game-pager-btn${page === i ? ' is-primary' : ''}`}
            onClick={() => setPage(i)}
            aria-current={page === i ? 'page' : undefined}
            aria-label={`${i + 1} 페이지`}
          >
            {i + 1}
          </button>
        ))}
        <button
          type="button"
          className="nes-btn game-pager-btn"
          disabled={page >= totalPages - 1}
          onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
          aria-label="다음 페이지"
        >
          {'>'}
        </button>
      </nav>
    </div>
  )
}
