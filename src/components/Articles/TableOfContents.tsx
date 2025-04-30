
import React, { useEffect, useState } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

export const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [toc, setToc] = useState<TOCItem[]>([]);

  useEffect(() => {
    // Parse markdown headings
    const headings = content.split('\n')
      .filter(line => line.startsWith('#'))
      .map(line => {
        const level = line.match(/^#+/)?.[0].length || 0;
        const text = line.replace(/^#+\s/, '');
        const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return { id, text, level };
      });
    
    setToc(headings);
  }, [content]);

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (toc.length === 0) return null;

  return (
    <div className="mb-8 p-4 border rounded-lg bg-muted/50">
      <h2 className="text-lg font-semibold mb-2">Table of Contents</h2>
      <ScrollArea className="h-[200px]">
        <nav>
          {toc.map((item, index) => (
            <button
              key={index}
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left py-1 hover:text-primary transition-colors ${
                item.level === 2 ? 'ml-0' :
                item.level === 3 ? 'ml-4' :
                item.level === 4 ? 'ml-8' :
                item.level === 5 ? 'ml-12' :
                item.level === 6 ? 'ml-16' : ''
              }`}
            >
              {item.text}
            </button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  );
};
