import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CATEGORIES, ALL_TOOLS } from '../constants';
import { Tool } from '../types';
import { MenuIcon, CloseIcon } from './Icons';
import { trackGtagEvent } from '../analytics';

const Header: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Tool[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef<HTMLElement>(null);

  // Close menus on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchFocused(false);
    setSearchQuery('');
  }, [location.pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

  const handleResultClick = (tool: Tool) => {
    trackGtagEvent('tool_click', {
      'tool_name': tool.name,
      'tool_category': tool.category
    });
    navigate(`/tool/${tool.slug}`);
  };

  return (
    <header className="sticky top-0 bg-white/80 backdrop-blur-lg shadow-sm z-50" ref={headerRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2 group">
              <img src="https://i.imgur.com/GtWkrQE.png" alt="SimpliKitt Logo" className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[10deg]" />
              <span className="text-2xl font-bold text-gray-800 tracking-tight hidden sm:block">SimpliKitt</span>
            </Link>
            <nav className="hidden lg:flex items-center space-x-1">
              {CATEGORIES.map(category => (
                <Link
                  key={category.slug}
                  to={`/category/${category.slug}`}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a tool..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                className="w-40 sm:w-48 lg:w-64 px-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {isSearchFocused && searchResults.length > 0 && (
                <div className="absolute mt-2 w-full lg:w-96 max-h-96 overflow-y-auto right-0 bg-white border border-gray-200 rounded-lg shadow-xl">
                  <ul>
                    {searchResults.map(tool => (
                      <li key={tool.slug}>
                        <button
                          onClick={() => handleResultClick(tool)}
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
            <div className="lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <CloseIcon className="block h-6 w-6" />
                ) : (
                  <MenuIcon className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {CATEGORIES.map(category => (
              <Link
                key={category.slug}
                to={`/category/${category.slug}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;