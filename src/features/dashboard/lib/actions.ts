'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUserProjects() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to view projects.' };

  const { data: projects, error } = await supabase
    .from('projects')
    .select('id, name, original_image_url, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) return { error: error.message };
  return { projects };
}

export async function deleteProject(projectId: string) {
    const supabase = createClient();
    const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);
    
    if (error) return { success: false, message: error.message };

    revalidatePath('/dashboard'); // Refresh the dashboard data
    return { success: true, message: 'Project deleted successfully.' };
}
