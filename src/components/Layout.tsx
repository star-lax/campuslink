import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

type AppRole = 'admin' | 'teacher' | 'student';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [role, setRole] = useState<AppRole>('admin');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-base)' }}>
      <Sidebar role={role} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <TopBar role={role} onRoleChange={setRole} />
        <main
          className="main-content"
          id="main-content"
          style={{ flex: 1 }}
        >
          <div className="page-container">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
