
import { ComponentCategory } from "@/types/types";

export const motherboardComponents: ComponentCategory = {
  id: "motherboard",
  name: "Motherboard",
  description: "The main circuit board that all components connect to.",
  required: true,
  options: [
    {
      id: "mobo-1",
      name: "ASUS ROG Strix Z790-E Gaming WiFi",
      brand: "ASUS",
      price: 399.99,
      amazonLink: "#",
      specs: {
        socket: "LGA 1700",
        chipset: "Intel Z790",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR5",
        formFactor: "ATX"
      },
      imageUrl: "https://images.unsplash.com/photo-1631272704284-5be5c3db7963?q=80&w=2574&auto=format"
    },
    {
      id: "mobo-2",
      name: "MSI MPG Z790 Carbon WiFi",
      brand: "MSI",
      price: 429.99,
      amazonLink: "#",
      specs: {
        socket: "LGA 1700",
        chipset: "Intel Z790",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR5",
        formFactor: "ATX"
      },
      imageUrl: "https://images.unsplash.com/photo-1631272704284-5be5c3db7963?q=80&w=2574&auto=format"
    },
    {
      id: "mobo-3",
      name: "GIGABYTE B650 AORUS Elite AX ICE",
      brand: "GIGABYTE",
      price: 244,
      amazonLink: "https://amzn.to/4jP0fdu",
      specs: {
        socket: "AM5",
        chipset: "AMD B650",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR5",
        formFactor: "ATX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//717D3oBpMBL._AC_SL1500_.webp"
    },
    {
      id: "mobo-4",
      name: "MSI MPG X670E Carbon WiFi",
      brand: "MSI",
      price: 479.99,
      amazonLink: "https://amzn.to/4lOjrKc",
      specs: {
        socket: "AM5",
        chipset: "AMD X670E",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR5",
        formFactor: "ATX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//71Bm1pj6SwL._AC_SL1280_.webp"
    },
    {
      id: "mobo-5",
      name: "ASUS TUF Gaming B550-PLUS",
      brand: "ASUS",
      price: 159.99,
      amazonLink: "#",
      specs: {
        socket: "AM4",
        chipset: "AMD B550",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR4",
        formFactor: "ATX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//81Wv4R9LRNL._AC_SL1500_.webp"
    },
    {
      id: "mobo-6",
      name: "MSI PRO B550M-VC",
      brand: "MSI",
      price: 100,
      amazonLink: "https://amzn.to/3GEt3Hf",
      specs: {
        socket: "AM4",
        chipset: "AMD B550",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR4",
        formFactor: "Micro-ATX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//71Bm1pj6SwL._AC_SL1280_.webp"
    },
    {
      id: "mobo-7",
      name: "GIGABYTE B650M AORUS Elite AX ICE",
      brand: "GIGABYTE",
      price: 230,
      amazonLink: "https://amzn.to/44JvD90",
      specs: {
        socket: "AM5",
        chipset: "AMD B650",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR5",
        formFactor: "Micro-ATX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//81XNROZmDML._AC_SL1500_%20(2).webp"
    },    
    {
      id: "mobo-8",
      name: "GIGABYTE B650I AORUS Ultra",
      brand: "GIGABYTE",
      price: 280,
      amazonLink: "https://amzn.to/3Gu2W5Z",
      specs: {
        socket: "AM5",
        chipset: "AMD B650",
        memorySlots: "2",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR5",
        formFactor: "ITX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//712RZCyhNXL._AC_SL1500_.webp"
    },
    {
      id: "mobo-9",
      name: "TUF Gaming A520M-PLU",
      brand: "ASUS",
      price: 115,
      amazonLink: "https://amzn.to/3SdSgLb",
      specs: {
        socket: "AM4",
        chipset: "AMD B550",
        memorySlots: "4",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR4",
        formFactor: "Micro-ATX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//81HF8Ri1V9L._AC_SL1280_%20(1).webp"
    },
    {
      id: "mobo-10",
      name: "GIGABYTE A620I AX",
      brand: "ASUS",
      price: 115,
      amazonLink: "https://amzn.to/3SdSgLb",
      specs: {
        socket: "AM5",
        chipset: "AMD B620",
        memorySlots: "2",
        maxMemory: "128GB",
        wifi: "WiFi 6E",
        memoryType: "DDR5",
        formFactor: "ITX"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//81UYDgthyEL._AC_SL1500_.webp"
    }    
  ]
};
