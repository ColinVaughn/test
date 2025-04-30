
/**
 * Parse content from string to JSON object or use empty blocks
 * @param content - The content to parse
 * @returns An EditorJS compatible data object
 */
export const parseEditorContent = (content: string) => {
  if (!content) {
    return { time: Date.now(), blocks: [] };
  }

  try {
    const parsed = JSON.parse(content);
    
    // Check if it has the correct EditorJS structure
    if (parsed.blocks) {
      // Ensure time property exists
      if (!parsed.time) {
        parsed.time = Date.now();
      }
      return parsed;
    } else {
      // If it doesn't have blocks, it might be a different format
      console.warn('Content parsed as JSON but missing blocks array');
      return {
        time: Date.now(),
        blocks: [
          {
            type: "paragraph",
            data: {
              text: content
            }
          }
        ]
      };
    }
  } catch (error) {
    // If content is not valid JSON (e.g., when coming from markdown),
    // convert it to a simple paragraph block
    return {
      time: Date.now(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: content
          }
        }
      ]
    };
  }
};

/**
 * Extract script URLs from EditorJS content
 * @param content - The EditorJS content string
 * @returns Array of script URLs
 */
export const extractScriptUrls = (content: string): string[] => {
  try {
    const parsed = JSON.parse(content);
    const scriptBlocks = parsed.blocks?.filter(block => block.type === 'scriptImport') || [];
    return scriptBlocks
      .map(block => block.data?.src)
      .filter(Boolean);
  } catch (error) {
    console.error('Error extracting script URLs:', error);
    return [];
  }
};

/**
 * Check if EditorJS content contains script imports
 * @param content - The EditorJS content string
 * @returns boolean indicating if content has scripts
 */
export const hasScriptImports = (content: string): boolean => {
  const urls = extractScriptUrls(content);
  return urls.length > 0;
};
