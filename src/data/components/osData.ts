import { ComponentCategory } from "@/types/types";
import { storageComponents } from "./storageData";

export const osComponents: ComponentCategory = {
  id: "os",
  name: "Operating System",
  description: "Software that manages computer hardware and provides common services for programs.",
  required: false,
  options: [
    {
      id: "os-1",
      name: "Windows 11 Home",
      brand: "Microsoft",
      price: 0,
      amazonLink: "#",
      specs: {
        version: "Windows 11 Home",
        bits: "64-bit",
        license: "Retail",
        activationType: "License",
      }
    },
    {
      id: "os-2",
      name: "Windows 11 Pro",
      brand: "Microsoft",
      price: 100,
      amazonLink: "#",
      specs: {
        version: "Windows 11 Pro",
        bits: "64-bit",
        license: "Retail",
        activationType: "License",
      }
    },
    {
      id: "os-4",
      name: "Linux",
      brand: "Linux",
      price: 0,
      amazonLink: "#",
      specs: {
        details: "Contact us about the distro you prefer."
      }
    }    
  ]
};

export const additionalComponents: ComponentCategory = {
  id: "additional",
  name: "Additional Storage",
  description: "Add more storage drives to enhance your build.",
  required: false,
  options: storageComponents.options.map(option => ({
    ...option,
    id: `additional-${option.id}`,
    name: `Additional ${option.name}`
  }))
};
