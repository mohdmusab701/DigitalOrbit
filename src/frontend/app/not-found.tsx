import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-2xl mb-8">
        <span className="text-4xl font-black">404</span>
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
        Page Not Found
      </h1>
      <p className="text-lg text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary-600/25"
      >
        <Home className="w-5 h-5" />
        Back to Home
      </Link>
    </div>
  );
}
