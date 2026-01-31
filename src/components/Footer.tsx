export default function Footer() {
  return (
    <footer className="bg-espresso-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="font-serif text-lg font-bold text-cream/90">E-Commerce Catalog</p>
            <p className="text-sm text-espresso-300 mt-1">&copy; {new Date().getFullYear()} ALX ProDev Project</p>
          </div>
          <div className="flex gap-6 text-sm text-espresso-300">
            <a href="https://github.com/Ripcode1/alx-project-nexus" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">GitHub</a>
            <a href="https://ecommerce-api-wp9c.onrender.com/api/docs/" target="_blank" rel="noopener noreferrer" className="hover:text-cream transition-colors">API</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
