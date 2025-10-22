import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import ToolCard from '../components/ToolCard';
import { updateMetaTags, resetMetaTags } from '../utils/meta';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = CATEGORIES.find(c => c.slug === categorySlug);

  useEffect(() => {
    if (category) {
      updateMetaTags(`${category.name} - SimpliKitt`, category.description);
    }

    return () => {
      resetMetaTags();
    };
  }, [category]);


  if (!category) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-bold">Category not found</h1>
        <p className="text-gray-600 mt-2">The category you're looking for doesn't exist.</p>
        <Link to="/" className="mt-6 inline-block bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg">
          Back to Home
        </Link>
      </div>
    );
  }

  const { name, description, icon, cardColor, tools, userQuestions } = category;

  return (
    <div>
      <div className="text-center pt-8 pb-12">
        <div className={`w-20 h-20 ${cardColor} rounded-2xl flex items-center justify-center mx-auto mb-4 p-3`}>
          <img src={icon} alt={`${name} icon`} className="w-full h-full object-contain" />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">{name}</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600">{description}</p>
      </div>
      
      {userQuestions && userQuestions.length > 0 && (
        <div className="mb-12 max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">Common Questions</h2>
            <ul className="list-none space-y-3">
                {userQuestions.map((question, index) => (
                    <li key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex items-center">
                        <svg className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-gray-700">{question}</span>
                    </li>
                ))}
            </ul>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <ToolCard key={tool.slug} tool={tool} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
