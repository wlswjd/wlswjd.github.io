import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: { default: 'DEVLOG_', template: '%s | DEVLOG_' },
  description: '공부 기록, 프로젝트, 일상을 담은 개인 블로그',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <div className="layout-wrapper">
          <Header />
          <Sidebar />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
