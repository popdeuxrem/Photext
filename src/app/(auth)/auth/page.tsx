import { AuthUI } from '@/features/authentication/components/AuthUI';
import { siteConfig } from '@/shared/config/site';

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Welcome to {siteConfig.name}</h1>
                <p className="text-gray-500 mt-2">Sign in or create an account to continue</p>
            </div>
            <AuthUI />
        </div>
    </div>
  );
}
