import React from 'react';
import { Link } from 'react-router-dom';
import { Tool, Category } from '../types';

interface ToolCardProps {
  tool: Tool;
  category: Category;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, category }) => {
  const { slug, name, description, icon: Icon } = tool;
  const { color, accentColor } = category;
  
  return (
    <Link to={`/tool/${slug}`} className="group flex items-start space-x-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-transparent hover:border-blue-200">
      <div className={`flex-shrink-0 w-10 h-10 ${color} rounded-lg flex items-center justify-center`}>
        <Icon className={`w-6 h-6 ${accentColor}`} />
      </div>
      <div>
        <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{name}</h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
    </Link>
  );
};

export default ToolCard;
