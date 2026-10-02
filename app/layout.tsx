import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import Footer from '@/components/Footer'
import NavigationProgress from '@/components/NavigationProgress'
import ScrollToTop from '@/components/ScrollToTop'
import { getAllTags } from '@/lib/posts'

export const metadata: Metadata = {
  title: { default: 'DEVLOG_', template: '%s | DEVLOG_' },
  description: '공부 기록, 프로젝트, 일상을 담은 개인 블로그',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const tags = getAllTags()

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <NavigationProgress />
        <div className="layout-wrapper">
          <Header />
          <Sidebar tags={tags} />
          <main className="main-content">{children}</main>
          <Footer />
        </div>
        <ScrollToTop />
      </body>
    </html>
  )
}
