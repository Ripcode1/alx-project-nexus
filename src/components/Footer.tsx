import Link from 'next/link';
import { FiGithub, FiExternalLink } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-espresso-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer content */}
        <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-serif text-xl font-bold text-cream/90 mb-2">Store</p>
            <p className="text-sm text-espresso-300 leading-relaxed max-w-xs">
              A curated e-commerce catalog built with Next.js, TypeScript, Redux, and Tailwind CSS.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-xs font-semibold text-cream/60 uppercase tracking-wider mb-3">Shop</h3>
            <div className="space-y-2">
              <Link href="/products" className="block text-sm text-espresso-300 hover:text-cream transition-colors duration-200">All products</Link>
              <Link href="/cart" className="block text-sm text-espresso-300 hover:text-cream transition-colors duration-200">Shopping bag</Link>
              <Link href="/orders" className="block text-sm text-espresso-300 hover:text-cream transition-colors duration-200">Order history</Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="text-xs font-semibold text-cream/60 uppercase tracking-wider mb-3">Account</h3>
            <div className="space-y-2">
              <Link href="/login" className="block text-sm text-espresso-300 hover:text-cream transition-colors duration-200">Log in</Link>
              <Link href="/register" className="block text-sm text-espresso-300 hover:text-cream transition-colors duration-200">Create account</Link>
              <Link href="/profile" className="block text-sm text-espresso-300 hover:text-cream transition-colors duration-200">Profile</Link>
            </div>
          </div>

          {/* Project links */}
          <div>
            <h3 className="text-xs font-semibold text-cream/60 uppercase tracking-wider mb-3">Project</h3>
            <div className="space-y-2">
              <a href="https://github.com/Ripcode1/alx-project-nexus" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-espresso-300 hover:text-cream transition-colors duration-200">
                <FiGithub size={13} /> GitHub repo
              </a>
              <a href="https://ecommerce-api-wp9c.onrender.com/api/docs/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-espresso-300 hover:text-cream transition-colors duration-200">
                <FiExternalLink size={13} /> API docs
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-espresso-700/50 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-espresso-400">
            &copy; {new Date().getFullYear()} ALX ProDev Project · Built by Jason Rippon
          </p>
          <div className="flex items-center gap-1.5 text-xs text-espresso-400">
            <span>Next.js</span>
            <span className="w-1 h-1 rounded-full bg-espresso-600" />
            <span>TypeScript</span>
            <span className="w-1 h-1 rounded-full bg-espresso-600" />
            <span>Redux</span>
            <span className="w-1 h-1 rounded-full bg-espresso-600" />
            <span>Tailwind</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
