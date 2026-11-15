// 최근 8주 GitHub 기여 잔디 (빌드 시점에 GitHub 공개 캘린더에서 가져옴).
const USER = 'wlswjd'
const WEEKS = 8

interface Day {
  date: string
  level: number
}

async function getDays(): Promise<Day[]> {
  try {
    const res = await fetch(`https://github.com/users/${USER}/contributions`, { cache: 'force-cache' })
    if (!res.ok) return []
    const html = await res.text()
    const days: Day[] = []
    for (const m of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
      const date = m[0].match(/data-date="([\d-]+)"/)?.[1]
      const level = m[0].match(/data-level="(\d)"/)?.[1]
      if (date && level) days.push({ date, level: Number(level) })
    }
    return days.sort((a, b) => a.date.localeCompare(b.date))
  } catch {
    return []
  }
}

export default async function MiniGrass() {
  const days = await getDays()
  const levels = new Map(days.map(d => [d.date, d.level]))

  // 마지막 날짜가 속한 주의 일요일부터 거꾸로 8주. 7행(일~토) × 8열.
  const last = days.length ? new Date(`${days[days.length - 1].date}T00:00:00Z`) : new Date()
  const start = new Date(last)
  start.setUTCDate(last.getUTCDate() - last.getUTCDay() - (WEEKS - 1) * 7)

  const cells = Array.from({ length: WEEKS * 7 }, (_, i) => {
    const d = new Date(start)
    d.setUTCDate(start.getUTCDate() + i)
    const key = d.toISOString().slice(0, 10)
    return { key, level: d > last ? -1 : (levels.get(key) ?? 0) }
  })

  return (
    <a
      href={`https://github.com/${USER}`}
      target="_blank"
      rel="noopener noreferrer"
      className="diary-grass"
      aria-label="최근 8주 GitHub 기여 그래프 (GitHub에서 보기)"
    >
      <span className="diary-grass-label">잔디밭 · 최근 8주</span>
      <div className="diary-grass-grid">
        {cells.map(c => (
          <span key={c.key} className={`grass-cell lv-${c.level}`} title={c.key} />
        ))}
      </div>
    </a>
  )
}
