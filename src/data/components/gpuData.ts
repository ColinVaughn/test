
import { ComponentCategory } from "@/types/types";

export const gpuComponents: ComponentCategory = {
  id: "gpu",
  name: "Graphics Card (GPU)",
  description: "Powers the visual elements and graphics rendering for games and applications.",
  required: true,
  options: [
    {
      id: "gpu-1",
      name: "NVIDIA RTX 5060TI - 8GB",
      brand: "NVIDIA",
      price: 525,
      amazonLink: "#",
      wattage: 650,
      specs: {
        memory: "8GB GDDR6",
        boostClock: "2.57 GHz",
        rtCores: "36",
        tensorCores: "144",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
    {
      id: "gpu-2",
      name: "NVIDIA RTX 5060 TI - 16GB",
      brand: "NVIDIA",
      price: 599.99,
      amazonLink: "#",
      wattage: 650,
      specs: {
        memory: "16GB GDDR6X",
        boostClock: "2.57 GHz",
        rtCores: "36",
        tensorCores: "144",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
    {
      id: "gpu-3",
      name: "NVIDIA RTX 5070",
      brand: "NVIDIA",
      price: 800,
      amazonLink: "#",
      wattage: 700,
      specs: {
        memory: "12GB GDDR6X",
        boostClock: "2.6 GHz",
        rtCores: "48",
        tensorCores: "192",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
    {
      id: "gpu-4",
      name: "NVIDIA RTX 5070 TI",
      brand: "NVIDIA",
      price: 1050,
      amazonLink: "#",
      wattage: 700,
      specs: {
        memory: "16GB GDDR6X",
        boostClock: "2.52 GHz",
        rtCores: "70",
        tensorCores: "280",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
    {
      id: "gpu-5",
      name: "NVIDIA RTX 5080 ",
      brand: "NVIDIA",
      price: 1600,
      amazonLink: "#",
      wattage: 850,
      specs: {
        memory: "16GB GDDR6X",
        boostClock: "2.52 GHz",
        rtCores: "84",
        tensorCores: "336",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
    {
      id: "gpu-6",
      name: "NVIDIA RTX 5090 ",
      brand: "NVIDIA",
      price: 3500,
      amazonLink: "#",
      wattage: 1000,
      specs: {
        memory: "32GB GDDR6X",
        boostClock: "2.55 GHz",
        rtCores: "170",
        tensorCores: "680",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
    {
      id: "gpu-7",
      name: "RX 6600 ",
      brand: "AMD",
      price: 225,
      amazonLink: "#",
      wattage: 500,
      specs: {
        memory: "8GB GDDR6",
        boostClock: "2044 GHz",
        rtCores: "28",
        computeUnits: "28",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
    {
      id: "gpu-8",
      name: "RTX 2060 6GB ",
      brand: "NVIDIA",
      price: 550,
      amazonLink: "#",
      wattage: 165,
      specs: {
        memory: "6GB GDDR6",
        boostClock: "2044 GHz",
        rtCores: "28",
        computeUnits: "28",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },    
    {
      id: "gpu-9",
      name: "RTX 3060 12GB ",
      brand: "NVIDIA",
      price: 380,
      amazonLink: "#",
      wattage: 550,
      specs: {
        memory: "12GB GDDR6",
        boostClock: "2044 GHz",
        rtCores: "28",
        computeUnits: "28",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    },
{
      id: "gpu-10",
      name: "RTX 4060 8GB ",
      brand: "NVIDIA",
      price: 460,
      amazonLink: "#",
      wattage: 550,
      specs: {
        memory: "8GB GDDR6",
        boostClock: "2044 GHz",
        rtCores: "28",
        computeUnits: "28",
        rayTracingSupport: "Yes"
      },
      imageUrl: ""
    }    
    
  ]
};
