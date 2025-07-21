'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';
import { useToast } from '@/shared/components/ui/use-toast';
import { getUserProjects, deleteProject } from '@/features/dashboard/lib/actions';
import { ProjectCard } from '@/features/dashboard/components/ProjectCard';
import { EmptyState } from '@/features/dashboard/components/EmptyState';

// Define a type for our project for type safety
type Project = {
  id: string;
  name: string;
  original_image_url: string;
  updated_at: string;
};

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function loadProjects() {
      setIsLoading(true);
      const userProjects = await getUserProjects();
      setProjects(userProjects);
      setIsLoading(false);
    }
    loadProjects();
  }, []);

  const handleDelete = async (projectId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this project?")) return;

    startTransition(async () => {
      const result = await deleteProject(projectId);
      if (result.success) {
        setProjects(projects.filter(p => p.id !== projectId));
        toast({ title: 'Success', description: result.message });
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    });
  };

  if (isLoading) {
    return <div className="p-8">Loading projects...</div>;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link href="/editor/new">Create New Project</Link>
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {projects.map(project => (
            <ProjectCard key={project.id} project={project} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
