
import React from 'react';
import DOMPurify from 'dompurify';

// Helper function to safely render HTML content
const createMarkup = (html: string) => {
  if (typeof html !== 'string') {
    console.error('Invalid HTML content:', html);
    return { __html: '' };
  }
  return { __html: DOMPurify.sanitize(html) };
};

interface HeaderRendererProps {
  data: {
    text: string;
    level?: number;
  };
  tag?: string;
}

export const HeaderRenderer: React.FC<HeaderRendererProps> = ({ data, tag }) => {
  if (!data || typeof data.text !== 'string') {
    return React.createElement(
      tag || 'h2', 
      { className: "text-muted-foreground" },
      "Empty header"
    );
  }
  
  return React.createElement(
    tag || 'h2',
    { dangerouslySetInnerHTML: createMarkup(data.text) }
  );
};

export default HeaderRenderer;
