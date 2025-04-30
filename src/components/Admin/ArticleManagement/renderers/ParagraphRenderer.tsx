
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

interface ParagraphRendererProps {
  data: {
    text: string;
  };
}

export const ParagraphRenderer: React.FC<ParagraphRendererProps> = ({ data }) => {
  if (!data || typeof data.text !== 'string') {
    return <p className="text-muted-foreground">Empty paragraph</p>;
  }
  
  return (
    <div 
      className="mb-4" 
      dangerouslySetInnerHTML={createMarkup(data.text)}
    />
  );
};

export default ParagraphRenderer;
