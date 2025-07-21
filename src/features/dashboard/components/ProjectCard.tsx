'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Button } from '@/shared/components/ui/button';
import { MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type ProjectCardProps = {
    project: { id: string; name: string; original_image_url: string; updated_at: string };
    onDelete: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const lastUpdated = new Date(project.updated_at).toLocaleDateString();

  return (
    <Card className="flex flex-col">
      <CardHeader className="p-4"><CardTitle>{project.name}</CardTitle></CardHeader>
      <CardContent className="p-0 flex-grow">
        <Link href={`/editor/${project.id}`}>
          <div className="aspect-video bg-gray-100 relative"><Image src={project.original_image_url} alt={project.name} fill /></div>
        </Link>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-xs text-gray-500">Updated: {lastUpdated}</p>
        <Button variant="destructive" size="sm" onClick={() => onDelete(project.id)}>Delete</Button>
      </CardFooter>
    </Card>
  );
}
