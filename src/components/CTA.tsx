
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background with glow effect */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gaming-blue/5"></div>
        <div className="absolute h-full w-1/3 top-0 left-1/3 bg-gaming-purple/5 blur-3xl rounded-full"></div>
        <div className="absolute h-full w-1/3 top-0 right-0 bg-gaming-red/5 blur-3xl rounded-full"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Ready to Experience Next-Level Gaming?
          </h2>
          <p className="text-xl text-gray-300 mb-10">
            Design your dream PC with our advanced configurator and get real-time pricing from Amazon.
          </p>
          <Button asChild className="bg-gaming-purple hover:bg-gaming-purple/80 text-white px-8 py-6 text-lg font-medium">
            <Link to="/customize">Build Your Dream PC</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTA;
