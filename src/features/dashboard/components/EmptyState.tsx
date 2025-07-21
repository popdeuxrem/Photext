import { Button } from '@/shared/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <h3 className="text-lg font-medium">No projects created</h3>
      <p className="mt-1 text-sm text-gray-500">Get started by creating a new one.</p>
      <div className="mt-6">
        <Button asChild><Link href="/editor/new"><PlusCircle className="mr-2 h-4 w-4" />Create Project</Link></Button>
      </div>
    </div>
  );
}
