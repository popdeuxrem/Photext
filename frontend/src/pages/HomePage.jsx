import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <h1 className="text-5xl font-bold mb-4 text-gray-800">PhoText AI</h1>
      <p className="text-xl mb-8 text-gray-600">
        The revolutionary AI-powered image text editor.
      </p>
      <div className="space-x-4">
        <Button asChild size="lg">
          <Link to="/editor">Start Editing as Guest</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to="/auth">Sign In / Sign Up</Link>
        </Button>
      </div>
      <div className="mt-16 max-w-4xl">
        <h2 className="text-3xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside text-left mx-auto max-w-md text-gray-700">
          <li>🖼️ Upload an image and let our AI find the text.</li>
          <li>✏️ Edit text directly on the image with a simple canvas editor.</li>
          <li>🤖 Use AI to rewrite sentences or check grammar instantly.</li>
          <li>💾 Save your projects to the cloud and continue anytime.</li>
          <li>🚀 Export your final creation in high resolution.</li>
        </ul>
      </div>
    </div>
  );
}
