import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4 group">
              <img src="https://i.imgur.com/GtWkrQE.png" alt="SimpliKitt Logo" className="h-8 w-8 transition-transform duration-300 group-hover:rotate-[10deg]" />
              <span className="font-bold text-xl text-gray-800">SimpliKitt</span>
            </Link>
            <p className="text-sm text-gray-500">
              Free, instant, client-side tools to simplify your digital life. Your privacy is our priority.
            </p>
          </div>
          <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-8">
            {CATEGORIES.slice(0, 4).map(category => (
              <div key={category.slug}>
                <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{category.name}</h3>
                <ul className="mt-4 space-y-2">
                  {category.tools.slice(0, 4).map(tool => (
                    <li key={tool.slug}>
                      <Link to={`/tool/${tool.slug}`} className="text-base text-gray-500 hover:text-gray-900">
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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