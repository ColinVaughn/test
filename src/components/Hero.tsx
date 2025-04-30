import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Award, Clock, Shield, Store } from "lucide-react";
import { lazy, Suspense } from "react";

// Simplified background for faster initial render
const SimpleBackground = () => (
  <div className="absolute inset-0 z-0">
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gaming-blue/10 via-gaming-purple/10 to-gaming-red/10 opacity-30"></div>
  </div>
);

// Lazy-loaded complex background pattern that will render after main content
const ComplexBackground = lazy(() => import("./HeroBackground"));

const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Simple background for fast initial render */}
      <SimpleBackground />
      
      {/* Lazy-loaded complex background */}
      <Suspense fallback={null}>
        <ComplexBackground />
      </Suspense>

      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">
          <div className="lg:w-full">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-red">
              Custom Gaming PCs
              <br />
              <span className="text-white">Built For Champions</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Experience unparalleled performance with our expertly crafted custom gaming computers. 
              From casual gaming to professional eSports, we build systems that elevate your gaming experience 
              with premium components and meticulous attention to detail.
            </p>
            
            {/* Key Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8 bg-gaming-dark/50 p-6 rounded-lg backdrop-blur-sm border border-gaming-light-gray/20">
              <div className="flex items-center gap-4">
                <Award className="h-8 w-8 text-gaming-blue shrink-0" />
                <div>
                  <div className="text-gaming-blue text-2xl font-bold">3+ Years</div>
                  <div className="text-gray-400 text-sm">Premium Warranty</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Clock className="h-8 w-8 text-gaming-purple shrink-0" />
                <div>
                  <div className="text-gaming-purple text-2xl font-bold">48+ Hours</div>
                  <div className="text-gray-400 text-sm">Stress Testing</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Shield className="h-8 w-8 text-gaming-red shrink-0" />
                <div>
                  <div className="text-gaming-red text-2xl font-bold">Premium</div>
                  <div className="text-gray-400 text-sm">Components</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Store className="h-8 w-8 text-gaming-blue shrink-0" />
                <div>
                  <Link to="/marketplace" className="group">
                    <div className="text-gaming-blue text-2xl font-bold">Marketplace</div>
                    <div className="text-gray-400 text-sm group-hover:text-gaming-blue transition-colors">Buy & Sell Parts</div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild className="bg-gaming-blue hover:bg-gaming-blue/80 text-white font-medium py-6 px-8 text-lg">
                <Link to="/customize">Customize Your PC</Link>
              </Button>
              <Button asChild variant="outline" className="border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10 text-white font-medium py-6 px-8 text-lg">
                <Link to="/prebuilt">View Pre-built Systems</Link>
              </Button>
              <Button asChild variant="outline" className="border-gaming-purple/50 hover:border-gaming-purple hover:bg-gaming-purple/10 text-white font-medium py-6 px-8 text-lg">
                <Link to="/marketplace">
                  <Store className="h-5 w-5 mr-2" />
                  Marketplace
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
