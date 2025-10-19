import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { ALL_TOOLS, CATEGORIES } from '../constants';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const getBackLink = (): string | null => {
    const { pathname } = location;

    if (pathname.startsWith('/tool/')) {
      const toolSlug = pathname.split('/')[2];
      const tool = ALL_TOOLS.find(t => t.slug === toolSlug);
      if (tool) {
        const category = CATEGORIES.find(c => c.name === tool.category);
        if (category) {
          return `/category/${category.slug}`;
        }
      }
      // Fallback for a tool without a category or if lookups fail
      return '/tools';
    }

    const infoPages = ['/about', '/contact', '/privacy', '/tos'];
    if (pathname.startsWith('/category/') || pathname === '/tools' || infoPages.includes(pathname)) {
      return '/';
    }

    return null;
  };

  const backLink = getBackLink();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {backLink && (
          <div className="mb-6">
            <Link
              to={backLink}
              className="inline-flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors group"
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back</span>
            </Link>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
