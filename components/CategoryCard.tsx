import React from 'react';
import { Link } from 'react-router-dom';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  const { slug, name, description, icon, cardColor } = category;

  return (
    <Link
      to={`/category/${slug}`}
      className={`group relative block h-full ${cardColor} rounded-2xl p-4 flex flex-col overflow-hidden transition-transform transform hover:-translate-y-1 shadow-lg hover:shadow-xl`}
    >
      <div className="flex-1 flex items-center justify-center mb-4">
        <img src={icon} alt={`${name} icon`} className="w-16 h-16 object-contain" />
      </div>

      <div className="bg-white rounded-xl p-4">
        <h3 className="font-bold text-gray-800 text-base truncate">{name}</h3>
        <p className="text-sm text-gray-500 mt-1 h-10 leading-tight overflow-hidden">{description}</p>
      </div>
    </Link>
  );
};

export default CategoryCard;