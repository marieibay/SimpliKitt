import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_TOOLS, CATEGORIES } from '../constants';
import { trackEvent } from '../analytics';

const defaultTitle = 'SimpliKitt - Instant, No-Cost Digital Tools';
const defaultDescription = 'A web-based suite of free, instant, and privacy-first digital tools. All tools run exclusively in your browser, ensuring your data remains private. SimpliKitt offers simple solutions for common digital problems without requiring software installation or account creation.';

const ToolPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const tool = ALL_TOOLS.find(t => t.slug === toolSlug);

  useEffect(() => {
    if (tool) {
      document.title = `${tool.name} - SimpliKitt`;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', tool.description);
      }
      trackEvent('tool_viewed', { toolName: tool.name, toolSlug: tool.slug });
    }

    return () => {
      document.title = defaultTitle;
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', defaultDescription);
      }
    };
  }, [tool]);

  if (!tool) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Tool not found</h1>
        <p className="text-gray-600 mt-2">The tool you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.name === tool.category);
  const { name, description, component: ToolComponent, icon: ToolIcon, instructions } = tool;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        {category && (
            <Link to={`/category/${category.slug}`} className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.color} ${category.accentColor} mb-4`}>
                {category.name}
            </Link>
        )}
        <div className="flex justify-center items-center gap-3">
          {category && ToolIcon && (
            <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center`}>
              <ToolIcon className={`w-7 h-7 ${category.accentColor}`} />
            </div>
          )}
          <h1 className="text-4xl font-extrabold text-gray-900">{name}</h1>
        </div>
        <p className="mt-4 text-lg text-gray-600">{description}</p>
      </div>
      
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg">
        <ToolComponent />
      </div>

      {instructions && (
        <div className="mt-10 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">How It Works</h2>
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 max-w-2xl mx-auto">
            <ol className="list-decimal list-inside space-y-3 text-gray-700 leading-relaxed">
              {instructions.split('\n').map((line, index) => (
                <li key={index}>
                  {line.replace(/^\d+\.\s*/, '')}
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPage;