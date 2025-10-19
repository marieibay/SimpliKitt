
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Footer: React.FC = () => {
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms of Service', path: '/tos' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <img src="https://i.imgur.com/GtWkrQE.png" alt="SimpliKitt Logo" className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[10deg]" />
              <span className="font-bold text-xl text-gray-800">SimpliKitt</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-md">
              Free, instant, client-side tools to simplify your digital life. Your privacy is our priority, so your data never leaves your browser.
            </p>
          </div>
          <div className="col-span-1">
             <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Navigate</h3>
              <ul className="mt-4 space-y-2">
                {navLinks.map(link => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-base text-gray-500 hover:text-gray-900">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
          </div>
           <div className="col-span-1">
             <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Top Categories</h3>
              <ul className="mt-4 space-y-2">
                {CATEGORIES.slice(0, 5).map(category => (
                  <li key={category.slug}>
                    <Link to={`/category/${category.slug}`} className="text-base text-gray-500 hover:text-gray-900">
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-8 text-center">
          <p className="text-base text-gray-400">&copy; {new Date().getFullYear()} SimpliKitt. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
