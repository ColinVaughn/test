
/**
 * Utility functions for parsing EditorJS content
 */

/**
 * Parse EditorJS JSON content with error handling
 * @param content - The content to parse
 * @returns An EditorJS compatible data object
 */
export const parseContent = (content: string | object | null | undefined) => {
  if (!content) return { time: Date.now(), blocks: [] };
  
  try {
    let parsed;
    
    // Handle based on content type
    if (typeof content === 'object') {
      // If already an object, check if it's valid EditorJS format
      parsed = content;
    } else if (typeof content === 'string') {
      // If string, try to parse it as JSON
      parsed = JSON.parse(content);
    } else {
      // Fallback for unexpected types
      console.warn('Unexpected content type:', typeof content);
      return { time: Date.now(), blocks: [] };
    }
    
    // Check if it has the correct EditorJS structure
    if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
      // Add time if missing
      if (!parsed.time) {
        parsed.time = Date.now();
      }
      
      // Validate and sanitize all blocks
      const sanitizedBlocks = parsed.blocks.map(block => {
        // Ensure each block has required properties
        if (!block || typeof block !== 'object') {
          return null;
        }
        
        // Every block must have type and data
        if (!block.type || !block.data) {
          return null;
        }
        
        // Special handling for different block types
        switch (block.type) {
          case 'paragraph':
          case 'header':
            // Ensure text is a string
            if (block.data && block.data.text !== undefined && typeof block.data.text !== 'string') {
              block.data.text = String(block.data.text);
            }
            break;
          case 'list':
            // Ensure items is an array
            if (block.data) {
              if (!Array.isArray(block.data.items)) {
                block.data.items = [];
                console.error('List items is not an array:', block.data);
              } else {
                // Process each item to ensure it's usable
                block.data.items = block.data.items.map(item => {
                  // If it's a complex object, try to extract useful text
                  if (item && typeof item === 'object') {
                    if (item.text) {
                      return item.text;
                    } else if (item.content) {
                      return item.content;
                    } else {
                      // Last resort - try to stringify
                      try {
                        return JSON.stringify(item);
                      } catch (e) {
                        return 'List item';
                      }
                    }
                  }
                  // For simple items, ensure they're strings
                  return item !== undefined ? String(item) : '';
                });
              }
              
              // Ensure style is valid
              if (!block.data.style || (block.data.style !== 'ordered' && block.data.style !== 'unordered')) {
                block.data.style = 'unordered';
              }
            }
            break;
        }
        
        return block;
      }).filter(Boolean);
      
      // Return sanitized content
      return {
        ...parsed,
        blocks: sanitizedBlocks
      };
    } else {
      // If it doesn't have blocks, create a structure
      console.warn('Content missing proper blocks array');
      return {
        time: Date.now(),
        blocks: [
          {
            type: "paragraph",
            data: {
              text: typeof content === 'string' ? content : JSON.stringify(content)
            }
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error parsing EditorJS content:', error);
    
    // Create a basic block structure for any parsing errors
    return {
      time: Date.now(),
      blocks: [
        {
          type: "paragraph",
          data: {
            text: typeof content === 'string' ? content : 'Invalid content'
          }
        }
      ]
    };
  }
};

/**
 * Find script blocks in EditorJS content
 * @param parsedContent - Parsed EditorJS content
 * @returns Array of script blocks
 */
export const findScriptBlocks = (parsedContent: any) => {
  if (!parsedContent || !parsedContent.blocks) {
    return [];
  }
  return parsedContent.blocks.filter(block => block && block.type === 'scriptImport') || [];
};

/**
 * Handle loading of script blocks from EditorJS content
 * @param scriptBlocks - Array of script blocks
 */
export const loadScriptBlocks = (scriptBlocks: any[]) => {
  // Safety check
  if (!Array.isArray(scriptBlocks)) {
    console.error('Invalid script blocks:', scriptBlocks);
    return;
  }
  
  // Load each script
  scriptBlocks.forEach(block => {
    if (block && block.data && block.data.src) {
      try {
        const script = document.createElement('script');
        script.src = block.data.src;
        script.async = true;
        script.setAttribute('data-editorjs-script', 'true');
        document.body.appendChild(script);
      } catch (error) {
        console.error('Error loading script:', block.data.src, error);
      }
    }
  });
};

/**
 * Remove scripts added by EditorJS content
 */
export const removeScripts = () => {
  const scripts = document.querySelectorAll('script[data-editorjs-script]');
  scripts.forEach(script => script.remove());
};
