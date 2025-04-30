
import { API, BlockTool } from '@editorjs/editorjs';

interface TabsData {
  tabs: Array<{
    title: string;
    content: any[];
  }>;
}

export class TabsTool implements BlockTool {
  private readonly api: API;
  private readonly data: TabsData;
  private element: HTMLElement;
  private tabsContainer: HTMLElement;
  private contentContainer: HTMLElement;
  private activeTabIndex: number = 0;

  static get toolbox() {
    return {
      title: 'Tabs',
      icon: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M3 3C2.44772 3 2 3.44772 2 4V16C2 16.5523 2.44772 17 3 17H17C17.5523 17 18 16.5523 18 16V4C18 3.44772 17.5523 3 17 3H3ZM3.5 5C3.5 4.72386 3.72386 4.5 4 4.5H7C7.27614 4.5 7.5 4.72386 7.5 5V5.5H3.5V5ZM8.5 5C8.5 4.72386 8.72386 4.5 9 4.5H12C12.2761 4.5 12.5 4.72386 12.5 5V5.5H8.5V5ZM13.5 5C13.5 4.72386 13.7239 4.5 14 4.5H16C16.2761 4.5 16.5 4.72386 16.5 5V5.5H13.5V5ZM3.5 6.5H16.5V15.5H3.5V6.5Z" fill="currentColor"/></svg>'
    };
  }

  constructor({ api, data }: { api: API; data: TabsData }) {
    this.api = api;
    this.data = {
      tabs: data && data.tabs ? data.tabs : [
        {
          title: 'Tab 1',
          content: [{
            type: 'paragraph',
            data: {
              text: 'Tab 1 content'
            }
          }]
        },
        {
          title: 'Tab 2',
          content: [{
            type: 'paragraph',
            data: {
              text: 'Tab 2 content'
            }
          }]
        }
      ]
    };
    
    this.element = document.createElement('div');
    this.tabsContainer = document.createElement('div');
    this.contentContainer = document.createElement('div');
  }

  render() {
    this.element.classList.add('tabs-tool');
    this.element.style.width = '100%';
    this.element.style.marginBottom = '10px';

    this.tabsContainer.classList.add('tabs-tool__tabs');
    this.tabsContainer.style.display = 'flex';
    this.tabsContainer.style.borderBottom = '1px solid #e5e7eb';
    this.tabsContainer.style.marginBottom = '10px';
    
    this.contentContainer.classList.add('tabs-tool__content');
    this.contentContainer.style.padding = '10px';
    this.contentContainer.style.border = '1px solid #e5e7eb';
    this.contentContainer.style.borderRadius = '0 0 4px 4px';

    this.element.appendChild(this.tabsContainer);
    this.element.appendChild(this.contentContainer);

    // Create tabs
    this.data.tabs.forEach((tab, index) => {
      const tabElement = document.createElement('button');
      tabElement.textContent = tab.title;
      tabElement.classList.add('tabs-tool__tab');
      tabElement.style.padding = '8px 16px';
      tabElement.style.margin = '0 4px 0 0';
      tabElement.style.border = '1px solid #e5e7eb';
      tabElement.style.borderRadius = '4px 4px 0 0';
      tabElement.style.borderBottom = 'none';
      tabElement.style.background = index === this.activeTabIndex ? '#ffffff' : '#f3f4f6';
      tabElement.style.cursor = 'pointer';
      
      tabElement.addEventListener('click', () => {
        this.setActiveTab(index);
      });

      this.tabsContainer.appendChild(tabElement);
    });

    // Show initial content
    this.renderTabContent();

    return this.element;
  }

  setActiveTab(index: number) {
    this.activeTabIndex = index;
    
    // Update tab styling
    Array.from(this.tabsContainer.children).forEach((tab, i) => {
      (tab as HTMLElement).style.background = i === this.activeTabIndex ? '#ffffff' : '#f3f4f6';
    });
    
    this.renderTabContent();
  }

  renderTabContent() {
    if (!this.data.tabs[this.activeTabIndex]) return;
    
    // Clear content container
    this.contentContainer.innerHTML = '';
    
    const content = this.data.tabs[this.activeTabIndex].content;
    if (!content || content.length === 0) {
      const placeholder = document.createElement('div');
      placeholder.textContent = 'Tab content will appear here in the published article';
      placeholder.style.padding = '15px';
      placeholder.style.color = '#6b7280';
      placeholder.style.fontStyle = 'italic';
      this.contentContainer.appendChild(placeholder);
    } else {
      const contentInfo = document.createElement('div');
      contentInfo.textContent = `This tab contains ${content.length} block(s) that will render in the published article`;
      contentInfo.style.padding = '15px';
      contentInfo.style.color = '#6b7280';
      contentInfo.style.fontStyle = 'italic';
      this.contentContainer.appendChild(contentInfo);
    }
  }

  save() {
    return this.data;
  }

  static get sanitize() {
    return {
      tabs: {
        title: true,
        content: true
      }
    };
  }

  static get isReadOnlySupported() {
    return true;
  }
}
