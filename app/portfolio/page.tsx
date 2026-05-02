'use client'

import { useEffect, useState } from 'react'

// ── Display config ────────────────────────────────────────
// Original image: 480×480px (30×30 tiles at 16px/tile)
// We display at 1.5× → 720×720px, 24px/tile
const TILE = 24
const W    = 30
const H    = 30

// ── Collision map (0=walkable, 1=blocked) ─────────────────
// Generated from pixel-color analysis of the map image
const CMAP: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,0,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
]

// ── Types ─────────────────────────────────────────────────
type Dir   = 'up' | 'down' | 'left' | 'right'
type ObjId = 'npc' | 'computer' | 'books' | 'trophy' | 'chest'

interface Obj { id: ObjId; x: number; y: number; emoji: string; label: string }

// Objects occupy walkable tiles and become non-walkable
// Player stands adjacent (one step away) and presses A/Enter
const OBJS: Obj[] = [
  { id: 'npc',      x: 6,  y: 7,  emoji: '👾', label: 'HELLO!' },
  { id: 'computer', x: 15, y: 9,  emoji: '🖥️', label: 'PROJECTS' },
  { id: 'books',    x: 14, y: 11, emoji: '📚', label: 'SKILLS' },
  { id: 'trophy',   x: 3,  y: 12, emoji: '🏆', label: 'ABOUT' },
  { id: 'chest',    x: 24, y: 13, emoji: '📦', label: 'RESUME' },
]

const OBJ_POS = new Set(OBJS.map(o => `${o.x},${o.y}`))

function canWalk(x: number, y: number) {
  if (x < 0 || x >= W || y < 0 || y >= H) return false
  if (CMAP[y][x] === 1) return false
  return !OBJ_POS.has(`${x},${y}`)
}

function offset(d: Dir): [number, number] {
  if (d === 'up')   return [0, -1]
  if (d === 'down') return [0,  1]
  if (d === 'left') return [-1, 0]
  return [1, 0]
}

// ── px shorthand ─────────────────────────────────────────
const px = (n: number): React.CSSProperties =>
  ({ fontFamily: 'var(--font-pixel)', fontSize: n })

// ── Dialog content components ─────────────────────────────
function ProjectsDialog() {
  const projects = [
    { name: 'Minecraft RAG AI', stack: 'Streamlit · LangChain · RAG',    url: 'https://minecraft-ragai.streamlit.app/',        color: '#92cc41' },
    { name: 'Youtube RAG',      stack: 'Streamlit · RAG · YouTube API',  url: 'https://ytchannel-analyze-rag.streamlit.app/', color: '#209cee' },
  ]
  return (
    <>
      <p style={{ ...px(10), marginBottom: 16 }}>💻 PROJECTS</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {projects.map(p => (
          <div key={p.name} className="nes-container" style={{ background: '#fff', padding: '12px 14px' }}>
            <p style={{ ...px(9), color: p.color, marginBottom: 4, fontWeight: 'bold' }}>{p.name}</p>
            <p style={{ ...px(8), color: '#888', marginBottom: 10 }}>{p.stack}</p>
            <a href={p.url} target="_blank" rel="noopener noreferrer" className="nes-btn is-primary" style={px(8)}>
              OPEN ↗
            </a>
          </div>
        ))}
      </div>
    </>
  )
}

function SkillsDialog() {
  const skills = [
    { name: 'Python',  val: 85, cls: 'is-success' },
    { name: 'AI / ML', val: 80, cls: 'is-success' },
    { name: 'Next.js', val: 70, cls: 'is-primary'  },
    { name: 'React',   val: 65, cls: 'is-primary'  },
    { name: 'Node.js', val: 55, cls: 'is-warning'  },
  ]
  return (
    <>
      <p style={{ ...px(10), marginBottom: 16 }}>📚 SKILL TREE</p>
      {skills.map(s => (
        <div key={s.name} style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={px(8)}>{s.name}</span>
            <span style={{ ...px(8), color: '#888' }}>{s.val}</span>
          </div>
          <progress className={`nes-progress ${s.cls}`} value={s.val} max={100} style={{ height: 16, display: 'block', width: '100%' }} />
        </div>
      ))}
    </>
  )
}

