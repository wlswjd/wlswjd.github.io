'use client'

import { useRouter } from 'next/navigation'

// 이전 페이지로. 바로 글 링크로 들어와서 이전 기록이 없으면 카테고리 목록으로 간다.
export default function BackButton({ fallbackHref }: { fallbackHref: string }) {
  const router = useRouter()
  return (
    <button
      type="button"
      className="diary-back"
      onClick={() => {
        if (window.history.length > 1) router.back()
        else router.push(fallbackHref)
      }}
    >
      ◀ BACK
    </button>
  )
}
