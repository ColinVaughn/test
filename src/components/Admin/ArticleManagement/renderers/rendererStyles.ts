
/**
 * Styles for EditorJS renderer components
 */
export const rendererStyles = {
  header: {
    h1: 'text-3xl font-bold mt-6 mb-3',
    h2: 'text-2xl font-bold mt-5 mb-2',
    h3: 'text-xl font-bold mt-4 mb-2',
    h4: 'text-lg font-bold mt-3 mb-1',
    h5: 'text-base font-bold mt-2 mb-1',
    h6: 'text-sm font-bold mt-2 mb-1',
  },
  paragraph: 'text-base mb-3',
  list: {
    container: 'list-disc ml-6 mb-3',
    listItem: 'mb-1'
  },
  table: {
    table: 'border-collapse border w-full mb-3',
    tr: 'border',
    th: 'border p-2 bg-muted',
    td: 'border p-2'
  },
  quote: {
    container: 'border-l-4 border-primary pl-4 italic my-3',
    content: 'mb-1',
    author: 'text-sm text-muted-foreground'
  },
  code: 'font-mono bg-muted p-2 rounded my-3 whitespace-pre-wrap',
  image: {
    container: 'my-4',
    img: 'max-w-full h-auto rounded-md',
    caption: 'text-sm text-muted-foreground mt-1'
  },
  embed: {
    container: 'my-4',
    iframe: 'w-full aspect-video'
  },
  delimiter: 'text-center my-4',
  checklist: {
    container: 'flex flex-col space-y-2 my-4',
    item: 'flex items-center space-x-2',
    itemChecked: 'text-muted-foreground line-through',
    checkbox: 'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary'
  }
};
