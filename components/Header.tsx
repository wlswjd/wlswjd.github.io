import Link from 'next/link'

export default function Header() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-title">
          <span className="title-bracket">&gt; </span>
          <span className="title-main">DEV</span>
          <span className="title-accent">LOG</span>
          <span className="title-cursor">_</span>
        </Link>
        <nav className="site-nav">
          <Link href="/" className="nes-btn is-primary nav-btn">
            HOME
          </Link>
          <Link href="/category/study" className="nes-btn nav-btn">
            STUDY
          </Link>
          <Link href="/category/project" className="nes-btn nav-btn">
            PROJECT
          </Link>
        </nav>
      </div>
      <hr className="header-divider" />
    </header>
  )
}
