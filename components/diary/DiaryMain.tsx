'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// 오른쪽 페이지는 내부 스크롤이라, 페이지 이동 시 맨 위로 되돌린다.
export default function DiaryMain({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    ref.current?.scrollTo(0, 0)
  }, [pathname])

  return (
    <main ref={ref} className="diary-page diary-main">
      {children}
    </main>
  )
}
