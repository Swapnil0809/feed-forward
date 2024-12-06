import React from 'react';

function Header() {
  return (
    <div>
      <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white/80 shadow-md z-50 fixed top-0 left-0 w-full">
        <nav className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <span className="text-2xl sm:text-3xl font-extrabold text-green-600 tracking-wide ">
              FeedForward
            </span>
          </div>
        </nav>
      </header>
    </div>
  );
}

export default Header;
