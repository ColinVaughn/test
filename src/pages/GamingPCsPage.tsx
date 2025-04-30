
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Gamepad2, Cpu, MonitorPlay, CircuitBoard, Zap, ChevronRight } from "lucide-react";

const GamingPCsPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Helmet>
        <title>Gaming PCs | High-Performance Gaming Computers | BattleforgePC</title>
        <meta 
          name="description" 
          content="Discover our collection of high-performance gaming PCs, built with the latest technology and optimized for maximum gaming performance at competitive prices." 
        />
        <meta 
          name="keywords" 
          content="gaming pc, gaming computer, high-performance gaming, custom gaming pc, rtx gaming pc, amd gaming pc, intel gaming pc" 
        />
        <link rel="canonical" href="https://www.battleforgepc.com/gaming-pcs" />
        
        {/* Schema.org markup for Product Collection */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Gaming PCs Collection",
            "description": "High-performance gaming computers built with premium components",
            "url": "https://www.battleforgepc.com/gaming-pcs",
            "isPartOf": {
              "@type": "WebSite",
              "name": "BattleforgePC",
              "url": "https://www.battleforgepc.com"
            }
          }
        `}</script>
        
        {/* Schema.org markup for BreadcrumbList */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.battleforgepc.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Gaming PCs",
                "item": "https://www.battleforgepc.com/gaming-pcs"
              }
            ]
          }
        `}</script>
      </Helmet>
      <Header />
      <main className="container mx-auto py-12 px-4">
        <nav className="mb-8">
          <ol className="flex text-sm">
            <li className="text-gray-400">
              <Link to="/" className="hover:text-gaming-blue">Home</Link>
            </li>
            <li className="mx-2 text-gray-400">/</li>
            <li className="text-gaming-blue">Gaming PCs</li>
          </ol>
        </nav>
      
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Gaming PCs</h1>
        <div className="h-1 w-24 bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-red mb-8"></div>
        
        <div className="bg-gaming-dark/30 rounded-lg p-8 mb-12">
          <p className="text-gray-300 text-lg mb-6">
            Discover our collection of high-performance gaming PCs, built with the latest technology
            and optimized for maximum gaming performance. Each system is meticulously assembled by our team
            of experienced technicians and undergoes extensive testing to ensure reliability and exceptional
            gaming experiences.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
            <div className="bg-gaming-dark rounded-lg p-6 border border-gaming-light-gray/20 hover:border-gaming-blue/30 transition-all">
              <div className="bg-gaming-blue/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6 text-gaming-blue" />
              </div>
              <h3 className="text-xl font-semibold text-gaming-blue mb-3">Entry-Level Gaming</h3>
              <p className="text-gray-400 mb-4">Perfect for esports titles and casual gaming at 1080p.</p>
              <Link to="/prebuilt" className="text-gaming-blue flex items-center text-sm hover:underline">
                Explore Options <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-gaming-dark rounded-lg p-6 border border-gaming-light-gray/20 hover:border-gaming-purple/30 transition-all">
              <div className="bg-gaming-purple/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <MonitorPlay className="w-6 h-6 text-gaming-purple" />
              </div>
              <h3 className="text-xl font-semibold text-gaming-purple mb-3">Mid-Range Gaming</h3>
              <p className="text-gray-400 mb-4">Balanced performance for 1440p gaming with high framerates.</p>
              <Link to="/prebuilt" className="text-gaming-purple flex items-center text-sm hover:underline">
                Explore Options <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="bg-gaming-dark rounded-lg p-6 border border-gaming-light-gray/20 hover:border-gaming-red/30 transition-all">
              <div className="bg-gaming-red/10 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                <Cpu className="w-6 h-6 text-gaming-red" />
              </div>
              <h3 className="text-xl font-semibold text-gaming-red mb-3">High-End Gaming</h3>
              <p className="text-gray-400 mb-4">Ultimate performance for 4K gaming and content creation.</p>
              <Link to="/prebuilt" className="text-gaming-red flex items-center text-sm hover:underline">
                Explore Options <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col md:flex-row gap-6 justify-center">
            <Button asChild className="bg-gaming-blue hover:bg-gaming-blue/80 text-white font-medium py-6 px-8 text-lg">
              <Link to="/prebuilt">Browse Pre-built Systems</Link>
            </Button>
            <Button asChild variant="outline" className="border-gaming-blue/50 hover:border-gaming-blue hover:bg-gaming-blue/10 text-white font-medium py-6 px-8 text-lg">
              <Link to="/customize">Customize Your PC</Link>
            </Button>
          </div>
        </div>
        
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Why Choose BattleforgePC?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gaming-dark/50 p-6 rounded-lg border border-gaming-light-gray/20">
              <div className="flex gap-4 items-start mb-4">
                <div className="bg-gaming-blue/20 p-3 rounded-full">
                  <CircuitBoard className="h-6 w-6 text-gaming-blue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Premium Components</h3>
                  <p className="text-gray-300">We use only the highest quality, name-brand components in all our gaming PCs.</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gaming-dark/50 p-6 rounded-lg border border-gaming-light-gray/20">
              <div className="flex gap-4 items-start mb-4">
                <div className="bg-gaming-purple/20 p-3 rounded-full">
                  <Zap className="h-6 w-6 text-gaming-purple" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">Expert Assembly</h3>
                  <p className="text-gray-300">Each PC is hand-built by experienced technicians who pay attention to every detail.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section>
          <h2 className="text-3xl font-bold text-white mb-8">Related Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/workstations" className="block bg-gaming-dark p-6 rounded-lg hover:bg-gaming-dark/80 hover:border-gaming-blue/30 border border-gaming-light-gray/20 transition-all">
              <h3 className="text-xl font-semibold text-white mb-2">Workstation PCs</h3>
              <p className="text-gray-400 text-sm mb-4">Professional systems for content creators and developers.</p>
              <span className="text-gaming-blue text-sm flex items-center">Learn More <ChevronRight className="w-4 h-4 ml-1" /></span>
            </Link>
            
            <Link to="/components" className="block bg-gaming-dark p-6 rounded-lg hover:bg-gaming-dark/80 hover:border-gaming-blue/30 border border-gaming-light-gray/20 transition-all">
              <h3 className="text-xl font-semibold text-white mb-2">PC Components</h3>
              <p className="text-gray-400 text-sm mb-4">High-quality parts for building or upgrading your PC.</p>
              <span className="text-gaming-blue text-sm flex items-center">Learn More <ChevronRight className="w-4 h-4 ml-1" /></span>
            </Link>
            
            <Link to="/customize" className="block bg-gaming-dark p-6 rounded-lg hover:bg-gaming-dark/80 hover:border-gaming-blue/30 border border-gaming-light-gray/20 transition-all">
              <h3 className="text-xl font-semibold text-white mb-2">Custom PC Builder</h3>
              <p className="text-gray-400 text-sm mb-4">Design your own system with our interactive PC builder.</p>
              <span className="text-gaming-blue text-sm flex items-center">Learn More <ChevronRight className="w-4 h-4 ml-1" /></span>
            </Link>
            
            <Link to="/support" className="block bg-gaming-dark p-6 rounded-lg hover:bg-gaming-dark/80 hover:border-gaming-blue/30 border border-gaming-light-gray/20 transition-all">
              <h3 className="text-xl font-semibold text-white mb-2">Customer Support</h3>
              <p className="text-gray-400 text-sm mb-4">Get help with your PC purchase or technical support.</p>
              <span className="text-gaming-blue text-sm flex items-center">Learn More <ChevronRight className="w-4 h-4 ml-1" /></span>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default GamingPCsPage;
