import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, ALL_TOOLS } from '../constants';
import { Tool } from '../types';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.length > 1) {
      const results = ALL_TOOLS.filter(tool =>
        tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleResultClick = (slug: string) => {
    navigate(`/tool/${slug}`);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearchFocused(false);
  };

  const isHomePage = location.pathname === '/';

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <a href="https://simplikitt.com" className="flex items-center space-x-2 group">
              <img src="https://i.imgur.com/GtWkrQE.png" alt="SimpliKitt Logo" className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[10deg]" />
              <span className="text-2xl font-bold text-gray-800 tracking-tight hidden sm:block">SimpliKitt</span>
            </a>
            <nav className="hidden md:flex items-center space-x-1">
              {CATEGORIES.map(category => (
                <div key={category.slug} className="group relative">
                  <Link
                    to={`/category/${category.slug}`}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  >
                    {category.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>
          <div className="flex items-center">
            <div className="relative" ref={searchContainerRef}>
              <input
                type="text"
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-48 lg:w-64 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute mt-2 w-full lg:w-96 max-h-96 overflow-y-auto right-0 bg-white border border-gray-200 rounded-lg shadow-xl">
                  <ul>
                    {searchResults.map(tool => (
                      <li key={tool.slug}>
                        <button
                          onClick={() => handleResultClick(tool.slug)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors"
                        >
                          <p className="font-semibold text-gray-800">{tool.name}</p>
                          <p className="text-sm text-gray-500">{tool.description}</p>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;