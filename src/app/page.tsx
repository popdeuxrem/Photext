import Link from 'next/link';
import { Button } from '@/shared/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h1 className="text-5xl font-bold mb-4 text-gray-800">Welcome to phoTextAI</h1>
      <p className="text-xl mb-8 text-gray-600">
        The revolutionary AI-powered image text editor.
      </p>
      <div className="space-x-4">
        <Button asChild size="lg">
          <Link href="/editor/new">Start Editing</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link href="/auth">Sign In / Sign Up</Link>
        </Button>
      </div>
    </div>
  );
}
