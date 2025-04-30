
import React from 'react';

interface FallbackRendererProps {
  data: any;
  type?: string;
}

export const FallbackRenderer: React.FC<FallbackRendererProps> = ({ data, type }) => {
  return (
    <div className="my-4 p-3 bg-muted/20 rounded-md border border-border">
      <div className="text-sm font-mono mb-1 text-muted-foreground">
        <code>Block type "{type || 'unknown'}" is not supported</code>
      </div>
      {data && Object.keys(data).length > 0 && (
        <pre className="text-xs overflow-auto p-2 bg-muted rounded mt-2">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default FallbackRenderer;
