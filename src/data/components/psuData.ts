
import { ComponentCategory } from "@/types/types";

export const psuComponents: ComponentCategory = {
  id: "psu",
  name: "Power Supply (PSU)",
  description: "Converts AC power to DC and supplies electricity to all components.",
  required: true,
  options: [
    {
      id: "psu-1",
      name: "Corsair RM750x",
      brand: "Corsair",
      price: 119.99,
      amazonLink: "#",
      wattage: 750,
      specs: {
        wattage: "750W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        fanSize: "135mm",
        warranty: "10 Year"
      },
      imageUrl: ""
    },
    {
      id: "psu-2",
      name: "Corsair RM850x",
      brand: "Corsair",
      price: 149.99,
      amazonLink: "#",
      wattage: 850,
      specs: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        fanSize: "135mm",
        warranty: "10 Year"
      },
      imageUrl: ""
    },
    {
      id: "psu-3",
      name: "EVGA Supernova 1000 G6",
      brand: "EVGA",
      price: 199.99,
      amazonLink: "#",
      wattage: 1000,
      specs: {
        wattage: "1000W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        fanSize: "140mm",
        warranty: "10 Year"
      },
      imageUrl: ""
    },
    {
      id: "psu-4",
      name: "Seasonic Prime TX-1000",
      brand: "Seasonic",
      price: 269.99,
      amazonLink: "#",
      wattage: 1000,
      specs: {
        wattage: "1000W",
        efficiency: "80+ Titanium",
        modularity: "Fully Modular",
        fanSize: "135mm",
        warranty: "12 Year"
      },
      imageUrl: ""
      },
    {
      id: "psu-5",
      name: "AGV Series 500W",
      brand: "AGV",
      price: 50,
      amazonLink: "#",
      wattage: 500,
      specs: {
        wattage: "500W",
        efficiency: "80+ Bronze",
        modularity: "Non Modular",
        fanSize: "135mm",
        warranty: "4 Year"
      },
      imageUrl: ""
      },    
    {
      id: "psu-6",
      name: "PMT 850",
      brand: "Dark Flash",
      price: 100,
      amazonLink: "#",
      wattage: 850,
      specs: {
        wattage: "850W",
        efficiency: "80+ Gold",
        modularity: "Fully Modular",
        fanSize: "135mm",
        warranty: "4 Year"
      },
      imageUrl: ""
      },
    {
      id: "psu-7",
      name: "Toughpower GX2",
      brand: "ThermalTake",
      price: 70,
      amazonLink: "#",
      wattage: 650,
      specs: {
        wattage: "650W",
        efficiency: "80+ Gold",
        modularity: "Non Modular",
        fanSize: "135mm",
        warranty: "4 Year"
      },
      imageUrl: ""
      }    
    ]
  };
