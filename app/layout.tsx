import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import NavigationProgress from '@/components/NavigationProgress'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = {
  title: { default: 'DEVLOG_', template: '%s | DEVLOG_' },
  description: '공부 기록, 프로젝트, 일상을 담은 개인 블로그',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tags = getAllTags()

  return (
    <html lang="ko">
      <body>
        <NavigationProgress />
        <div className="layout-wrapper">
          <Header />
          <Sidebar tags={tags} />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
