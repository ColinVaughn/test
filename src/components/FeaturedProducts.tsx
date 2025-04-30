
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, HardDrive, MemoryStick } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const FeaturedProducts = () => {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: "Apex Legend",
      category: "Gaming PC",
      price: 1499,
      image: "https://images.unsplash.com/photo-1587202372616-b43abea06c2a?q=80&w=2574&auto=format",
      specs: [
        { icon: <Cpu size={14} />, text: "Intel Core i7-13700K" },
        { icon: <HardDrive size={14} />, text: "RTX 4070 12GB" },
        { icon: <MemoryStick size={14} />, text: "32GB DDR5 RAM" },
      ],
      featured: true,
    },
    {
      id: 2,
      name: "Creator Pro",
      category: "Workstation",
      price: 2299,
      image: "https://images.unsplash.com/photo-1591405351990-4726e331f141?q=80&w=2670&auto=format",
      specs: [
        { icon: <Cpu size={14} />, text: "AMD Ryzen 9 7950X" },
        { icon: <HardDrive size={14} />, text: "RTX 4080 16GB" },
        { icon: <MemoryStick size={14} />, text: "64GB DDR5 RAM" },
      ],
    },
    {
      id: 3,
      name: "Stealth Mini",
      category: "SFF PC",
      price: 1199,
      image: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?q=80&w=2631&auto=format",
      specs: [
        { icon: <Cpu size={14} />, text: "Intel Core i5-13600K" },
        { icon: <HardDrive size={14} />, text: "RTX 4060 Ti 8GB" },
        { icon: <MemoryStick size={14} />, text: "16GB DDR5 RAM" },
      ],
    },
  ];

  const handleBuyNow = (productId: number) => {
    navigate(`/prebuilt?id=${productId}`);
  };

  const handleCustomize = (productId: number) => {
    navigate(`/customize?template=${productId}`);
  };

  return (
    <section className="py-16 bg-gaming-darker">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-3xl font-bold text-white">Featured Systems</h2>
          <Link to="/prebuilt" className="text-gaming-blue hover:underline">View all systems</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="gaming-card border border-gaming-light-gray/40 bg-gaming-dark h-full flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-56 w-full overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  {product.featured && (
                    <Badge className="absolute top-3 left-3 bg-gaming-purple text-white font-medium">Featured</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-6 flex-grow">
                <div className="mb-3 flex justify-between items-center">
                  <Badge variant="outline" className="bg-gaming-light-gray/20 text-gray-300 hover:bg-gaming-light-gray/30">
                    {product.category}
                  </Badge>
                  <span className="text-gaming-blue font-bold">${product.price}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">{product.name}</h3>
                <ul className="space-y-2">
                  {product.specs.map((spec, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-gray-400 text-sm">
                      {spec.icon}
                      <span>{spec.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="pt-0 pb-6 flex gap-3">
                <Button 
                  className="flex-1 bg-gaming-blue hover:bg-gaming-blue/80 text-white"
                  onClick={() => handleBuyNow(product.id)}
                >
                  Buy Now
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10"
                  onClick={() => handleCustomize(product.id)}
                >
                  Customize
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
