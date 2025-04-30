
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

// Function to safely extract text content from various item formats
const getItemContent = (item: any): string => {
  // If item is already a string, use it directly
  if (typeof item === 'string') {
    return item;
  }
  
  // If item is an object with text property (common in EditorJS)
  if (item && typeof item === 'object') {
    if (item.text) {
      return item.text;
    }
    if (item.content) {
      return item.content;
    }
    // Last resort: stringify but with a warning
    console.warn('Complex list item encountered:', item);
    try {
      return JSON.stringify(item);
    } catch (e) {
      return 'List item';
    }
  }
  
  // Fallback for any other type
  return String(item);
};

interface ListRendererProps {
  data: {
    style: 'ordered' | 'unordered';
    items: any[];
  };
}

export const ListRenderer: React.FC<ListRendererProps> = ({ data }) => {
  if (!data || !data.items || !Array.isArray(data.items)) {
    console.error('Invalid list data:', data);
    return <div className="text-muted-foreground">Invalid list data</div>;
  }
  
  const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
  const listClassName = data.style === 'ordered' ? 'list-decimal ml-6 mb-4' : 'list-disc ml-6 mb-4';
  
  return (
    <ListTag className={listClassName}>
      {data.items.map((item, index) => {
        const content = getItemContent(item);
        return (
          <li key={index} dangerouslySetInnerHTML={createMarkup(content)} />
        );
      })}
    </ListTag>
  );
};

export default ListRenderer;
