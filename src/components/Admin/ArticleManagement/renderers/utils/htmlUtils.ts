
import DOMPurify from 'dompurify';

/**
 * Helper function to safely render HTML content
 * @param html The HTML string to sanitize
 * @returns Safe HTML markup object for dangerouslySetInnerHTML
 */
export const createMarkup = (html: string) => {
  if (typeof html !== 'string') {
    console.error('Invalid HTML content:', html);
    return { __html: '' };
  }
  return { __html: DOMPurify.sanitize(html) };
};
