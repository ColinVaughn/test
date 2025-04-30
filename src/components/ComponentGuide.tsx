
import { Link } from 'react-router-dom';
import { Cpu, HardDrive, Gauge, Info, CheckCircle } from 'lucide-react';

const ComponentGuide = () => {
  return (
    <section className="bg-gaming-dark/50 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">PC Component Buying Guide</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gaming-blue mb-4">How to Choose the Right Components</h3>
            <p className="text-gray-300 mb-6">
              Selecting the right components is crucial for building a balanced system that meets your performance needs
              without unnecessary expenses. Our guide helps you understand the key factors to consider for each component.
            </p>
            
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gaming-blue shrink-0 mt-1" />
                <span className="text-gray-300">Understand your performance requirements before purchasing</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gaming-blue shrink-0 mt-1" />
                <span className="text-gray-300">Ensure compatibility between all components</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gaming-blue shrink-0 mt-1" />
                <span className="text-gray-300">Consider future upgradability when selecting a motherboard and case</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-gaming-blue shrink-0 mt-1" />
                <span className="text-gray-300">Don't skimp on the power supply; it's the foundation of your system</span>
              </li>
            </ul>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-gaming-darker p-6 rounded-lg">
              <div className="bg-gaming-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Cpu className="h-6 w-6 text-gaming-blue" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Processors</h4>
              <p className="text-sm text-gray-400 mb-4">Core count, clock speed, and architecture are key factors</p>
              <Link to="/components/processors" className="text-gaming-blue text-sm hover:underline">Learn more</Link>
            </div>
            
            <div className="bg-gaming-darker p-6 rounded-lg">
              <div className="bg-gaming-red/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <HardDrive className="h-6 w-6 text-gaming-red" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Storage</h4>
              <p className="text-sm text-gray-400 mb-4">SSD for speed, HDD for capacity, NVMe for best performance</p>
              <Link to="/components/storage" className="text-gaming-red text-sm hover:underline">Learn more</Link>
            </div>
            
            <div className="bg-gaming-darker p-6 rounded-lg">
              <div className="bg-gaming-purple/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Gauge className="h-6 w-6 text-gaming-purple" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Performance</h4>
              <p className="text-sm text-gray-400 mb-4">Balancing components for optimal system performance</p>
              <Link to="/customize" className="text-gaming-purple text-sm hover:underline">Learn more</Link>
            </div>
            
            <div className="bg-gaming-darker p-6 rounded-lg">
              <div className="bg-gaming-blue/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Info className="h-6 w-6 text-gaming-blue" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">Compatibility</h4>
              <p className="text-sm text-gray-400 mb-4">Ensuring all parts work together seamlessly</p>
              <Link to="/support" className="text-gaming-blue text-sm hover:underline">Learn more</Link>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link to="/customize" className="inline-block bg-gaming-blue hover:bg-gaming-blue/80 text-white font-medium py-3 px-6 rounded-md transition-colors">
            Start Building Your PC
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ComponentGuide;
