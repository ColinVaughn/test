
import { ComponentCategory } from "@/types/types";

export const cpuComponents: ComponentCategory = {
  id: "cpu",
  name: "Processor (CPU)",
  description: "The brain of your PC that handles all the instructions and calculations.",
  required: true,
  options: [
    {
      id: "cpu-1",
      name: "Intel Core i5-13600K",
      brand: "Intel",
      price: 319.99,
      wattage: 125,
      amazonLink: "#",
      specs: {
        cores: "14 (6P+8E)",
        threads: "20",
        baseFrequency: "3.5 GHz",
        boostFrequency: "5.1 GHz",
        cache: "24MB",
        tdp: "125W",
        socket: "LGA 1700",
        memoryType: "DDR5",
        stockCooler: "No"
      },
      imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2564&auto=format"
    },
    {
      id: "cpu-2",
      name: "Intel Core i7-13700K",
      brand: "Intel",
      price: 409.99,
      amazonLink: "#",
      specs: {
        cores: "16 (8P+8E)",
        threads: "24",
        baseFrequency: "3.4 GHz",
        boostFrequency: "5.4 GHz",
        cache: "30MB",
        socket: "LGA 1700",
        memoryType: "DDR5",
        stockCooler: "No"
      },
      imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2564&auto=format"
    },
    {
      id: "cpu-3",
      name: "Intel Core i9-13900K",
      brand: "Intel",
      price: 589.99,
      amazonLink: "#",
      specs: {
        cores: "24 (8P+16E)",
        threads: "32",
        baseFrequency: "3.0 GHz",
        boostFrequency: "5.8 GHz",
        cache: "36MB",
        socket: "LGA 1700",
        memoryType: "DDR5",
        stockCooler: "No"
      },
      imageUrl: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=2564&auto=format"
    },
    {
      id: "cpu-4",
      name: "AMD Ryzen 5 7600X",
      brand: "AMD",
      price: 210,
      amazonLink: "https://amzn.to/4cRYOZF",
      specs: {
        cores: "6",
        threads: "12",
        baseFrequency: "4.7 GHz",
        boostFrequency: "5.3 GHz",
        cache: "38MB",
        socket: "AM5",
        memoryType: "DDR5",
        stockCooler: "No"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images/Ryzen%205%207000%20Series.webp"
    },
    {
      id: "cpu-5",
      name: "AMD Ryzen 7 7800X3D",
      brand: "AMD",
      price: 415,
      amazonLink: "https://amzn.to/44IoKEW",
      specs: {
        cores: "8",
        threads: "16",
        baseFrequency: "4.2 GHz",
        boostFrequency: "5.0 GHz",
        cache: "96MB",
        socket: "AM5",
        memoryType: "DDR5",
        stockCooler: "No"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images/Ryzen%205%207000%20Series.webp"
    },
    {
      id: "cpu-6",
      name: "AMD Ryzen 9 7950X",
      brand: "AMD",
      price: 500,
      amazonLink: "https://amzn.to/4cT2gDk",
      specs: {
        cores: "16",
        threads: "32",
        baseFrequency: "4.5 GHz",
        boostFrequency: "5.7 GHz",
        cache: "80MB",
        socket: "AM5",
        memoryType: "DDR5",
        stockCooler: "No"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images/Ryzen%205%207000%20Series.webp"
    },
    {
      id: "cpu-7",
      name: "AMD Ryzen 5 5500",
      brand: "AMD",
      price: 86,
      amazonLink: "https://amzn.to/3RwN8lh",
      specs: {
        cores: "6",
        threads: "12",
        baseFrequency: "4.2 GHz",
        boostFrequency: "4.6 GHz",
        cache: "18MB",
        socket: "AM4",
        memoryType: "DDR4",
        stockCooler: "Yes - Wraith Stealth"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images/Ryzen%205%207000%20Series.webp"
    },
    {
      id: "cpu-8",
      name: "AMD Ryzen 5 5700X",
      brand: "AMD",
      price: 150,
      amazonLink: "https://amzn.to/445bI4b",
      specs: {
        cores: "8",
        threads: "16",
        baseFrequency: "4.2 GHz",
        boostFrequency: "4.6 GHz",
        cache: "18MB",
        socket: "AM4",
        memoryType: "DDR4",
        stockCooler: "Yes - Wraith Stealth"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images/Ryzen%205%207000%20Series.webp"
    },
    {
      id: "cpu-9",
      name: "AMD Ryzen 7 9800X3D",
      brand: "AMD",
      price: 480,
      amazonLink: "https://amzn.to/3S3XCsu",
      specs: {
        cores: "8",
        threads: "16",
        baseFrequency: "4.7 GHz",
        boostFrequency: "5.2 GHz",
        cache: "96MB",
        socket: "AM5",
        memoryType: "DDR5",
        stockCooler: "No"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images/Ryzen%205%207000%20Series.webp"
    }    
  ]
};
