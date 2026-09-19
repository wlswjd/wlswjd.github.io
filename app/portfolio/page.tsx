import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
}

export default function PortfolioPage() {
  return (
    <div>
      <h2 className="section-title">
        <span className="nes-icon is-small star" />
        PORTFOLIO
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
        <div
          className="nes-container is-rounded"
          style={{ maxWidth: 420, width: '100%', textAlign: 'center', background: '#fff' }}
        >
          <p style={{ marginBottom: 24, lineHeight: 1.8 }}>
            포트폴리오를 다운로드 하시겠습니까?
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <a href="/portfolio.pdf" download="진정맨_포트폴리오.pdf" className="nes-btn is-primary">
              Yes
            </a>
            <Link href="/" className="nes-btn">
              No
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
