
import { ComponentCategory } from "@/types/types";

export const fanComponents: ComponentCategory = {
  id: "fans",
  name: "Additional Fans",
  description: "Add more cooling capacity to your system.",
  required: false,
  options: [
    {
      id: "fan-1",
      name: "RGB Gaming Fan Pack",
      brand: "Corsair",
      price: 24.99,
      amazonLink: "#",
      specs: {
        type: "Case Fan",
        size: "120mm",
        airflow: "52 CFM",
        rgb: "Yes",
        noise: "26 dBA",
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format"
    },
    {
      id: "fan-2",
      name: "Silent Performance Fan",
      brand: "Noctua",
      price: 29.99,
      amazonLink: "#",
      specs: {
        type: "Case Fan",
        size: "140mm",
        airflow: "68 CFM",
        rgb: "No",
        noise: "19 dBA",
      },
      imageUrl: "https://images.unsplash.com/photo-1624914023435-4cf3cb4e6e25?q=80&w=2574&auto=format"
    }
  ]
};
