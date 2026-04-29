export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <hr className="footer-divider" />
      <div className="footer-inner">
        <span className="nes-text is-disabled">
          © {year} DEVLOG_ — Built with Next.js &amp; NES.css
        </span>
        <div className="footer-icons">
          <span className="nes-icon heart is-small"></span>
        </div>
      </div>
    </footer>
  )
}
