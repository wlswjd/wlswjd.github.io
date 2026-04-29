export default function Loading() {
  return (
    <div className="page-loading">
      <div className="nes-container page-loading-box">
        <p className="page-loading-text">LOADING...</p>
        <progress className="nes-progress is-primary" value="70" max="100" />
      </div>
    </div>
  )
}
