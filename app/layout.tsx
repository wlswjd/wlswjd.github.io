import type { Metadata } from 'next'
import './globals.css'
import './diary.css'
import DiaryFrame from '@/components/diary/DiaryFrame'
import NavigationProgress from '@/components/NavigationProgress'
import ScrollToTop from '@/components/ScrollToTop'

export const metadata: Metadata = {
  title: { default: 'DEVLOG_', template: '%s | DEVLOG_' },
  description: '공부 기록, 프로젝트, 일상을 담은 개인 블로그',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        <DiaryFrame>{children}</DiaryFrame>
        <ScrollToTop />
      </body>
    </html>
  )
}
