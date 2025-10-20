import React from 'react';

export interface Tool {
  slug: string;
  name: string;
  description: string;
  category: string;
  component: React.ComponentType;
  icon: React.ComponentType<{ className?: string }>;
  instructions?: string;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  icon: string;
  color: string;
  cardColor: string;
  accentColor: string;
  tools: Tool[];
}
