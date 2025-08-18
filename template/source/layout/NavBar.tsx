export const NavBar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold text-white">Arfa JS</h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://www.npmjs.com/package/create-arfa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              npm
            </a>
            <a
              href="https://github.com/wixarm/Arfa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white text-sm transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};
