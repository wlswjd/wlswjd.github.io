import { AvatarPixels } from './PixelAvatar'

// 아이소메트릭 미니룸 (직접 그린 SVG).
// 바닥 좌표 (u, v): u = 오른쪽 벽 방향, v = 왼쪽 벽 방향, 0~10. z = 높이(px).
const OX = 300
const OY = 120
const STEP = 24

function p(u: number, v: number, z = 0) {
  return `${OX + STEP * (u - v)},${OY + (STEP / 2) * (u + v) - z}`
}

const STROKE = '#3b4a5a'

interface BoxProps {
  u: [number, number]
  v: [number, number]
  h: number
  z?: number
  top: string
  left: string
  right: string
}

// 박스: 윗면 + 앞쪽 두 면(v=v1 쪽, u=u1 쪽)
function Box({ u: [u0, u1], v: [v0, v1], h, z = 0, top, left, right }: BoxProps) {
  const zt = z + h
  return (
    <g stroke={STROKE} strokeWidth={1.2} strokeLinejoin="round">
      <polygon points={`${p(u0, v1, z)} ${p(u1, v1, z)} ${p(u1, v1, zt)} ${p(u0, v1, zt)}`} fill={left} />
      <polygon points={`${p(u1, v0, z)} ${p(u1, v1, z)} ${p(u1, v1, zt)} ${p(u1, v0, zt)}`} fill={right} />
      <polygon points={`${p(u0, v0, zt)} ${p(u1, v0, zt)} ${p(u1, v1, zt)} ${p(u0, v1, zt)}`} fill={top} />
    </g>
  )
}

// 오른쪽 벽(v=0)에 붙은 사각형
function OnRightWall({ u: [u0, u1], z: [z0, z1], fill }: { u: [number, number]; z: [number, number]; fill: string }) {
  return (
    <polygon
      points={`${p(u0, 0, z0)} ${p(u1, 0, z0)} ${p(u1, 0, z1)} ${p(u0, 0, z1)}`}
      fill={fill}
      stroke={STROKE}
      strokeWidth={1.2}
    />
  )
}

// 왼쪽 벽(u=0)에 붙은 사각형
function OnLeftWall({ v: [v0, v1], z: [z0, z1], fill }: { v: [number, number]; z: [number, number]; fill: string }) {
  return (
    <polygon
      points={`${p(0, v0, z0)} ${p(0, v1, z0)} ${p(0, v1, z1)} ${p(0, v0, z1)}`}
      fill={fill}
      stroke={STROKE}
      strokeWidth={1.2}
    />
  )
}

