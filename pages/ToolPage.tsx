
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ALL_TOOLS, CATEGORIES } from '../constants';
import { trackEvent } from '../analytics';
import { updateMetaTags, resetMetaTags } from '../utils/meta';

const ToolPage: React.FC = () => {
  const { toolSlug } = useParams<{ toolSlug: string }>();
  const tool = ALL_TOOLS.find(t => t.slug === toolSlug);

  useEffect(() => {
    if (tool) {
      updateMetaTags(`${tool.name} - SimpliKitt`, tool.description);
      trackEvent('tool_viewed', { toolName: tool.name, toolSlug: tool.slug });
    }

    return () => {
      resetMetaTags();
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

  const relatedTools = category
    ? category.tools
        .filter(t => t.slug !== tool.slug)
        .sort(() => 0.5 - Math.random()) // Shuffle to show different tools on each load
        .slice(0, 4)
    : [];

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
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">How {name} Works</h2>
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

      {relatedTools.length > 0 && category && (
        <div className="mt-16 pt-10 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">You Might Also Like</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedTools.map(relatedTool => {
                const { icon: RelatedIcon } = relatedTool;
                return (
                    <Link to={`/tool/${relatedTool.slug}`} key={relatedTool.slug} className="group block h-full">
                        <div className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200/80 overflow-hidden text-center p-5 items-center justify-start">
                            <div className={`flex-shrink-0 w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mb-3`}>
                            <RelatedIcon className={`w-7 h-7 ${category.accentColor}`} />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-tight">{relatedTool.name}</h3>
                            <p className="mt-2 text-xs text-gray-500">{relatedTool.description}</p>
                        </div>
                    </Link>
                )
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ToolPage;
