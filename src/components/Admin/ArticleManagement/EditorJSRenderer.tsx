
import React from 'react';
import Output from 'editorjs-react-renderer';
import { parseContent } from './utils/contentParser';
import { useScriptLoader } from './hooks/useScriptLoader';
import { 
  HeaderRenderer,
  ParagraphRenderer,
  ListRenderer,
  DelimiterRenderer,
  ScriptImportRenderer,
  TabsRenderer,
  FallbackRenderer,
  rendererStyles
} from './renderers';

interface EditorJSRendererProps {
  content: string | object | null | undefined;
}

export const EditorJSRenderer: React.FC<EditorJSRendererProps> = ({ content }) => {
  // Parse the content
  const parsedContent = parseContent(content);
  console.log("EditorJSRenderer parsedContent:", parsedContent);
  
  // Debug list blocks specifically
  if (parsedContent?.blocks) {
    const listBlocks = parsedContent.blocks.filter(block => block.type === 'list');
    if (listBlocks.length > 0) {
      console.log("List blocks found:", listBlocks);
    }
  }
  
  // Load scripts from content
  useScriptLoader(parsedContent);

  // Safety check - if there are no valid blocks, show a message
  if (!parsedContent || !parsedContent.blocks || !Array.isArray(parsedContent.blocks) || parsedContent.blocks.length === 0) {
    return <div className="text-muted-foreground py-4">No valid content to display</div>;
  }

  // Custom renderers for different block types
  const renderers = {
    paragraph: ParagraphRenderer,
    header: (props) => {
      const level = props.data.level || 2;
      const tag = `h${level}`;
      return <HeaderRenderer {...props} tag={tag} />;
    },
    list: ListRenderer,
    tabs: (props) => <TabsRenderer {...props} rendererStyle={rendererStyles} renderers={renderers} />,
    scriptImport: ScriptImportRenderer,
    delimiter: DelimiterRenderer,
    fallback: FallbackRenderer
  };

  return (
    <div className="prose max-w-none dark:prose-invert">
      <Output 
        data={parsedContent} 
        style={rendererStyles} 
        renderers={renderers}
        className="editor-output-wrapper"
      />
    </div>
  );
};

export default EditorJSRenderer;
