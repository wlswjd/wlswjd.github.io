'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

interface Props {
  posts: PostMeta[]
}

export default function SearchClient({ posts }: Props) {
  const [query, setQuery] = useState('')

  const results = query.trim().length > 0
    ? posts.filter(p => {
        const q = query.toLowerCase()
        return (
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(t => t.toLowerCase().includes(q))
        )
      })
    : []

  return (
    <div className="search-page">
      <h2 className="section-title">
        <span className="nes-icon is-small star"></span>
        SEARCH
      </h2>

      <div className="search-field-wrap">
        <input
          className="nes-input"
          placeholder="제목, 설명, 태그 검색..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          autoFocus
        />
      </div>

      {query.trim() && (
        <div className="search-results-list">
          {results.length === 0 ? (
            <div className="empty-state">
              <p>&quot;{query}&quot; 에 대한 결과가 없습니다.</p>
            </div>
          ) : (
            <>
              <p className="search-result-count">{results.length}개의 결과</p>
              {results.map(p => (
                <Link
                  key={p.slug.join('/')}
                  href={`/posts/${p.slug.join('/')}`}
                  className="nes-container search-result-card"
                >
                  <span className="search-result-title">{p.title}</span>
                  {p.description && (
                    <span className="search-result-desc">{p.description}</span>
                  )}
                  {p.tags.length > 0 && (
                    <div className="search-result-tags">
                      {p.tags.map(t => (
                        <span key={t} className="nes-badge">
                          <span className="is-primary tag-text">{t}</span>
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
