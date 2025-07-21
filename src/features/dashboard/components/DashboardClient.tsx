'use client';

import { useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { ProjectCard } from './ProjectCard';
import { EmptyState } from './EmptyState';
// TODO: Create and import these server actions
// import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';

type Project = { id: string; name: string; original_image_url: string; updated_at: string };

export function DashboardClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Mock data fetching
    // TODO: Replace with server action: const userProjects = await getUserProjects();
    setTimeout(() => {
        setProjects([]); // Start with empty state for demo
        setIsLoading(false);
    }, 1000);
  }, []);

  const handleDelete = async (projectId: string) => {
    // TODO: Implement deleteProject server action
    toast({ title: 'Delete Clicked', description: 'Delete functionality to be implemented.' });
  };

  if (isLoading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Projects</h1>
        <Button asChild><Link href="/editor/new">Create New Project</Link></Button>
      </div>
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map(p => <ProjectCard key={p.id} project={p} onDelete={handleDelete} />)}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
