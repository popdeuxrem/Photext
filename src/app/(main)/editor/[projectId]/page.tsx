import { EditorClient } from '@/features/editor/components/EditorClient';
import { notFound } from 'next/navigation';

type EditorPageProps = {
  params: {
    projectId: string;
  };
};

// This page fetches initial project data on the server.
// For a new project, we can pass default values.
export default async function EditorPage({ params }: EditorPageProps) {
  const { projectId } = params;

  // In a real application, you would fetch project data here using a server action
  // and pass it to the client component. If not found, you'd call notFound().
  // For now, we'll assume the project exists or is new.
  
  if (!projectId) {
    return notFound();
  }

  return <EditorClient projectId={projectId} initialProjectData={null} />;
}
