import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { LoginSplash } from '@/components/auth/LoginSplash';

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  if (session) {
    redirect('/dashboard');
  }

  return <LoginSplash />;
}
