import { notFound } from 'next/navigation'
import GameDetail from '@/components/GameDetail'
import { getAllGameSlugs, getGameBySlug } from '@/lib/games'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllGameSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const game = getGameBySlug(slug)
  if (!game) return {}
  return { title: `${game.title} | GAME` }
}

export default async function GameDetailPage({ params }: Props) {
  const { slug } = await params
  const game = getGameBySlug(slug)
  if (!game) notFound()
  return <GameDetail game={game} />
}
