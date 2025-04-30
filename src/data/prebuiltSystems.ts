
export interface PrebuiltPC {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  bestseller: boolean;
  imageUrl: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  cooling: string;
  psu: string;
  benchmarks: { game: string; fps: number }[];
}

export const prebuiltSystems: PrebuiltPC[] = [
  {
    id: "1",
    name: "Apex Predator",
    category: "Gaming PC",
    price: 2499,
    originalPrice: 2699,
    discount: 200,
    bestseller: true,
    imageUrl: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?q=80&w=2574&auto=format",
    cpu: "Ryzen 7 9700X",
    gpu: "NVIDIA RTX 5070TI 16GB",
    ram: "32GB DDR5 6000MHZ",
    storage: "2TB NVMe SSD",
    cooling: "360mm LCD AIO Liquid Cooler",
    psu: "850W 80+ Gold",
    benchmarks: [
      { game: "Cyberpunk 2077", fps: 178 },
      { game: "Call of Duty: Warzone", fps: 260 },
      { game: "Fortnite", fps: 260 }
    ]
  },
  {
    id: "2",
    name: "Stealth Operator",
    category: "Gaming PC",
    price: 1899,
    originalPrice: 1899,
    discount: 0,
    bestseller: false,
    imageUrl: "https://images.unsplash.com/photo-1600861195091-690c92f1d2cc?q=80&w=2680&auto=format",
    cpu: "AMD Ryzen 7 7800X3D",
    gpu: "NVIDIA RTX 5070 12GB",
    ram: "32GB DDR5 5200MHz",
    storage: "1TB NVMe SSD",
    cooling: "240mm AIO Liquid Cooler",
    psu: "750W 80+ Gold",
    benchmarks: [
      { game: "Cyberpunk 2077", fps: 95 },
      { game: "Call of Duty: Warzone", fps: 144 },
      { game: "Fortnite", fps: 200 }
    ]
  },
  {
    id: "3",
    name: "Stream Master",
    category: "Streaming PC",
    price: 2199,
    originalPrice: 2399,
    discount: 200,
    bestseller: true,
    imageUrl: "https://images.unsplash.com/photo-1624705013726-8cb4f9415f48?q=80&w=2680&auto=format",
    cpu: "AMD Ryzen 9 7700X",
    gpu: "NVIDIA RTX 5070 16GB",
    ram: "32GB DDR5 5200MHz",
    storage: "2TB NVMe SSD",
    cooling: "360mm AIO Liquid Cooler",
    psu: "850W 80+ Gold",
    benchmarks: [
      { game: "Cyberpunk 2077 (While Streaming)", fps: 90 },
      { game: "Call of Duty: Warzone (While Streaming)", fps: 120 },
      { game: "Fortnite (While Streaming)", fps: 180 }
    ]
  },
  {
    id: "4",
    name: "Creator Pro",
    category: "Workstation",
    price: 4999,
    originalPrice: 4999,
    discount: 0,
    bestseller: false,
    imageUrl: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=2670&auto=format",
    cpu: "Ryzen 7 9800X3D",
    gpu: "NVIDIA RTX 5090 36GB",
    ram: "96GB DDR5 6200MHZ",
    storage: "1TB NVMe SSD + 4TB NVME SSD",
    cooling: "TRYX Panorama AIO",
    psu: "1000W 80+ Platinum",
    benchmarks: [
      { game: "DaVinci Resolve Export (4K)", fps: 120 },
      { game: "Blender Rendering", fps: 100 },
      { game: "Adobe Premiere Pro 4K Export", fps: 120 }
    ]
  },
  {
    id: "5",
    name: "Compact Fury",
    category: "Gaming PC",
    price: 1299,
    originalPrice: 1499,
    discount: 200,
    bestseller: false,
    imageUrl: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=2631&auto=format",
    cpu: "AMD Ryzen 5 7600X",
    gpu: "NVIDIA RTX 5060 Ti 8GB",
    ram: "32Gb DDR5 5200MHz",
    storage: "2TB NVMe SSD",
    cooling: "Air Cooler",
    psu: "650W 80+ Bronze",
    benchmarks: [
      { game: "Cyberpunk 2077", fps: 80 },
      { game: "Call of Duty: Warzone", fps: 160 },
      { game: "Fortnite", fps: 215 }
    ]
  },
  {
    id: "6",
    name: "BattleforgePC Studio",
    category: "Workstation",
    price: 3200,
    originalPrice: 3200,
    discount: 0,
    bestseller: false,
    imageUrl: "https://images.unsplash.com/photo-1625842268584-8f3296236761?q=80&w=2670&auto=format",
    cpu: "AMD Ryzen 9 9900X",
    gpu: "NVIDIA RTX 5080 16GB",
    ram: "64GB DDR5 5600MHz",
    storage: "2TB NVMe SSD + 4TB HDD",
    cooling: "280mm AIO Liquid Cooler",
    psu: "1000W 80+ Gold",
    benchmarks: [
      { game: "Adobe After Effects", fps: 120 },
      { game: "3D Rendering", fps: 100 },
      { game: "4K Video Editing", fps: 90 }
    ]
  },
  {
    id: "7",
    name: "Budget Beast",
    category: "Gaming PC",
    price: 750,
    originalPrice: 750,
    discount: 0,
    bestseller: true,
    imageUrl: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=2574&auto=format",
    cpu: "AMD Ryzen 5 5500",
    gpu: "NVIDIA RTX 6600 8GB",
    ram: "16GB DDR4 3200MHz",
    storage: "1TB NVMe SSD",
    cooling: "Stock Cooler",
    psu: "550W 80+ Bronze",
    benchmarks: [
      { game: "Cyberpunk 2077", fps: 65 },
      { game: "Call of Duty: Warzone", fps: 130 },
      { game: "Fortnite", fps: 160 }
    ]
  },
  {
    id: "8",
    name: "Stream Starter",
    category: "Streaming PC",
    price: 1599,
    originalPrice: 1699,
    discount: 100,
    bestseller: false,
    imageUrl: "https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?q=80&w=2670&auto=format",
    cpu: "AMD Ryzen 7 7700X",
    gpu: "NVIDIA RTX 5060 Ti 8GB",
    ram: "32GB DDR5 5200MHz",
    storage: "1TB NVMe SSD",
    cooling: "240mm AIO Liquid Cooler",
    psu: "650W 80+ Gold",
    benchmarks: [
      { game: "Cyberpunk 2077 (While Streaming)", fps: 70 },
      { game: "Call of Duty: Warzone (While Streaming)", fps: 100 },
      { game: "Fortnite (While Streaming)", fps: 150 }
    ]
  },
  {
    id: "9",
    name: "Ultimate RGB",
    category: "Gaming PC",
    price: 2899,
    originalPrice: 3099,
    discount: 200,
    bestseller: false,
    imageUrl: "https://images.unsplash.com/photo-1602934445884-da0fa1c9d3b3?q=80&w=2596&auto=format",
    cpu: "Ryzen 7 9800X3D",
    gpu: "NVIDIA RTX 5080",
    ram: "32GB DDR5 6000MHz RGB",
    storage: "2TB NVMe SSD",
    cooling: "360mm LCD RGB AIO",
    psu: "1000W 80+ Gold",
    benchmarks: [
      { game: "Cyberpunk 2077", fps: 200 },
      { game: "Call of Duty: Warzone", fps: 360 },
      { game: "Fortnite", fps: 360 }
    ]
  },
 {
    id: "10",
    name: "Budget Beast 2",
    category: "Gaming PC",
    price: 550,
    originalPrice: 550,
    discount: 0,
    bestseller: true,
    imageUrl: "https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=2574&auto=format",
    cpu: "AMD Ryzen 5 5500",
    gpu: "NVIDIA RTX 580 8GB - UNOFFICIAL DRIVERS",
    ram: "16GB DDR4 3200MHz",
    storage: "1TB NVMe SSD",
    cooling: "Stock Cooler",
    psu: "550W 80+ Bronze",
    benchmarks: [
      { game: "Cyberpunk 2077", fps: 65 },
      { game: "Call of Duty: Warzone", fps: 130 },
      { game: "Fortnite", fps: 160 }
    ]
  },  
];
