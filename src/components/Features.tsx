
import { Cpu, Package, Monitor, Fan } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: <Cpu className="h-12 w-12 text-gaming-blue" />,
      title: "Premium Components",
      description: "We use only the highest quality components from the most reputable manufacturers."
    },
    {
      icon: <Package className="h-12 w-12 text-gaming-purple" />,
      title: "Expert Assembly",
      description: "Each system is meticulously built by experienced technicians with keen attention to detail."
    },
    {
      icon: <Monitor className="h-12 w-12 text-gaming-red" />,
      title: "Extensive Testing",
      description: "Every PC undergoes rigorous stress testing to ensure stability and optimal performance."
    },
    {
      icon: <Fan className="h-12 w-12 text-gaming-blue" />,
      title: "3-Year Warranty",
      description: "We stand behind our builds with comprehensive coverage and lifetime technical support."
    }
  ];

  return (
    <section className="py-16 bg-gaming-dark">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Why Choose <span className="text-gaming-blue">BattleForge</span></h2>
          <p className="max-w-2xl mx-auto text-gray-400">
            We don't just build computers - we craft gaming experiences with uncompromising quality and performance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center text-center">
              <div className="mb-5 p-3 rounded-full rgb-border bg-gaming-dark inline-flex">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
