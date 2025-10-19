
import React from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES, POPULAR_TOOLS } from '../constants';
import CategoryCard from '../components/CategoryCard';
import ToolCard from '../components/ToolCard';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight">
          Instant, No-Cost Digital Tools
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
          Solve everyday digital problems with our suite of free, private, and browser-based utilities. No uploads, no sign-ups, just instant results.
        </p>
        <div className="mt-8">
          <Link 
            to="/tools"
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-full hover:bg-blue-700 transition-transform transform hover:scale-105"
          >
            Explore All Tools
          </Link>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>

      {/* Popular Tools Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Our Most Popular Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {POPULAR_TOOLS.map(tool => {
            const category = CATEGORIES.find(c => c.name === tool.category);
            if (!category) return null;
            return <ToolCard key={tool.slug} tool={tool} category={category} />;
          })}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
