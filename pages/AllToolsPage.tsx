import React, { useEffect } from 'react';
import { CATEGORIES } from '../constants';
import ToolCard from '../components/ToolCard';

const defaultTitle = 'SimpliKitt - Instant, No-Cost Digital Tools';
const defaultDescription = 'A web-based suite of free, instant, and privacy-first digital tools. All tools run exclusively in your browser, ensuring your data remains private. SimpliKitt offers simple solutions for common digital problems without requiring software installation or account creation.';


const AllToolsPage: React.FC = () => {
  useEffect(() => {
    const title = 'All Tools - SimpliKitt';
    const description = 'Browse the complete collection of free, instant, and privacy-first digital utilities for images, text, PDF, files, and development. All tools run in your browser.';
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    }

    return () => {
      document.title = defaultTitle;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription);
      }
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