function AboutDialog() {
  const rows: [string, string][] = [
    ['NAME',   '진정맨'],
    ['CLASS',  'AI Developer'],
    ['LEVEL',  'Lv. 20'],
    ['SPEC',   'ML · RAG · Web'],
    ['LOC',    'Korea 🇰🇷'],
    ['STATUS', 'AI/ML Study'],
  ]
  return (
    <>
      <p style={{ ...px(10), marginBottom: 16 }}>🏆 PROFILE</p>
      <div className="nes-container" style={{ background: '#fff' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k}>
                <td style={{ ...px(8), color: '#888', paddingBottom: 10, paddingRight: 16, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{k}</td>
                <td style={{ ...px(8), fontWeight: 'bold', paddingBottom: 10 }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function NpcDialog() {
  return (
    <>
      <p style={{ ...px(10), marginBottom: 12 }}>👾 ???</p>
      <div className="nes-container" style={{ background: '#fff', lineHeight: 2.4 }}>
        <p style={px(9)}>Hey there, Trainer! ✨</p>
        <p style={{ ...px(9), margin: '8px 0' }}>
          I&apos;m 진정맨 — AI developer<br />
          from Korea. 🇰🇷
        </p>
        <p style={px(9)}>
          Explore the town to find<br />
          my projects &amp; skills!
        </p>
      </div>
    </>
  )
}

function ResumeDialog() {
  return (
    <>
      <p style={{ ...px(10), marginBottom: 12 }}>📦 YOU FOUND AN ITEM!</p>
      <div className="nes-container" style={{ background: '#fff', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>📄</div>
        <p style={{ ...px(9), color: '#f7d51d', marginBottom: 4, fontWeight: 'bold' }}>이력서 / RESUME</p>
        <p style={{ ...px(8), color: '#888', marginBottom: 16 }}>
          이력서를 다운로드하거나<br />이메일로 문의하세요
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/resume.pdf" download className="nes-btn is-warning" style={px(8)}>📥 다운로드</a>
          <a href="mailto:wlswjd010629@gmail.com" className="nes-btn is-primary" style={px(8)}>✉️ 이메일</a>
        </div>
      </div>
    </>
  )
}

function renderContent(id: ObjId) {
  switch (id) {
    case 'computer': return <ProjectsDialog />
    case 'books':    return <SkillsDialog />
    case 'trophy':   return <AboutDialog />
    case 'npc':      return <NpcDialog />
    case 'chest':    return <ResumeDialog />
  }
}

function DialogBox({ id, onClose }: { id: ObjId; onClose: () => void }) {
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '0 16px' }}
      onClick={onClose}
    >
      <div
        className="nes-container is-dark"
        style={{ maxWidth: 480, width: '100%', padding: 24 }}
        onClick={e => e.stopPropagation()}
      >
        {renderContent(id)}
        <p style={{ ...px(7), color: '#888', textAlign: 'center', marginTop: 16 }}>
          ESC · ENTER to close
        </p>
      </div>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────
export default function PortfolioPage() {
  const [pos, setPos] = useState({ x: 10, y: 12 })
  const [dir, setDir] = useState<Dir>('down')
  const [dialog, setDialog] = useState<ObjId | null>(null)
  // walking animation frame (0 or 1, alternates on move)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (dialog !== null) {
        if (['Escape', 'Enter', ' '].includes(e.key)) {
          e.preventDefault()
          setDialog(null)
        }
        return
      }

      let dx = 0, dy = 0, newDir = dir

      switch (e.key) {
        case 'ArrowUp':    case 'w': case 'W': dy = -1; newDir = 'up';    break
        case 'ArrowDown':  case 's': case 'S': dy =  1; newDir = 'down';  break
        case 'ArrowLeft':  case 'a': case 'A': dx = -1; newDir = 'left';  break
        case 'ArrowRight': case 'd': case 'D': dx =  1; newDir = 'right'; break
        case 'Enter': case ' ': case 'z': case 'Z': {
          e.preventDefault()
          setPos(prev => {
            const [fx, fy] = offset(dir)
            const obj = OBJS.find(o => o.x === prev.x + fx && o.y === prev.y + fy)
            if (obj) setDialog(obj.id)
            return prev
          })
          return
        }
        default: return
      }

      e.preventDefault()
      setDir(newDir)
      setPos(prev => {
        const nx = prev.x + dx, ny = prev.y + dy
        if (!canWalk(nx, ny)) return prev
        setStep(s => 1 - s)
        return { x: nx, y: ny }
      })
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dialog, dir])

  const [fdx, fdy] = offset(dir)
  const facing = OBJS.find(o => o.x === pos.x + fdx && o.y === pos.y + fdy)

  const doMove = (d: Dir) => {
    const [dx, dy] = offset(d)
    setDir(d)
    setPos(prev => {
      const nx = prev.x + dx, ny = prev.y + dy
      if (!canWalk(nx, ny)) return prev
      setStep(s => 1 - s)
      return { x: nx, y: ny }
    })
  }

  const doInteract = () => {
    setPos(prev => {
      const [fx, fy] = offset(dir)
      const obj = OBJS.find(o => o.x === prev.x + fx && o.y === prev.y + fy)
      if (obj) setDialog(obj.id)
      return prev
    })
  }

  return (
    <div>
      <h2 className="section-title">
        <span className="nes-icon is-small star" />
        PORTFOLIO MAP
      </h2>

      <p style={{ ...px(8), color: 'var(--text-muted)', marginBottom: 14, lineHeight: 2.4 }}>
        ↑↓←→ · WASD to walk &nbsp;|&nbsp; ENTER · Z to interact
      </p>

      {/* Map viewport */}
      <div style={{ overflowX: 'auto', maxWidth: '100%', display: 'flex', justifyContent: 'center' }}>
        <div
          style={{
            position: 'relative',
            width:  W * TILE,
            height: H * TILE,
            backgroundImage: 'url(/map.png)',
            backgroundSize: `${W * TILE}px ${H * TILE}px`,
            backgroundRepeat: 'no-repeat',
            imageRendering: 'pixelated',
            border: '4px solid #212529',
            boxShadow: '6px 6px 0 #212529',
            cursor: 'default',
          }}
        >
          {/* Object markers — floating emoji above each NPC/item */}
          {OBJS.map(o => (
            <div
              key={o.id}
              style={{
                position: 'absolute',
                left: o.x * TILE,
                top:  o.y * TILE,
                width:  TILE,
                height: TILE,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: TILE * 0.75,
                zIndex: 5,
                userSelect: 'none',
                filter: 'drop-shadow(0 -2px 0 #000) drop-shadow(2px 0 0 #000) drop-shadow(-2px 0 0 #000)',
              }}
            >
              {o.emoji}
            </div>
          ))}

          {/* Object name label — appears below emoji */}
          {OBJS.map(o => (
            <div
              key={`lbl-${o.id}`}
              style={{
                position: 'absolute',
                left: o.x * TILE - TILE * 0.5,
                top:  (o.y + 1) * TILE,
                width: TILE * 2,
                textAlign: 'center',
                fontFamily: 'var(--font-pixel)',
                fontSize: 7,
                color: '#fff',
                textShadow: '1px 1px 0 #000,-1px -1px 0 #000,1px -1px 0 #000,-1px 1px 0 #000',
                pointerEvents: 'none',
                zIndex: 6,
                lineHeight: 1.5,
              }}
            >
              {o.label}
            </div>
          ))}

          {/* ▲A interact indicator — blinks above the object you're facing */}
          {facing && (
            <div
              style={{
                position: 'absolute',
                left: facing.x * TILE,
                top:  facing.y * TILE - 20,
                width: TILE,
                textAlign: 'center',
                fontFamily: 'var(--font-pixel)',
                fontSize: 9,
                color: '#f7d51d',
                textShadow: '1px 1px 0 #000',
                zIndex: 20,
                animation: 'pfBounce .45s ease-in-out infinite alternate',
                pointerEvents: 'none',
              }}
            >
              ▲A
            </div>
          )}

          {/* Player character — Ash (NES.css built-in sprite) */}
          <div
            style={{
              position: 'absolute',
              left: pos.x * TILE,
              top:  pos.y * TILE - TILE * 0.5,
              width:  TILE,
              height: TILE * 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              zIndex: 10,
              transition: 'left .09s linear, top .09s linear',
              userSelect: 'none',
              transform: step ? 'translateY(-2px)' : 'translateY(0)',
            }}
          >
            <i className="nes-ash" style={{ transform: 'scale(0.55)', transformOrigin: 'center', imageRendering: 'pixelated' }} />
          </div>
        </div>
      </div>

      {/* Mobile D-pad */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'grid', gridTemplate: 'repeat(3,40px)/repeat(3,40px)', gap: 4 }}>
          {(['', 'up', '', 'left', '', 'right', '', 'down', ''] as (Dir | '')[]).map((d, i) =>
            d ? (
              <button
                key={i}
                className="nes-btn"
                style={{ fontSize: 14, padding: 0, width: 40, height: 40, lineHeight: 1 }}
                onClick={() => doMove(d as Dir)}
              >
                {d === 'up' ? '▲' : d === 'down' ? '▼' : d === 'left' ? '◀' : '▶'}
              </button>
            ) : <div key={i} />
          )}
        </div>
        <button
          className="nes-btn is-warning"
          style={{ ...px(10), padding: '10px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
          onClick={doInteract}
        >
          <span>A</span>
          <span style={{ fontSize: 7, color: '#999' }}>INTERACT</span>
        </button>
      </div>

      {dialog && <DialogBox id={dialog} onClose={() => setDialog(null)} />}

      <style>{`
        @keyframes pfBounce {
          from { transform: translateY(0); }
          to   { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  )
}
