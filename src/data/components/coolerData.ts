import { ComponentCategory } from "@/types/types";

export const coolerComponents: ComponentCategory = {
  id: "cooler",
  name: "CPU Cooler",
  description: "Keeps your processor from overheating during intensive tasks.",
  required: true,
  options: [
    {
      id: "stock-cooler",
      name: "CPU Stock Cooler",
      brand: "AMD",
      price: 0,
      specs: {
        type: "Air Cooler",
        model: "Wraith Stealth",
        compatibility: "AMD AM4/AM5",
        coolingCapacity: "65W"
      },
      wattage: 0,
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images/wraith-stealth.webp"
    },
    {
      id: "cooler-1",
      name: "SAMA L40",
      brand: "SAMA",
      price: 65,
      amazonLink: "https://amzn.to/3S7Xqsa",
      specs: {
        type: "Liquid Cooler",
        radiatorSize: "240mm",
        fans: "2x 120mm",
        rgb: "Yes",
        coolingCapacity: "250W",
        compatibility: "Intel LGA1700/1200, AMD AM5/AM4"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//samal240.webp",
      coolerColors: [
        {
          id: "cooler-1-black",
          name: "Black",
          hexCode: "#000000",
          price: 0
        },
        {
          id: "cooler-1-white",
          name: "White",
          hexCode: "#FFFFFF",
          price: 0
        }
      ],
      coolerSizes: [
        {
          id: "240mm",
          size: "240mm",
          radiatorSize: "240mm",
          price: 0
        },
        {
          id: "360mm",
          size: "360mm",
          radiatorSize: "360mm",
          price: 12
        }
      ]
    },
    {
      id: "cooler-2",
      name: "SAMA Q70",
      brand: "SAMA",
      price: 165,
      amazonLink: "https://amzn.to/4izW1pd",
      specs: {
        type: "Liquid Cooler",
        radiatorSize: "360mm",
        fans: "3x 120mm",
        rgb: "Yes",
        coolingCapacity: "250W",
        compatibility: "Intel LGA1700/1200, AMD AM5/AM4"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//61qwVWIsUPL._SL1500_-_1__11zon.webp",
      coolerColors: [
        {
          id: "cooler-2-black",
          name: "Black",
          hexCode: "#000000",
          price: 0
        },
        {
          id: "cooler-2-white",
          name: "White",
          hexCode: "#FFFFFF",
          price: 0
        }
      ]
    },
    {
      id: "cooler-3",
      name: "Noctua NH-D15",
      brand: "Noctua",
      price: 99.99,
      amazonLink: "#",
      specs: {
        type: "Air Cooler",
        height: "165mm",
        fans: "2x 140mm",
        rgb: "No",
        coolingCapacity: "150W",
        compatibility: "Intel LGA1700/1200, AMD AM5/AM4"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format"
    },
    {
      id: "cooler-4",
      name: "TRYX Panorama SE",
      brand: "TRYX",
      price: 295,
      amazonLink: "https://amzn.to/4cOukrx",
      specs: {
        type: "Liquid Cooler",
        radiatorSize: "360mm",
        fans: "3x 120mm",
        rgb: "No",
        coolingCapacity: "250W",
        compatibility: "Intel LGA1700/1200, AMD AM5/AM4"
      },
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//61CLeBIl9dL._SL1500__11zon.webp",
      coolerColors: [
        {
          id: "cooler-4-black",
          name: "Black",
          hexCode: "#000000",
          price: 0
        },
        {
          id: "cooler-4-white",
          name: "White",
          hexCode: "#FFFFFF",
          price: 0
        }
      ]
    }
  ]
};
