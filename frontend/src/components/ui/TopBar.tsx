import type { ReactNode } from 'react';

export interface TopBarProps {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}

export default function TopBar({ title, subtitle, right }: TopBarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '28px 40px 18px', gap: 24,
    }}>
      <div>
        <h1 className="serif" style={{ fontSize: 30, fontWeight: 400, fontStyle: 'italic', color: 'var(--ink)' }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{ marginTop: 6, color: 'var(--ink-muted)', fontSize: 14 }}>{subtitle}</div>
        )}
      </div>
      {right && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>{right}</div>
      )}
    </div>
  );
}
