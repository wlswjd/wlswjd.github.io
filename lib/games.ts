export interface GameRating {
  /** 0~5 별점 */
  stars: number
  /** 옆에 표시할 점수 (직접 기입). null이면 — 표시 */
  score: number | null
}

export interface Game {
  slug: string
  title: string
  cover: string
  /** 우측 큰 총점. null이면 — 표시 */
  totalScore: number | null
  ratings: {
    fun: GameRating
    visual: GameRating
    sound: GameRating
    uniqueness: GameRating
    narrative: GameRating
  }
  oneLiner: string
  pros: string
  cons: string
}

const emptyRatings = (): Game['ratings'] => ({
  fun: { stars: 0, score: null },
  visual: { stars: 0, score: null },
  sound: { stars: 0, score: null },
  uniqueness: { stars: 0, score: null },
  narrative: { stars: 0, score: null },
})

function game(
  partial: Pick<Game, 'slug' | 'title' | 'cover'> & Partial<Omit<Game, 'slug' | 'title' | 'cover'>>,
): Game {
  return {
    totalScore: 90, // 임시 점수 — 게임별로 직접 수정
    ratings: emptyRatings(),
    oneLiner: '',
    pros: '',
    cons: '',
    ...partial,
  }
}

/** 게임 QA 목록 — 글/점수는 여기서 직접 수정하면 됨 */
export const GAMES: Game[] = [
  game({ slug: 'dave-the-diver', title: 'Dave the Diver', cover: '/images/games/01-dave-the-diver.png' }),
  game({ slug: 'pubg', title: 'PUBG: Battlegrounds', cover: '/images/games/02-pubg.png' }),
  game({ slug: 'stardew-valley', title: 'Stardew Valley', cover: '/images/games/03-stardew-valley.png' }),
  game({ slug: 'skul', title: 'Skul: The Hero Slayer', cover: '/images/games/04-skul.png' }),
  game({ slug: 'thehunter', title: 'theHunter: Call of the Wild', cover: '/images/games/05-thehunter.png' }),
  game({ slug: 'the-forest', title: 'The Forest', cover: '/images/games/06-the-forest.png' }),
  game({ slug: 'a-way-out', title: 'A Way Out', cover: '/images/games/07-a-way-out.png' }),
  game({ slug: 'witcher-3', title: 'The Witcher 3: Wild Hunt', cover: '/images/games/08-witcher-3.png' }),
  game({ slug: 'vampire-survivors', title: 'Vampire Survivors', cover: '/images/games/09-vampire-survivors.png' }),
  game({ slug: 'battleblock-theater', title: 'BattleBlock Theater', cover: '/images/games/10-battleblock-theater.png' }),
  game({ slug: 'risk-of-rain-2', title: 'Risk of Rain 2', cover: '/images/games/11-risk-of-rain-2.png' }),
  game({ slug: 'elden-ring', title: 'Elden Ring', cover: '/images/games/12-elden-ring.png' }),
  game({ slug: 'raft', title: 'Raft', cover: '/images/games/13-raft.png' }),
  game({ slug: 'bioshock-remastered', title: 'BioShock Remastered', cover: '/images/games/14-bioshock-remastered.png' }),
  game({ slug: 'god-of-war', title: 'God of War', cover: '/images/games/15-god-of-war.png' }),
  game({ slug: 'bioshock-infinite', title: 'BioShock Infinite', cover: '/images/games/16-bioshock-infinite.png' }),
  game({ slug: 'dont-starve-together', title: "Don't Starve Together", cover: '/images/games/17-dont-starve-together.png' }),
  game({ slug: 'enshrouded', title: 'Enshrouded', cover: '/images/games/18-enshrouded.png' }),
  game({ slug: 'baldurs-gate-3', title: "Baldur's Gate 3", cover: '/images/games/19-baldurs-gate-3.png' }),
  game({ slug: 'dark-and-darker', title: 'Dark and Darker', cover: '/images/games/20-dark-and-darker.png' }),
  game({ slug: 'metal-slug-3', title: 'Metal Slug 3', cover: '/images/games/21-metal-slug-3.png' }),
]

export const RATING_LABELS: { key: keyof Game['ratings']; label: string }[] = [
  { key: 'fun', label: 'Fun Factor' },
  { key: 'visual', label: 'Visual Design' },
  { key: 'sound', label: 'Sound Design' },
  { key: 'uniqueness', label: 'Uniqueness / Creativity' },
  { key: 'narrative', label: 'Narrative Design' },
]

export function getGameBySlug(slug: string): Game | undefined {
  return GAMES.find(g => g.slug === slug)
}

export function getAllGameSlugs(): string[] {
  return GAMES.map(g => g.slug)
}
