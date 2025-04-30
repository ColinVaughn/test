
import React, { forwardRef, useImperativeHandle } from 'react';
import { toast } from 'sonner';
import { useEditorJS } from './hooks/useEditorJS';
import { JSONPasteDialog } from './components/JSONPasteDialog';

export interface EditorJSProps {
  content: string;
  onChange: (content: string) => void;
}

export interface EditorJSHandle {
  save: () => Promise<string>;
}

const EditorJSComponent = forwardRef<EditorJSHandle, EditorJSProps>(({ content, onChange }, ref) => {
  const { editorContainerRef, saveContent } = useEditorJS({
    content,
    onChange
  });

  // Expose save method to parent components
  useImperativeHandle(ref, () => ({
    save: async () => {
      return await saveContent();
    }
  }));

  // Handle JSON paste with validation
  const handleJsonPaste = (jsonData: object) => {
    try {
      // Load the data into editor
      onChange(JSON.stringify(jsonData));
    } catch (error) {
      console.error('Error handling JSON paste:', error);
      toast.error('Failed to load content');
    }
  };

  return (
    <div className="border rounded-md bg-card">
      <div className="flex justify-end p-2 border-b">
        <JSONPasteDialog onJsonPaste={handleJsonPaste} />
      </div>
      <div ref={editorContainerRef} className="min-h-[400px] p-4" />
    </div>
  );
});

EditorJSComponent.displayName = 'EditorJSComponent';

export default EditorJSComponent;
