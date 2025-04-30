
/**
 * Validates EditorJS JSON format
 * @param jsonStr - The JSON string to validate
 * @returns Object with validation result and error message
 */
export const validateEditorJSFormat = (jsonStr: string): { isValid: boolean; error?: string } => {
  try {
    // Try to parse the JSON
    const parsed = JSON.parse(jsonStr);
    
    // Check if it has the basic required EditorJS structure
    if (!parsed || typeof parsed !== 'object') {
      return { isValid: false, error: 'Invalid JSON format' };
    }
    
    // Check if it has the blocks array
    if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
      return { isValid: false, error: 'Missing blocks array in EditorJS format' };
    }
    
    // Check if blocks have the required structure
    for (let i = 0; i < parsed.blocks.length; i++) {
      const block = parsed.blocks[i];
      if (!block.type || !block.data) {
        return { 
          isValid: false, 
          error: `Block at index ${i} is missing required 'type' or 'data' fields` 
        };
      }
    }
    
    // Add time property if missing
    if (!parsed.time) {
      parsed.time = Date.now();
    }
    
    return { isValid: true };
  } catch (error) {
    return { isValid: false, error: 'Invalid JSON syntax' };
  }
};
