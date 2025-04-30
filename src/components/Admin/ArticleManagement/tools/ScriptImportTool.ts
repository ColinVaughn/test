
/**
 * Custom EditorJS tool for importing JavaScript scripts
 */
export class ScriptImportTool {
  static get toolbox() {
    return {
      title: 'Script Import',
      icon: '<svg width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v14h16V5H4zm8 10h6v2h-6v-2zm-3-7h9v2H9V8zm0 4h9v2H9v-2z"/></svg>'
    };
  }

  api: any;
  data: {
    src: string;
    caption: string;
  };
  _element: HTMLElement;
  
  constructor({ data, api }) {
    this.api = api;
    this.data = {
      src: data.src || '',
      caption: data.caption || ''
    };
    
    this._element = document.createElement('div');
  }

  render() {
    this._element = document.createElement('div');
    this._element.classList.add('script-import-tool');
    
    const inputContainer = document.createElement('div');
    inputContainer.classList.add('cdx-input');
    
    const srcInput = document.createElement('input');
    srcInput.placeholder = 'Enter script URL or path';
    srcInput.value = this.data.src;
    srcInput.classList.add('cdx-input');
    
    srcInput.addEventListener('input', () => {
      this.data.src = srcInput.value;
    });
    
    const captionInput = document.createElement('input');
    captionInput.placeholder = 'Caption (optional)';
    captionInput.value = this.data.caption;
    captionInput.classList.add('cdx-input', 'mt-2');
    
    captionInput.addEventListener('input', () => {
      this.data.caption = captionInput.value;
    });
    
    const previewContainer = document.createElement('div');
    previewContainer.classList.add('script-preview', 'mt-2', 'p-2', 'bg-muted', 'rounded');
    
    if (this.data.src) {
      previewContainer.innerHTML = `<div class="text-sm"><code>${this.data.src}</code></div>`;
    } else {
      previewContainer.innerHTML = '<p class="text-sm text-muted-foreground">Script preview will appear here</p>';
    }
    
    srcInput.addEventListener('change', () => {
      if (this.data.src) {
        previewContainer.innerHTML = `<div class="text-sm"><code>${this.data.src}</code></div>`;
      } else {
        previewContainer.innerHTML = '<p class="text-sm text-muted-foreground">Script preview will appear here</p>';
      }
    });
    
    inputContainer.appendChild(srcInput);
    inputContainer.appendChild(captionInput);
    
    this._element.appendChild(inputContainer);
    this._element.appendChild(previewContainer);
    
    return this._element;
  }

  save() {
    return {
      src: this.data.src,
      caption: this.data.caption
    };
  }

  static get sanitize() {
    return {
      src: true,
      caption: true
    };
  }
}
