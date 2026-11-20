import Link from 'next/link'
import type { Game } from '@/lib/games'
import { RATING_LABELS } from '@/lib/games'

function Stars({ value }: { value: number }) {
  const clamped = Math.max(0, Math.min(5, value))
  const full = Math.floor(clamped)
  const half = clamped - full >= 0.5
  return (
    <span className="game-stars" aria-label={`${clamped} / 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        if (i < full) return <i key={i} className="nes-icon is-small star" />
        if (i === full && half) return <i key={i} className="nes-icon is-small star is-half" />
        return <i key={i} className="nes-icon is-small star is-transparent" />
      })}
    </span>
  )
}

function scoreTone(score: number | null): string {
  if (score == null) return 'is-empty'
  if (score >= 75) return 'is-high'
  if (score >= 50) return 'is-mid'
  return 'is-low'
}

export default function GameDetail({ game }: { game: Game }) {
  const oneLiner = game.oneLiner.trim() || '한 줄 평을 작성해 주세요.'

  return (
    <div className="game-detail">
      <Link href="/search" className="nes-btn is-primary game-detail-back">
        ◀ BACK
      </Link>

      <div className="game-detail-main">
        <div className="game-detail-cover-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="game-detail-cover" src={game.cover} alt={game.title} />
        </div>

        <div className="game-detail-info">
          <div className="game-detail-heading">
            <h2 className="game-detail-title">{game.title}</h2>
            <div
              className={`game-detail-score ${scoreTone(game.totalScore)}`}
              aria-label={`총점 ${game.totalScore ?? '미정'}`}
            >
              <span className="game-detail-score-num">
                {game.totalScore == null ? '—' : game.totalScore}
              </span>
            </div>
          </div>

          <ul className="game-detail-ratings">
            {RATING_LABELS.map(({ key, label }) => {
              const row = game.ratings[key]
              return (
                <li key={key} className="game-rating-row">
                  <span className="game-rating-label">{label}</span>
                  <Stars value={row.stars} />
                  <span className={`game-rating-score${row.score == null ? ' is-empty' : ''}`}>
                    {row.score == null ? '' : row.score}
                  </span>
                </li>
              )
            })}
          </ul>

          <div className="game-detail-oneliner">
            <span className="game-detail-kicker">한 줄 평</span>
            <p className="game-detail-quote">{oneLiner}</p>
          </div>
        </div>
      </div>

      <div className="game-detail-split">
        <section className="game-detail-block">
          <h3 className="game-detail-kicker">게임 특장점</h3>
          <p className="game-detail-body">
            {game.pros.trim() || '특장점을 작성해 주세요.'}
          </p>
        </section>
        <section className="game-detail-block">
          <h3 className="game-detail-kicker">개선점</h3>
          <p className="game-detail-body">
            {game.cons.trim() || '개선점을 작성해 주세요.'}
          </p>
        </section>
      </div>
    </div>
  )
}
