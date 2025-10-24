import React from 'react';
import { Link } from 'react-router-dom';
import { Tool, Category } from '../types';
import { trackGtagEvent } from '../analytics';

interface ToolCardProps {
  tool: Tool;
  category: Category;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, category }) => {
  const { slug, name, description } = tool;
  const { cardColor } = category;

  const handleClick = () => {
    trackGtagEvent('tool_click', {
      'tool_name': name,
      'tool_category': category.name
    });
  };
  
  return (
    <Link to={`/tool/${slug}`} className="group block h-full" onClick={handleClick}>
      <div className="flex flex-col h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-200/80 overflow-hidden">
        <div className={`h-1.5 ${cardColor}`} />
        <div className="p-5 flex-grow">
          <div>
            <h3 className="text-base font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{name}</h3>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;