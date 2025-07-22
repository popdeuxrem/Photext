'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

/**
 * Signs out the currently authenticated user and redirects to the login page.
 */
export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Error signing out:', error);
    // Optionally redirect to an error page or show a toast
    return redirect('/?error=Could not sign out');
  }

  return redirect('/auth');
}

/**
 * Retrieves the current user from the server-side session.
 * @returns The user object or null if not authenticated.
 */
export async function getCurrentUser() {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    try {
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
    }
}
