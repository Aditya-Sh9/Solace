'use client'

import { usePathname, useRouter } from 'next/navigation'
import NavPill from './NavPill'
import { Icon } from './Icons'
import type { NavItem } from './NavPill'

const NAV_ITEMS: (NavItem & { href: string })[] = [
  { id: 'dashboard', label: 'Home',     href: '/dashboard', icon: <Icon.Home    size={20} /> },
  { id: 'checkin',   label: 'Check in', href: '/checkin',   icon: <Icon.Check   size={20} /> },
  { id: 'journal',   label: 'Journal',  href: '/journal',   icon: <Icon.Journal size={20} /> },
  { id: 'insights',  label: 'Insights', href: '/insights',  icon: <Icon.Flower  size={20} /> },
]

const TILTS = [-0.5, 0.4, -0.3, 0.5]

export default function BottomNav() {
  const pathname = usePathname()
  const router   = useRouter()

  return (
    <nav
      className="mobile-nav"
      // No display property here — CSS .mobile-nav controls visibility:
      //   desktop: display: none  |  mobile ≤767px: display: flex
      style={{
        position: 'fixed',
        bottom: 0, left: 0, right: 0,
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '8px 4px 12px',
        background: 'var(--surface)',
        borderTop: '1px solid var(--ink-border)',
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item, i) => (
        <NavPill
          key={item.id}
          item={item}
          active={pathname.startsWith(item.href)}
          onClick={() => router.push(item.href)}
          tilt={TILTS[i]}
        />
      ))}
    </nav>
  )
}
