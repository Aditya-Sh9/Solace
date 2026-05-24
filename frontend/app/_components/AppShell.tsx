'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { ReactNode } from 'react'
import TopNav from '@/src/components/ui/TopNav'
import BottomNav from '@/src/components/ui/BottomNav'
import ThemePicker from '@/src/components/ui/ThemePicker'
import { useAuth } from '@/src/hooks/use-auth'
import { useTheme } from '@/src/hooks/use-theme'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { user } = useAuth()
  const { theme, mode, setTheme, setMode } = useTheme()

  const screen      = pathname.split('/')[1] || 'dashboard'
  const profileName = user?.user_metadata?.name || user?.email?.split('@')[0] || ''

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <div className="desktop-nav">
        <TopNav
          screen={screen}
          setScreen={id => router.push(`/${id}`)}
          profileName={profileName}
          themePicker={<ThemePicker theme={theme} mode={mode} setTheme={setTheme} setMode={setMode} />}
        />
      </div>

      <main className="app-main">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
