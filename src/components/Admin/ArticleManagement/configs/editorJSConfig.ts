
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';
import Quote from '@editorjs/quote';
import Checklist from '@editorjs/checklist';
import Embed from '@editorjs/embed';
import Image from '@editorjs/image';
import Code from '@editorjs/code';
import Table from '@editorjs/table';
import Delimiter from '@editorjs/delimiter';
import { ScriptImportTool } from '../tools/ScriptImportTool';
import { TabsTool } from '../tools/TabsTool';
import { uploadImageToSupabase } from '../utils/imageUploadUtils';

/**
 * Configuration for EditorJS tools
 */
export const getEditorJSTools = () => ({
  header: {
    class: Header,
    config: {
      levels: [1, 2, 3, 4, 5, 6],
      defaultLevel: 2
    }
  },
  paragraph: {
    class: Paragraph,
    inlineToolbar: true
  },
  list: {
    class: List,
    inlineToolbar: true
  },
  checklist: {
    class: Checklist,
    inlineToolbar: true
  },
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: 'Enter a quote',
      captionPlaceholder: 'Quote\'s author'
    }
  },
  delimiter: Delimiter,
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByFile: async (file: File) => {
          const imageUrl = await uploadImageToSupabase(file);
          if (!imageUrl) {
            return {
              success: 0,
              message: "Image upload failed"
            };
          }
          
          return {
            success: 1,
            file: {
              url: imageUrl
            }
          };
        }
      }
    }
  },
  embed: Embed,
  code: Code,
  table: Table,
  scriptImport: {
    class: ScriptImportTool
  },
  tabs: {
    class: TabsTool
  }
});
