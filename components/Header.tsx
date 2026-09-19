'use client'

import Link from 'next/link'

function handlePortfolioClick(e: React.MouseEvent) {
  e.preventDefault()
  if (window.confirm('포트폴리오를 다운로드 하시겠습니까?')) {
    const a = document.createElement('a')
    a.href = '/portfolio.pdf'
    a.download = '진정맨_포트폴리오.pdf'
    a.click()
  }
}

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-title">
          <i className="snes-jp-logo site-logo"></i>
          <span className="title-bracket">&gt; </span>
          <span className="title-main">DEV</span>
          <span className="title-accent">LOG</span>
          <span className="title-cursor">_</span>
        </Link>
        <nav className="site-nav">
          <Link href="/" className="nes-btn is-primary nav-btn">HOME</Link>
          <a
            href="https://minecraft-ragai.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="nes-btn nav-btn"
          >
            Game RAG ↗
          </a>
          <a
            href="https://ytchannel-analyze-rag.streamlit.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="nes-btn nav-btn"
          >
            Youtube RAG ↗
          </a>
          <a href="/portfolio.pdf" onClick={handlePortfolioClick} className="nes-btn is-error nav-btn">PORTFOLIO</a>
          <Link href="/search" className="nes-btn is-warning nav-btn">SEARCH</Link>
        </nav>
      </div>
      <hr className="header-divider" />
    </header>
  )
}
