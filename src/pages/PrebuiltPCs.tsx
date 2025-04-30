
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PrebuiltList from "@/components/PrebuiltPC/PrebuiltList";
import { Button } from "@/components/ui/button";
import { Cpu, Shield, Award, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PrebuiltComparison from "@/components/PrebuiltPC/PrebuiltComparison";
import PrebuiltTestimonials from "@/components/PrebuiltPC/PrebuiltTestimonials";

const PrebuiltPCs = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Helmet>
        <title>Premium Pre-built Gaming PCs | Ready-to-Ship Performance Computers | BattleforgePC</title>
        <meta 
          name="description" 
          content="Experience gaming perfection with BattleforgePC's range of pre-built gaming PCs. From entry-level esports machines to 4K monster rigs with free shipping and 3-year warranty." 
        />
        <meta 
          name="keywords" 
          content="pre-built gaming pc, gaming desktop, high-performance computer, ready to ship gaming pc, professional gaming rig, RTX gaming computer, esports gaming computer, streaming pc" 
        />
        <link rel="canonical" href="https://battleforgepc.com/prebuilt" />
        
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "item": {
                  "@type": "Product",
                  "name": "BattleforgePC Starter Gaming PC",
                  "description": "Entry-level gaming PC with excellent 1080p gaming performance",
                  "offers": {
                    "@type": "Offer",
                    "price": "999.00",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                  }
                }
              },
              {
                "@type": "ListItem",
                "position": 2,
                "item": {
                  "@type": "Product",
                  "name": "BattleforgePC Pro Gaming PC",
                  "description": "Mid-range gaming PC with outstanding 1440p gaming performance",
                  "offers": {
                    "@type": "Offer",
                    "price": "1799.00",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                  }
                }
              },
              {
                "@type": "ListItem",
                "position": 3,
                "item": {
                  "@type": "Product",
                  "name": "BattleforgePC Elite Gaming PC",
                  "description": "High-end gaming PC with uncompromising 4K gaming performance",
                  "offers": {
                    "@type": "Offer",
                    "price": "2999.00",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                  }
                }
              }
            ]
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
                "item": "https://battleforgepc.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Pre-built Gaming PCs",
                "item": "https://battleforgepc.com/prebuilt"
              }
            ]
          }
        `}</script>
      </Helmet>
      <Header />
      <main>
        <section className="py-16 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gaming-blue/5"></div>
            <div className="absolute h-full w-1/3 top-0 left-1/3 bg-gaming-purple/5 blur-3xl rounded-full"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <nav className="mb-8 text-left">
              <ol className="flex text-sm">
                <li className="text-gray-400">
                  <Link to="/" className="hover:text-gaming-blue">Home</Link>
                </li>
                <li className="mx-2 text-gray-400">/</li>
                <li className="text-gaming-blue">Pre-built Gaming PCs</li>
              </ol>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready-to-Ship Gaming PCs
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-3xl mx-auto">
              Choose from our expertly crafted, pre-built gaming rigs designed for peak performance without the wait.
              Each system is meticulously assembled, extensively tested, and ready to power your gaming experience.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-gaming-blue hover:bg-gaming-blue/80 text-white px-6 py-6 text-lg">
                <a href="#prebuilt-list">Browse Pre-builts</a>
              </Button>
              <Button asChild variant="outline" className="border-gaming-purple text-gaming-purple hover:bg-gaming-purple/10 px-6 py-6 text-lg">
                <Link to="/customize">Customize Your Own</Link>
              </Button>
            </div>
          </div>
        </section>
        
        <section id="prebuilt-list" className="py-16">
          <PrebuiltList />
        </section>
        
        <PrebuiltComparison />
        
        <section className="py-16 bg-gaming-dark">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-white text-center mb-12">Why Choose BattleforgePC Prebuilts?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center">
                <div className="bg-gaming-blue/20 p-4 rounded-full mb-4">
                  <Cpu className="h-8 w-8 text-gaming-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Expert Assembly</h3>
                <p className="text-gray-300">
                  Built by our team of certified technicians with meticulous attention to detail and perfect cable management.
                  Every connection is double-checked for security and performance.
                </p>
              </div>
              <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center">
                <div className="bg-gaming-purple/20 p-4 rounded-full mb-4">
                  <Clock className="h-8 w-8 text-gaming-purple" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Extensively Tested</h3>
                <p className="text-gray-300">
                  Every system undergoes a 48-hour stress test and benchmarking process before shipping to ensure stability.
                  We verify performance metrics across multiple games and applications.
                </p>
              </div>
              <div className="bg-gaming-darker p-6 rounded-lg border border-gaming-light-gray/20 flex flex-col items-center text-center">
                <div className="bg-gaming-red/20 p-4 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-gaming-red" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">3-Year Warranty</h3>
                <p className="text-gray-300">
                  All prebuilt systems come with our premium 3-year warranty and lifetime technical support.
                  Our US-based support team is available 7 days a week to assist with any questions.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <PrebuiltTestimonials />
      </main>
      <Footer />
    </div>
  );
};

export default PrebuiltPCs;
