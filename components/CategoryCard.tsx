
import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { slug, name, description, icon: Icon, color, accentColor } = category;

  return (
    <Link to={`/category/${slug}`} className="group block p-6 bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow duration-300">
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className={`w-7 h-7 ${accentColor}`} />
      </div>
      <h3 className="text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{name}</h3>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </Link>
  );
};

export default CategoryCard;
