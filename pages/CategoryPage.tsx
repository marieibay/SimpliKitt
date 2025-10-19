
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import ToolCard from '../components/ToolCard';
import { ChevronDownIcon } from '../components/Icons';

const CategoryPage: React.FC = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const category = CATEGORIES.find(c => c.slug === categorySlug);

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

  const { name, description, icon: Icon, color, accentColor, tools } = category;

  return (
    <div>
      <div className="text-center pt-8 pb-12">
        <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
          <Icon className={`w-9 h-9 ${accentColor}`} />
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900">{name}</h1>
        <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-600">{description}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map(tool => (
          <ToolCard key={tool.slug} tool={tool} category={category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryPage;
