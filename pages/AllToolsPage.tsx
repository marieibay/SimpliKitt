import React, { useEffect } from 'react';
import { CATEGORIES } from '../constants';
import ToolCard from '../components/ToolCard';
import { updateMetaTags, resetMetaTags } from '../utils/meta';


const AllToolsPage: React.FC = () => {
  useEffect(() => {
    const title = 'All Tools - SimpliKitt';
    const description = 'Browse the complete collection of free, instant, and privacy-first digital utilities for images, text, PDF, files, and development. All tools run in your browser.';
    updateMetaTags(title, description);

    return () => {
      resetMetaTags();
    };
  }, []);

  return (
    <div>
      <div className="text-center pt-8 pb-12">
        <h1 className="text-4xl font-extrabold text-gray-900">All Tools</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600">
          Browse our complete collection of free, privacy-first digital utilities.
        </p>
      </div>
      
      <div className="space-y-12">
        {CATEGORIES.map(category => (
          <section key={category.slug}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map(tool => (
                <ToolCard key={tool.slug} tool={tool} category={category} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default AllToolsPage;