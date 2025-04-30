
import { ComponentCategory, CaseColor } from "@/types/types";

const whiteColor: CaseColor = {
  id: "color-white",
  name: "White",
  hexCode: "#FFFFFF",
  price: 0
};

const blackColor: CaseColor = {
  id: "color-black",
  name: "Black",
  hexCode: "#000000",
  price: 0
};
const graphiteColor: CaseColor = {
  id: "color-graphite",
  name: "Graphite",
  hexCode: "#41424C",
  price: 0
};
const jadeColor: CaseColor = {
  id: "color-jade",
  name: "Jade",
  hexCode: "#96b097",
  price: 0
};

const silverColor: CaseColor = {
  id: "color-silver",
  name: "Jade",
  hexCode: "#c0c0c0",
  price: 0
};

const redColor: CaseColor = {
  id: "color-red",
  name: "Red",
  hexCode: "#FF0000",
  price: 15
};

export const caseComponents: ComponentCategory = {
  id: "case",
  name: "Case",
  description: "The enclosure that houses all your components.",
  required: true,
  options: [
    {
      id: "case-1",
      name: "NZXT H510",
      brand: "NZXT",
      price: 100,
      amazonLink: "https://amzn.to/42DOPlO",
      specs: {
        type: "Mid Tower",
        material: "Steel, Tempered Glass",
        dimensions: "16.93 x 8.86 x 18.31 inches",
        weight: "15.7 lb",
        formFactor: "ATX, Micro-ATX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
      colorOptions: [whiteColor, blackColor],
      fanSlots: 4,
      preInstalledFans: 2
    },
    {
      id: "case-2",
      name: "CORSAIR 4000D RS ARGB",
      brand: "Corsair",
      price: 115,
      amazonLink: "https://amzn.to/42sUAnI",
      specs: {
        type: "Mid Tower",
        material: "Steel, Tempered Glass",
        dimensions: "18.04 pounds",
        weight: "18.04 lb",
        formFactor: "ATX, Micro-ATX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
      colorOptions: [whiteColor, blackColor],
      fanSlots: 7,
      preInstalledFans: 3
    },
    {
      id: "case-3",
      name: "Lian Li O11 Dynamic EVO",
      brand: "Lian Li",
      price: 250,
      amazonLink: "#",
      specs: {
        type: "Mid Tower",
        material: "Aluminum, Tempered Glass",
        dimensions: "18.31 x 11.22 x 18.07 IN",
        weight: "35.2 lb",
        formFactor: "ATX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
      colorOptions: [whiteColor, blackColor],
      fanSlots: 7,
      preInstalledFans: 0
    },
    {
      id: "case-4",
      name: "HYTE Revolt 3",
      brand: "HYTE",
      price: 135,
      amazonLink: "https://amzn.to/4cT4Fhl",
      specs: {
        type: "SFF",
        material: "Steel",
        dimensions: "9.9 x 7 x 16.1 in",
        weight: "11 kg",
        formFactor: "Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
      colorOptions: [blackColor, whiteColor],
      fanSlots: 4,
      preInstalledFans: 0
    },
    {
      id: "case-5",
      name: "Fractal Design Terra",
      brand: "Fractal Design",
      price: 185,
      amazonLink: "https://amzn.to/3Yhzjel",
      specs: {
        type: "SFF",
        material: "Steel",
        dimensions: "9.9 x 7 x 16.1 in",
        weight: "11 kg",
        formFactor: "Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
      colorOptions: [graphiteColor, silverColor,jadeColor],
      fanSlots: 4,
      preInstalledFans: 0
    },
    {
      id: "case-6",
      name: "MasterBox Q300L",
      brand: "Color Master",
      price: 42,
      amazonLink: "https://amzn.to/3YRS5sP",
      specs: {
        type: "Micro-ATX",
        material: "Steel",
        dimensions: "9.9 x 7 x 16.1 in",
        weight: "11 kg",
        formFactor: "Micro-ATX,Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
      colorOptions: [graphiteColor, silverColor,jadeColor],
      fanSlots: 5,
      preInstalledFans: 1
    },
    {
      id: "case-7",
      name: "Aqua 3",
      brand: "Okinos",
      price: 73,
      amazonLink: "https://amzn.to/3YKeOXK",
      specs: {
        type: "Micro-ATX",
        material: "Steel",
        dimensions: "13.78 x 8.27 x 15.43 in",
        weight: "9.7 lb",
        formFactor: "Micro-ATX,Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
          colorOptions: [blackColor, whiteColor],
      fanSlots: 5,
      preInstalledFans: 3
    },
    {
      id: "case-8",
      name: "AIR 100 ",
      brand: "Montech",
      price: 73,
      amazonLink: "https://amzn.to/3YKeOXK",
      specs: {
        type: "Micro-ATX",
        material: "Steel",
        dimensions: "13.78 x 8.27 x 15.43 in",
        weight: "9.7 lb",
        formFactor: "Micro-ATX,Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
          colorOptions: [blackColor, whiteColor],
      fanSlots: 7,
      preInstalledFans: 4
    },
    {
      id: "case-9",
      name: "A3 - Wood Front Solid Side",
      brand: "Lian Li",
      price: 100,
      amazonLink: "https://amzn.to/42OgDE6",
      specs: {
        type: "Micro-ATX",
        material: "Steel, Wood",
        dimensions: "13.78 x 8.27 x 15.43 in",
        weight: "9.7 lb",
        formFactor: "Micro-ATX,Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
          colorOptions: [blackColor, whiteColor],
      fanSlots: 7,
      preInstalledFans: 0
    },      
    {
      id: "case-10",
      name: "A3 - Wood Front Glass Side",
      brand: "Lian Li",
      price: 100,
      amazonLink: "https://amzn.to/42OgDE6",
      specs: {
        type: "Micro-ATX",
        material: "Steel, Tempered Glass, Wood",
        dimensions: "13.78 x 8.27 x 15.43 in",
        weight: "9.7 lb",
        formFactor: "Micro-ATX,Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
          colorOptions: [blackColor, whiteColor],
      fanSlots: 7,
      preInstalledFans: 0
    },
    {
      id: "case-10",
      name: "A3 - Wood Front Glass Side",
      brand: "Lian Li",
      price: 100,
      amazonLink: "https://amzn.to/42OgDE6",
      specs: {
        type: "Micro-ATX",
        material: "Steel, Tempered Glass, Wood",
        dimensions: "13.78 x 8.27 x 15.43 in",
        weight: "9.7 lb",
        formFactor: "Micro-ATX,Mini-ITX"
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format",
          colorOptions: [blackColor, whiteColor],
      fanSlots: 7,
      preInstalledFans: 0
    }    
  ]
};
