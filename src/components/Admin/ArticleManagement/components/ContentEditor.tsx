
import React from "react";
import { EditorJSHandle } from "../EditorJS";
import EditorJSComponent from "../EditorJS";
import { Skeleton } from "@/components/ui/skeleton";

interface ContentEditorProps {
  useEditorJS: boolean;
  content: string;
  setContent: (content: string) => void;
  isSaving?: boolean;
  lastSaved?: Date | null;
  editorRef: React.RefObject<EditorJSHandle>;
  isLoading?: boolean;
}

export const ContentEditor: React.FC<ContentEditorProps> = ({
  useEditorJS,
  content,
  setContent,
  isSaving,
  lastSaved,
  editorRef,
  isLoading = false
}) => {
  console.log("ContentEditor rendering, useEditorJS:", useEditorJS);
  console.log("ContentEditor content type:", typeof content, "content exists:", !!content);
  
  if (isLoading) {
    return (
      <div className="w-full">
        <Skeleton className="w-full h-[400px]" />
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <div className="editor-js-container">
        <EditorJSComponent 
          ref={editorRef}
          content={content} 
          onChange={setContent}
          key={content ? 'content-loaded' : 'no-content'} // Force re-render when content changes
        />
        {isSaving && (
          <div className="mt-2 text-sm text-muted-foreground">
            Saving changes...
          </div>
        )}
        {!isSaving && lastSaved && (
          <div className="mt-2 text-sm text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
};
