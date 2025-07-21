'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/shared/lib/supabase/client';
import { useEffect } from 'react';
import { useUser } from '../hooks/useUser';
import { useRouter } from 'next/navigation';

export function AuthUI() {
  const supabase = createClient();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    // If the user is already logged in, redirect them to the dashboard.
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  return (
    <div className="w-full max-w-md">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google', 'github']}
        redirectTo={`${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`}
        socialLayout="horizontal"
      />
    </div>
  );
}
