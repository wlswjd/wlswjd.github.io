// 지금 듣는 노래 (프로토타입: 정적 카드).
// 앨범 커버 이미지를 쓰려면 public/images/ 에 파일을 넣고 cover 에 경로를 적으면 된다.
export const NOW_PLAYING = {
  title: "(What's the Story) Morning Glory?",
  artist: 'Oasis',
  meta: '1995 · Britpop · Rock',
  runtime: '50분 06초',
  tracks: 12,
  cover: '' as string, // 예: '/images/now-playing.jpg'
}

// 홈의 Now Playing 자리: 지금은 빈 상자만 남겨둔다 (노래 제목은 왼쪽 프로필 상단에 표시).
export default function NowPlaying() {
  return <div className="now-playing is-empty" aria-hidden="true" />
}
