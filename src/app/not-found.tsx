import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-serif text-espresso-200 mb-4">404</p>
        <h1 className="font-serif text-2xl text-espresso-800 mb-2">Page not found</h1>
        <p className="text-sm text-espresso-400 mb-6 max-w-sm mx-auto">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-espresso-800 text-cream px-6 py-3 rounded-full text-sm font-semibold hover:bg-espresso-700 transition-colors"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}
