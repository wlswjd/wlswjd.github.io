// 지금 듣는 노래 (프로토타입: 정적 카드).
// 앨범 커버 이미지를 쓰려면 public/images/ 에 파일을 넣고 cover 에 경로를 적으면 된다.
const NOW_PLAYING = {
  title: "(What's the Story) Morning Glory?",
  artist: 'Oasis',
  meta: '1995 · Britpop',
  cover: '' as string, // 예: '/images/now-playing.jpg'
  progress: 0.42,
  elapsed: '1:52',
  duration: '4:28',
}

// 커버 이미지가 없을 때 보여줄 기본 아트 (해 질 녘 도시 픽셀 그림)
function DefaultCover() {
  const buildings = [
    [0, 52], [10, 40], [22, 58], [34, 34], [46, 48], [58, 30], [70, 44], [82, 38], [94, 56],
    [106, 28], [118, 46], [130, 36], [142, 50], [152, 42],
  ]
  return (
    <svg viewBox="0 0 160 160" shapeRendering="crispEdges" aria-hidden="true">
      <defs>
        <linearGradient id="np-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2b2d6e" />
          <stop offset="0.55" stopColor="#c4527a" />
          <stop offset="1" stopColor="#f7a86b" />
        </linearGradient>
      </defs>
      <rect width="160" height="160" fill="url(#np-sky)" />
      <rect x="64" y="64" width="32" height="32" fill="#ffd36b" />
      <rect x="60" y="68" width="40" height="24" fill="#ffd36b" />
      {[20, 40, 120, 136, 104].map((x, i) => (
        <rect key={x} x={x} y={14 + (i % 3) * 10} width="2" height="2" fill="#ffffff" />
      ))}
      {buildings.map(([x, h]) => (
        <rect key={x} x={x} y={160 - h} width="12" height={h} fill="#1e1b3a" />
      ))}
      {buildings.map(([x, h], i) =>
        i % 2 === 0 ? <rect key={`w${x}`} x={x + 4} y={160 - h + 8} width="3" height="3" fill="#f7d51d" /> : null,
      )}
    </svg>
  )
}

export default function NowPlaying() {
  const s = NOW_PLAYING
  return (
    <div className="now-playing">
      <div className="now-playing-label">
        <span className="now-playing-eq" aria-hidden="true"><i /><i /><i /></span>
        NOW PLAYING
      </div>
      <div className="now-playing-cover">
        {s.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.cover} alt={`${s.title} 앨범 커버`} />
        ) : (
          <DefaultCover />
        )}
      </div>
      <div className="now-playing-title">{s.title}</div>
      <div className="now-playing-artist">
        {s.artist} <span>· {s.meta}</span>
      </div>
      <div className="now-playing-bar" aria-hidden="true">
        <span style={{ width: `${s.progress * 100}%` }} />
      </div>
      <div className="now-playing-time" aria-hidden="true">
        <span>{s.elapsed}</span>
        <span>◀◀ &nbsp;▮▮&nbsp; ▶▶</span>
        <span>{s.duration}</span>
      </div>
    </div>
  )
}
