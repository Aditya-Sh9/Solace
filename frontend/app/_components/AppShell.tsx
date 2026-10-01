'use client'

import { usePathname, useRouter } from 'next/navigation'
import { ViewTransition, type ReactNode } from 'react'
import TopNav from '@/src/components/ui/TopNav'
import BottomNav from '@/src/components/ui/BottomNav'
import ThemePicker from '@/src/components/ui/ThemePicker'
import { useAuth } from '@/src/hooks/use-auth'
import { useTheme } from '@/src/hooks/use-theme'
import { CycleAccessContext, useCycleAccessFetch } from '@/src/hooks/use-cycle-access'

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { user, signOut } = useAuth()
  const { theme, mode, setTheme, setMode } = useTheme()
  const cycleAccess = useCycleAccessFetch()
  // Hidden until known, so someone without access never sees it flash in.
  const showWellness = cycleAccess === true

  const screen      = pathname.split('/')[1] || 'dashboard'
  const profileName = user?.user_metadata?.name || user?.email?.split('@')[0] || ''

  const handleLogout = async () => {
    await signOut()
    router.refresh() // let proxy.ts see the cleared session before navigating
    router.push('/login')
  }

  return (
    <CycleAccessContext.Provider value={cycleAccess}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <div className="desktop-nav">
          <TopNav
            screen={screen}
            setScreen={id => router.push(`/${id}`)}
            profileName={profileName}
            themePicker={<ThemePicker theme={theme} mode={mode} setTheme={setTheme} setMode={setMode} />}
            onLogout={handleLogout}
            showWellness={showWellness}
          />
        </div>

        <main className="app-main">
          {/* Keyed by route so each tab change is an exit + enter pair that the
              browser crossfades (CSS: .ink-page in globals.css). default="none"
              keeps unrelated transitions (e.g. range-filter fetches) still. */}
          <ViewTransition key={pathname} enter="ink-page" exit="ink-page" default="none">
            <div>{children}</div>
          </ViewTransition>
        </main>

        <BottomNav showWellness={showWellness} />
      </div>
    </CycleAccessContext.Provider>
  )
}
