
import { Component, Wrench, Check, Truck } from "lucide-react";

const CustomizeSteps = () => {
  const steps = [
    {
      number: 1,
      title: "Select Components",
      description: "Choose from our curated selection of premium PC parts.",
      icon: Component,
      iconBgColor: "bg-gaming-blue/20",
      iconColor: "text-gaming-blue",
      numberBgColor: "bg-gaming-blue"
    },
    {
      number: 2,
      title: "Expert Assembly",
      description: "Professional technicians build your system with care.",
      icon: Wrench,
      iconBgColor: "bg-gaming-purple/20",
      iconColor: "text-gaming-purple",
      numberBgColor: "bg-gaming-purple"
    },
    {
      number: 3,
      title: "Rigorous Testing",
      description: "48-hour stress testing ensures peak performance.",
      icon: Check,
      iconBgColor: "bg-gaming-red/20",
      iconColor: "text-gaming-red",
      numberBgColor: "bg-gaming-red"
    },
    {
      number: 4,
      title: "Fast Delivery",
      description: "Your custom PC shipped directly to your door.",
      icon: Truck,
      iconBgColor: "bg-green-500/20",
      iconColor: "text-green-500",
      numberBgColor: "bg-green-500"
    }
  ];

  return (
    <section className="py-16 bg-gaming-dark">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-white font-orbitron">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div 
              key={step.number}
              className="bg-gaming-darker p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center relative transform hover:scale-105 transition-transform duration-300"
            >
              <div className={`absolute -top-4 ${step.numberBgColor} w-8 h-8 rounded-full flex items-center justify-center font-bold text-white`}>
                {step.number}
              </div>
              <div className={`${step.iconBgColor} p-4 rounded-full mb-4 mt-4`}>
                <step.icon className={`h-6 w-6 ${step.iconColor}`} />
              </div>
              <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
              <p className="text-gray-300 text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomizeSteps;
