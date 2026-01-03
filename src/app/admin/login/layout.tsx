import { redirect } from 'next/navigation';
import { isAuthenticated } from '@/lib/auth';

export default async function LoginLayout({ children }: { children: React.ReactNode }) {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/admin/dashboard');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--background-alternative)',
        width: '100%',
        margin: 0,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </div>
  );
}
