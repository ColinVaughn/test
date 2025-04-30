
import React from 'react';

interface ScriptImportRendererProps {
  data: {
    src?: string;
    caption?: string;
  };
}

export const ScriptImportRenderer: React.FC<ScriptImportRendererProps> = ({ data }) => {
  if (!data || !data.src) {
    return <div className="text-muted-foreground">Invalid script import</div>;
  }
  
  return (
    <div className="my-4 p-3 bg-muted rounded-md border border-border">
      <div className="text-sm font-mono mb-1">
        <code>Script: {data.src}</code>
      </div>
      {data.caption && (
        <div className="text-sm text-muted-foreground mt-1">{data.caption}</div>
      )}
    </div>
  );
};

export default ScriptImportRenderer;
