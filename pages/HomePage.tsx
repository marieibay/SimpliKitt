import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import CategoryCard from '../components/CategoryCard';

const HomePage: React.FC = () => {
  useEffect(() => {
    document.title = 'SimpliKitt - Instant, No-Cost Digital Tools';
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'A web-based suite of free, instant, and privacy-first digital tools. All tools run exclusively in your browser, ensuring your data remains private. SimpliKitt offers simple solutions for common digital problems without requiring software installation or account creation.');
    }
  }, []);

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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {CATEGORIES.map(category => (
            <CategoryCard key={category.slug} category={category} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;