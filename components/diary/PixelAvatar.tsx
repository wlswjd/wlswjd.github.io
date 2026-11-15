// 16x16 픽셀 아바타 (SVG). 글자 하나 = 픽셀 하나.
const ROWS = [
  '................',
  '.....HHHHHH.....',
  '...HHHHHHHHHH...',
  '..HHHHHHHHHHHH..',
  '..HHSSSSSSSSHH..',
  '..HSSSSSSSSSSH..',
  '..HSSESSSSESSH..',
  '..HSSESSSSESSH..',
  '..HCSSSSSSSSCH..',
  '...SSSSMMSSSS...',
  '....SSSSSSSS....',
  '......SSSS......',
  '....BBBBBBBB....',
  '...BBBWBBWBBB...',
  '..BBBBBBBBBBBB..',
  '..BBBBBBBBBBBB..',
]

const PALETTE: Record<string, string> = {
  H: '#3b2a20',
  S: '#f6d2b0',
  E: '#212529',
  C: '#f4a3a3',
  M: '#c4452d',
  B: '#209cee',
  W: '#ffffff',
}

export default function PixelAvatar({ size = 128 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      role="img"
      aria-label="픽셀 아바타"
    >
      {ROWS.flatMap((row, y) =>
        [...row].map((ch, x) =>
          PALETTE[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={PALETTE[ch]} /> : null,
        ),
      )}
    </svg>
  )
}
