import { useEffect, useRef, useState } from 'react';
import EditorJS from '@editorjs/editorjs';
import { getEditorJSTools } from '../configs/editorJSConfig';
import { parseEditorContent } from '../utils/editorJSContentUtils';
import { toast } from 'sonner';

export interface UseEditorJSProps {
  content: string;
  onChange: (content: string) => void;
}

export const useEditorJS = ({ content, onChange }: UseEditorJSProps) => {
  const editorRef = useRef<EditorJS | null>(null);
  const editorContainerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<string>(content);
  const [isReady, setIsReady] = useState(false);

  // Keep track of content changes
  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  // Initialize EditorJS
  useEffect(() => {
    if (!editorContainerRef.current) return;

    const initEditor = async () => {
      if (editorRef.current) {
        await editorRef.current.isReady;
        editorRef.current.destroy();
        editorRef.current = null;
      }

      console.log("Initializing EditorJS with content:", contentRef.current ? "content provided" : "no content");
      
      const editorData = parseEditorContent(contentRef.current);
      console.log("Parsed editor data:", editorData);
      
      try {
        const editor = new EditorJS({
          holder: editorContainerRef.current,
          tools: getEditorJSTools(),
          data: editorData,
          onChange: async () => {
            try {
              const savedData = await editor.save();
              console.log("Editor onChange event triggered", savedData);
              onChange(JSON.stringify(savedData));
            } catch (err) {
              console.error("Error in EditorJS onChange:", err);
            }
          },
          autofocus: false,
          placeholder: 'Write your article content here...'
        });

        editor.isReady
          .then(() => {
            console.log('Editor.js is ready to work!');
            setIsReady(true);
          })
          .catch((error) => {
            console.error('Editor.js initialization failed:', error);
          });

        editorRef.current = editor;
      } catch (error) {
        console.error("Error initializing EditorJS:", error);
        toast.error("Failed to initialize the editor. Please try refreshing the page.");
      }
    };

    initEditor();

    // Cleanup on unmount
    return () => {
      if (editorRef.current && editorRef.current.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // Empty dependency array for initial mount only

  // Handle content changes from props (for loading existing content)
  useEffect(() => {
    if (!editorRef.current || !content || !isReady) return;
    
    const updateEditorContent = async () => {
      try {
        await editorRef.current?.isReady;
        const currentData = await editorRef.current?.save();
        
        // Only update if current editor is empty or has different content
        const currentContent = JSON.stringify(currentData);
        if (!currentData?.blocks?.length || currentContent !== content) {
          const parsedContent = parseEditorContent(content);
          editorRef.current?.render(parsedContent);
        }
      } catch (error) {
        console.error("Error updating editor content:", error);
      }
    };
    
    updateEditorContent();
  }, [content, isReady]);

  // Save method exposed to parent components
  const saveContent = async (): Promise<string> => {
    if (editorRef.current) {
      try {
        const savedData = await editorRef.current.save();
        return JSON.stringify(savedData);
      } catch (err) {
        console.error("Error saving EditorJS content:", err);
        return '';
      }
    }
    return '';
  };

  return {
    editorContainerRef,
    saveContent,
    isReady
  };
};
