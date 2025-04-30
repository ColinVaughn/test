
export interface SuggestedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export const suggestedProducts: SuggestedProduct[] = [
  {
    id: 'gaming-mousepad-xl',
    name: 'Pro Gaming Mousepad XL',
    description: 'Extra large gaming surface with RGB lighting',
    price: 29.99,
    imageUrl: '/placeholder.svg',
    category: 'Accessories'
  },
  {
    id: 'mechanical-keyboard-bundle',
    name: 'Mechanical Keyboard Bundle',
    description: 'RGB mechanical keyboard with custom keycaps',
    price: 99.99,
    imageUrl: '/placeholder.svg',
    category: 'Peripherals'
  },
  {
    id: 'gaming-headset-pro',
    name: 'Pro Gaming Headset',
    description: '7.1 surround sound gaming headset',
    price: 79.99,
    imageUrl: '/placeholder.svg',
    category: 'Audio'
  }
];
