import { ComponentCategory } from "@/types/types";

export const storageComponents: ComponentCategory = {
  id: "storage",
  name: "Storage",
  description: "Long-term data storage for your operating system, programs, and files.",
  required: true,
  options: [
    {
      id: "storage-1",
      name: "Samsung 980 Pro 1TB",
      brand: "Samsung",
      price: 99.99,
      amazonLink: "#",
      specs: {
        capacity: "1TB",
        type: "NVMe SSD",
        interface: "PCIe 4.0",
        readSpeed: "7000 MB/s",
        writeSpeed: "5000 MB/s"
      },
      imageUrl: ""
    },
    {
      id: "storage-2",
      name: "Samsung 990 Pro 2TB",
      brand: "Samsung",
      price: 189.99,
      amazonLink: "#",
      specs: {
        capacity: "2TB",
        type: "NVMe SSD",
        interface: "PCIe 4.0",
        readSpeed: "7450 MB/s",
        writeSpeed: "6900 MB/s"
      },
      imageUrl: ""
    },
    {
      id: "storage-3",
      name: "WD Black SN850X 2TB",
      brand: "Western Digital",
      price: 179.99,
      amazonLink: "#",
      specs: {
        capacity: "2TB",
        type: "NVMe SSD",
        interface: "PCIe 4.0",
        readSpeed: "7300 MB/s",
        writeSpeed: "6600 MB/s"
      },
      imageUrl: ""
    },
    {
      id: "storage-4",
      name: "Crucial P3 Plus 4TB",
      brand: "Crucial",
      price: 259.99,
      amazonLink: "#",
      specs: {
        capacity: "4TB",
        type: "NVMe SSD",
        interface: "PCIe 4.0",
        readSpeed: "5000 MB/s",
        writeSpeed: "4200 MB/s"
      },
      imageUrl: ""
    },
    {
      id: "storage-5",
      name: "Silicon Power 1TB",
      brand: "Silicon Power",
      price: 60,
      amazonLink: "https://amzn.to/4jUrm7a",
      specs: {
        capacity: "1TB",
        type: "NVMe SSD",
        interface: "PCIe 3.0",
        readSpeed: "2200 MB/s",
        writeSpeed: "1600 MB/s"
      },
      imageUrl: ""
    },    
    {
      id: "storage-6",
      name: "Silicon Power 2TB",
      brand: "Silicon Power",
      price: 105,
      amazonLink: "https://amzn.to/4lQ58om",
      specs: {
        capacity: "2TB",
        type: "NVMe SSD",
        interface: "PCIe 3.0",
        readSpeed: "2200 MB/s",
        writeSpeed: "1600 MB/s"
      }    },   
    {
      id: "storage-7",
      name: "KingSpec 1TB",
      brand: "KingSpec",
      price: 55,
      amazonLink: "https://amzn.to/4lQ58om",
      specs: {
        capacity: "1TB",
        type: "NVMe SSD",
        interface: "PCIe 3.0",
        readSpeed: "2400 MB/s",
        writeSpeed: "1600 MB/s"
      }
    }    
  ]
};
