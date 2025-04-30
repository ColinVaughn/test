
import { useEffect } from 'react';
import { findScriptBlocks, loadScriptBlocks, removeScripts } from '../utils/contentParser';

/**
 * Hook to handle loading and cleanup of script blocks in EditorJS content
 * @param parsedContent - The parsed EditorJS content
 */
export const useScriptLoader = (parsedContent: any) => {
  useEffect(() => {
    // Safety check for parsedContent
    if (!parsedContent || !parsedContent.blocks || !Array.isArray(parsedContent.blocks)) {
      console.log("useScriptLoader: Invalid content structure", parsedContent);
      return;
    }
    
    try {
      // Find all script blocks
      const scriptBlocks = findScriptBlocks(parsedContent);
      
      // Load scripts
      loadScriptBlocks(scriptBlocks);
    } catch (error) {
      console.error("Error loading scripts:", error);
    }
    
    // Cleanup function to remove scripts when component unmounts
    return () => {
      try {
        removeScripts();
      } catch (error) {
        console.error("Error removing scripts:", error);
      }
    };
  }, [parsedContent]);
};
