import { getAllPostMetas } from '@/lib/posts'
import SearchClient from '@/components/SearchClient'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'SEARCH' }

export default function SearchPage() {
  const posts = getAllPostMetas()
  return <SearchClient posts={posts} />
}
