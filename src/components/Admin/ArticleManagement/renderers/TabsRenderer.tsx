
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import Output from 'editorjs-react-renderer';

interface Tab {
  title: string;
  content: any[];
}

interface TabsRendererProps {
  data: {
    tabs: Tab[];
  };
  rendererStyle: any;
  renderers: any;
}

export const TabsRenderer: React.FC<TabsRendererProps> = ({ data, rendererStyle, renderers }) => {
  if (!data || !data.tabs || !Array.isArray(data.tabs) || data.tabs.length === 0) {
    return <div className="text-muted-foreground">Invalid tabs data</div>;
  }
  
  // Ensure tab content is valid and protect against errors
  const validTabs = data.tabs.map(tab => ({
    ...tab,
    title: typeof tab.title === 'string' ? tab.title : 'Untitled tab',
    content: Array.isArray(tab.content) ? tab.content : []
  })).filter(tab => tab.title);
  
  if (validTabs.length === 0) {
    return <div className="text-muted-foreground">No valid tabs found</div>;
  }
  
  return (
    <div className="my-6">
      <Tabs defaultValue={validTabs[0].title.replace(/\s+/g, '-').toLowerCase()} className="w-full">
        <TabsList className="w-full flex">
          {validTabs.map((tab, index) => (
            <TabsTrigger 
              key={index} 
              value={tab.title.replace(/\s+/g, '-').toLowerCase()}
              className="flex-1"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {validTabs.map((tab, tabIndex) => (
          <TabsContent 
            key={tabIndex} 
            value={tab.title.replace(/\s+/g, '-').toLowerCase()}
            className="p-4 border rounded-md mt-1"
          >
            {tab.content && tab.content.length > 0 ? (
              <Output 
                data={{ time: Date.now(), blocks: tab.content }} 
                style={rendererStyle} 
                renderers={renderers}
              />
            ) : (
              <p className="text-muted-foreground">No content in this tab</p>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default TabsRenderer;