export default function MiniRoom() {
  const WALL = 120
  const avatar = p(5.2, 6.2).split(',').map(Number)

  return (
    <svg className="diary-room-svg" viewBox="40 0 520 375" role="img" aria-label="아이소메트릭 미니룸: 책상과 모니터, 책장, 침대, 화분이 있는 방">
      {/* 벽 */}
      <polygon points={`${p(0, 0)} ${p(0, 10)} ${p(0, 10, WALL)} ${p(0, 0, WALL)}`} fill="#d6ecfb" stroke={STROKE} strokeWidth={1.5} />
      <polygon points={`${p(0, 0)} ${p(10, 0)} ${p(10, 0, WALL)} ${p(0, 0, WALL)}`} fill="#bfe0f7" stroke={STROKE} strokeWidth={1.5} />
      {/* 벽지 줄무늬 */}
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
        <g key={i} stroke="#ffffff" strokeOpacity={0.55} strokeWidth={2}>
          <line x1={p(0, i).split(',')[0]} y1={p(0, i).split(',')[1]} x2={p(0, i, WALL).split(',')[0]} y2={p(0, i, WALL).split(',')[1]} />
          <line x1={p(i, 0).split(',')[0]} y1={p(i, 0).split(',')[1]} x2={p(i, 0, WALL).split(',')[0]} y2={p(i, 0, WALL).split(',')[1]} />
        </g>
      ))}

      {/* 창문 (오른쪽 벽) */}
      <OnRightWall u={[5.6, 8.6]} z={[52, 104]} fill="#ffffff" />
      <OnRightWall u={[5.8, 8.4]} z={[56, 100]} fill="#9fd8ff" />
      <polygon points={`${p(7.1, 0, 56)} ${p(7.1, 0, 100)}`} stroke="#ffffff" strokeWidth={3} />
      <polygon points={`${p(5.8, 0, 78)} ${p(8.4, 0, 78)}`} stroke="#ffffff" strokeWidth={3} />
      <polygon points={`${p(6.2, 0, 92)} ${p(6.8, 0, 96)} ${p(7.4, 0, 92)} ${p(6.8, 0, 90)}`} fill="#ffffff" opacity={0.8} />

      {/* 액자 (왼쪽 벽) */}
      <OnLeftWall v={[2, 4.2]} z={[58, 96]} fill="#f6e3b4" />
      <OnLeftWall v={[2.3, 3.9]} z={[63, 91]} fill="#209cee" />
      <OnLeftWall v={[2.6, 3.2]} z={[68, 80]} fill="#ffffff" />

      {/* 바닥 + 마루 */}
      <polygon points={`${p(0, 0)} ${p(10, 0)} ${p(10, 10)} ${p(0, 10)}`} fill="#e8c99b" stroke={STROKE} strokeWidth={1.5} />
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => {
        const [x1, y1] = p(i, 0).split(',')
        const [x2, y2] = p(i, 10).split(',')
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#c9a46f" strokeWidth={1} />
      })}

      {/* 러그 */}
      <polygon points={`${p(3, 4)} ${p(7.6, 4)} ${p(7.6, 8.6)} ${p(3, 8.6)}`} fill="#f4b8b8" stroke={STROKE} strokeWidth={1.2} />
      <polygon points={`${p(3.5, 4.5)} ${p(7.1, 4.5)} ${p(7.1, 8.1)} ${p(3.5, 8.1)}`} fill="none" stroke="#ffffff" strokeWidth={2} strokeDasharray="4 4" />

      {/* 책상 + 모니터 + 키보드 */}
      <Box u={[1.4, 5]} v={[0, 2]} h={4} z={36} top="#a8794c" left="#8c6239" right="#7a5530" />
      <Box u={[1.6, 1.9]} v={[1.6, 1.9]} h={36} top="#7a5530" left="#7a5530" right="#6a4828" />
      <Box u={[4.5, 4.8]} v={[1.6, 1.9]} h={36} top="#7a5530" left="#7a5530" right="#6a4828" />
      <Box u={[2.4, 4]} v={[0.3, 0.6]} h={30} z={40} top="#4a4f57" left="#212529" right="#33373d" />
      <polygon points={`${p(2.55, 0.6, 44)} ${p(3.85, 0.6, 44)} ${p(3.85, 0.6, 66)} ${p(2.55, 0.6, 66)}`} fill="#209cee" />
      <polygon points={`${p(2.75, 0.6, 58)} ${p(3.2, 0.6, 58)} ${p(3.2, 0.6, 61)} ${p(2.75, 0.6, 61)}`} fill="#ffffff" />
      <polygon points={`${p(2.75, 0.6, 51)} ${p(3.6, 0.6, 51)} ${p(3.6, 0.6, 54)} ${p(2.75, 0.6, 54)}`} fill="#bfe6ff" />
      <Box u={[2.5, 3.9]} v={[1, 1.5]} h={2} z={40} top="#e9ecef" left="#adb5bd" right="#ced4da" />

      {/* 의자 */}
      <Box u={[2.8, 3.9]} v={[2.4, 3.5]} h={4} z={20} top="#209cee" left="#1673b3" right="#125e94" />
      <Box u={[3.3, 3.4]} v={[2.9, 3]} h={20} top="#33373d" left="#33373d" right="#212529" />
      <Box u={[2.8, 3.9]} v={[3.4, 3.6]} h={30} z={24} top="#209cee" left="#1673b3" right="#125e94" />

      {/* 책장 (왼쪽 벽) */}
      <Box u={[0, 1.1]} v={[5, 8.4]} h={92} top="#b98a5a" left="#9a6d40" right="#a87a4c" />
      {[18, 46, 74].map((z, i) => (
        <g key={z}>
          {[0, 1, 2, 3, 4, 5].map(j => {
            const v0 = 5.25 + j * 0.5
            const colors = ['#c4452d', '#209cee', '#f7d51d', '#92cc41', '#ffffff', '#1673b3']
            const hgt = 20 - ((i + j) % 3) * 3
            return (
              <polygon
                key={j}
                points={`${p(1.1, v0, z)} ${p(1.1, v0 + 0.4, z)} ${p(1.1, v0 + 0.4, z + hgt)} ${p(1.1, v0, z + hgt)}`}
                fill={colors[(i * 2 + j) % colors.length]}
                stroke={STROKE}
                strokeWidth={0.8}
              />
            )
          })}
        </g>
      ))}

      {/* 침대 (머리판 먼저: 뒤쪽이라서) */}
      <Box u={[6.4, 6.6]} v={[0, 3.4]} h={42} top="#a8794c" left="#8c6239" right="#7a5530" />
      <Box u={[6.4, 10]} v={[0, 3.4]} h={16} top="#a8794c" left="#8c6239" right="#7a5530" />
      <Box u={[6.5, 10]} v={[0.1, 3.3]} h={8} z={16} top="#ffffff" left="#e9ecef" right="#dee2e6" />
      <Box u={[6.7, 7.8]} v={[0.4, 3]} h={6} z={24} top="#fff4d6" left="#f1e2b8" right="#e8d5a1" />
      <Box u={[8, 10]} v={[0.1, 3.3]} h={3} z={24} top="#8ccaf5" left="#5fb4ee" right="#4aa3df" />

      {/* 미니미 */}
      <g transform={`translate(${avatar[0] - 24} ${avatar[1] - 46}) scale(3)`} shapeRendering="crispEdges">
        <AvatarPixels />
      </g>

      {/* 화분 */}
      <Box u={[8.8, 9.7]} v={[6.2, 7.1]} h={18} top="#5b3a22" left="#c4452d" right="#a83a25" />
      {(() => {
        const [x, y] = p(9.25, 6.65, 18).split(',').map(Number)
        return (
          <g stroke={STROKE} strokeWidth={1.2}>
            <ellipse cx={x - 10} cy={y - 14} rx={10} ry={15} fill="#4f9a2a" transform={`rotate(-25 ${x - 10} ${y - 14})`} />
            <ellipse cx={x + 10} cy={y - 14} rx={10} ry={15} fill="#4f9a2a" transform={`rotate(25 ${x + 10} ${y - 14})`} />
            <ellipse cx={x} cy={y - 24} rx={9} ry={18} fill="#92cc41" />
          </g>
        )
      })()}
    </svg>
  )
}
