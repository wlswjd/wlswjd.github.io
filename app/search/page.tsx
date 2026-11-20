import GameClient from '@/components/GameClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'GAME' }

export default function GamePage() {
  return <GameClient />
}
