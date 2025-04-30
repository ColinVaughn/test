import { ComponentCategory } from "@/types/types";

export const ramComponents: ComponentCategory = {
  id: "ram",
  name: "Memory (RAM)",
  description: "Temporary storage for data that your computer is actively using.",
  required: true,
  options: [
    {
      id: "ram-1",
      name: "TEAMGROUP Elite",
      brand: "TEAMGROUP",
      price: 27,
      amazonLink: "https://amzn.to/4cOA6co",
      specs: {
        type: "DDR4",
        timing: "CL22 ",
        voltage: "1.2V",
        memoryType: "DDR4"
      },
      ramSizes: [
        {
          id: "ram-1-16gb",
          size: "16GB",
          modules: "2x8GB",
          speed: "3200MHZ",
          price: 0,
          colorOptions: [
            {
              id: "ram-1-16gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-1-16gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        },
        {
          id: "ram-1-32gb",
          size: "32GB",
          modules: "2x16GB",
          speed: "3200MHZ",
          price: 28,
          colorOptions: [
            {
              id: "ram-1-32gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-1-32gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        },
        {
          id: "ram-1-64gb",
          size: "64GB",
          modules: "2x32GB",
          speed: "5600MHz",
          price: 93,
          colorOptions: [
            {
              id: "ram-1-64gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-1-64gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        }
      ],
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//71o-WkkS8hL._AC_SL1500__11zon.webp"
    },
    {
      id: "ram-2",
      name: "OLOy DDR4",
      brand: "OLOy",
      price: 30,
      amazonLink: "https://amzn.to/4jzt3as",
      specs: {
        type: "DDR4",
        timing: "CL36",
        voltage: "1.35V",
        memoryType: "DDR4"
      },
      ramSizes: [
        {
          id: "ram-2-16gb",
          size: "16GB",
          modules: "2x8GB",
          speed: "3200MHz",
          price: 0,
          colorOptions: [
            {
              id: "ram-2-16gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-2-16gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        },
        {
          id: "ram-2-32gb",
          size: "32GB",
          modules: "2x16GB",
          speed: "3200MHZ",
          price: 25,
          colorOptions: [
            {
              id: "ram-2-32gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-2-32gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        },
        {
          id: "ram-2-64gb",
          size: "64GB",
          modules: "2x32GB",
          speed: "6000MHz",
          price: 105,
          colorOptions: [
            {
              id: "ram-2-64gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-2-64gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        }
      ],
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=2039&auto=format"
    },
    {
      id: "ram-3",
      name: "TEAMGROUP T-Force Delta",
      brand: "TEAMGROUP",
      price: 38.99,
      amazonLink: "https://amzn.to/3RzMl2V",
      specs: {
        type: "DDR4",
        timing: "CL16",
        voltage: "1.40V",
        memoryType: "DDR4"
      },
      ramSizes: [
        {
          id: "ram-3-16gb",
          size: "16GB",
          modules: "2x8GB",
          speed: "3200MHZ",
          price: 0,
          colorOptions: [
            {
              id: "ram-3-16gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-3-16gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        },
        {
          id: "ram-3-32gb",
          size: "32GB",
          modules: "2x16GB",
          speed: "3200MHZ",
          price: 25,
          colorOptions: [
            {
              id: "ram-3-32gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-3-32gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        },
        {
          id: "ram-3-64gb",
          size: "64GB",
          modules: "2x32GB",
          speed: "3200MHZ",
          price: 160,
          colorOptions: [
            {
              id: "ram-3-64gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-3-64gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        }
      ],
      imageUrl: "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=2039&auto=format"
    },
    {
      id: "ram-4",
      name: "G.SKILL Trident Z5",
      brand: "G.Skill",
      price: 120,
      amazonLink: "https://amzn.to/4juIwIJ",
      specs: {
        type: "DDR5",
        timing: "CL32",
        voltage: "1.40V",
        memoryType: "DDR5"
      },
      ramSizes: [
        {
          id: "ram-4-32gb",
          size: "32GB",
          modules: "2x16GB",
          speed: "6000MHZ",
          price: 0,
          colorOptions: [
            {
              id: "ram-4-32gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-4-32gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        },
        {
          id: "ram-4-64gb",
          size: "64GB",
          modules: "2x32GB",
          speed: "6000MHZ",
          price: 110,
          colorOptions: [
            {
              id: "ram-4-64gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-4-64gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        }
      ],
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//71DiVTefKBL._AC_SL1500__11zon.webp"
    },
    {
      id: "ram-5",
      name: "CORSAIR VENGEANCE RGB",
      brand: "Corsair",
      price: 130,
      amazonLink: "https://amzn.to/4lRRh1a",
      specs: {
        type: "DDR5",
        timing: "CL36",
        voltage: "1.35V",
        memoryType: "DDR5"
      },
      ramSizes: [
        {
          id: "ram-5-32gb",
          size: "32GB",
          modules: "2x32GB",
          speed: "6400MHz",
          price: 0,
          colorOptions: [
            {
              id: "ram-5-32gb-black",
              name: "Black",
              hexCode: "#000000",
              price: 0
            },
            {
              id: "ram-5-32gb-white",
              name: "White",
              hexCode: "#FFFFFF",
              price: 5
            }
          ]
        }
      ],
      imageUrl: "https://xyhebqsgccwvmigqkwam.supabase.co/storage/v1/object/public/product-images//61D2DDpDITL._AC_SL1500_.webp"
    }
  ]
};
