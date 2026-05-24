import FloatingBackground from '@/src/components/ui/FloatingBackground'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg)',
      padding: 24,
      position: 'relative',
    }}>
      <FloatingBackground density="minimal" />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 420 }}>
        {children}
      </div>
    </div>
  )
}
