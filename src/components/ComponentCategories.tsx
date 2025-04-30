
import { Link } from "react-router-dom";
import { Cpu, HardDrive, Monitor, Gamepad2, Fan, CircuitBoard, Power, Keyboard, MemoryStick, BoxIcon } from "lucide-react";

const ComponentCategories = () => {
  const categories = [
    {
      name: "Processors",
      icon: <Cpu className="h-6 w-6" />,
      description: "High-performance CPUs from AMD and Intel",
      link: "/components/processors"
    },
    {
      name: "Graphics Cards",
      icon: <Gamepad2 className="h-6 w-6" />,
      description: "Gaming and professional GPUs from NVIDIA and AMD",
      link: "/components/graphics-cards"
    },
    {
      name: "Memory",
      icon: <MemoryStick className="h-6 w-6" />,
      description: "High-speed DDR4 and DDR5 RAM modules",
      link: "/components/memory"
    },
    {
      name: "Storage",
      icon: <HardDrive className="h-6 w-6" />,
      description: "SSDs, M.2 drives, and HDD storage solutions",
      link: "/components/storage"
    },
    {
      name: "Motherboards",
      icon: <CircuitBoard className="h-6 w-6" />,
      description: "Gaming and professional motherboards",
      link: "/components/motherboards"
    },
    {
      name: "Power Supplies",
      icon: <Power className="h-6 w-6" />,
      description: "Reliable and efficient power supplies",
      link: "/components/power-supplies"
    },
    {
      name: "Cases",
      icon: <BoxIcon className="h-6 w-6" />,
      description: "PC cases with excellent airflow and aesthetics",
      link: "/components/cases"
    },
    {
      name: "Cooling",
      icon: <Fan className="h-6 w-6" />,
      description: "Air and liquid cooling solutions",
      link: "/components/cooling"
    },
    {
      name: "Monitors",
      icon: <Monitor className="h-6 w-6" />,
      description: "Gaming and professional displays",
      link: "/components/monitors"
    },
    {
      name: "Peripherals",
      icon: <Keyboard className="h-6 w-6" />,
      description: "Keyboards, mice, and gaming accessories",
      link: "/components/peripherals"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
      {categories.map((category, index) => (
        <Link 
          to={category.link} 
          key={index}
          className="bg-gaming-dark p-5 rounded-lg hover:bg-gaming-dark/80 border border-gaming-light-gray/20 hover:border-gaming-blue/30 transition-all transform hover:scale-105 duration-300"
        >
          <div className="flex flex-col items-center text-center">
            <div className="bg-gaming-blue/10 p-4 rounded-full mb-4">
              {category.icon}
            </div>
            <h2 className="text-lg font-semibold text-white mb-2">{category.name}</h2>
            <p className="text-gray-400 text-sm">{category.description}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ComponentCategories;
