
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import ComponentCategories from "@/components/ComponentCategories";
import ComponentGuide from "@/components/ComponentGuide";
import Newsletter from "@/components/Newsletter";
import { Link } from "react-router-dom";

const ComponentsPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Helmet>
        <title>PC Parts & Components | Premium Computer Hardware | BattleforgePC</title>
        <meta 
          name="description" 
          content="Discover top-tier PC components at BattleforgePC. Browse our curated selection of high-performance CPUs, GPUs, motherboards, RAM, and storage solutions from industry-leading brands." 
        />
        <meta 
          name="keywords" 
          content="pc components, computer hardware, gaming parts, cpu, gpu, motherboard, ram, ssd, computer upgrade, performance hardware" 
        />
        <link rel="canonical" href="https://battleforgepc.com/components" />
        
        {/* Schema.org markup for Product Collection */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "PC Components Collection",
            "description": "High-quality PC components for gaming and workstation computers",
            "url": "https://battleforgepc.com/components",
            "isPartOf": {
              "@type": "WebSite",
              "name": "BattleforgePC",
              "url": "https://battleforgepc.com"
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
                "item": "https://battleforgepc.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Components",
                "item": "https://battleforgepc.com/components"
              }
            ]
          }
        `}</script>
      </Helmet>
      <Header />
      <main className="pt-8">
        <section className="container mx-auto px-4 py-8">
          <nav className="mb-8">
            <ol className="flex text-sm">
              <li className="text-gray-400">
                <Link to="/" className="hover:text-gaming-blue">Home</Link>
              </li>
              <li className="mx-2 text-gray-400">/</li>
              <li className="text-gaming-blue">Components</li>
            </ol>
          </nav>
          
          <h1 className="text-4xl font-bold text-gaming-blue mb-4">Premium PC Components</h1>
          <p className="text-gray-300 mb-8 max-w-3xl">
            BattleforgePC offers a carefully curated selection of high-quality PC components from industry-leading manufacturers. 
            Whether you're building a new PC from scratch or upgrading your existing system, we have the premium parts you need 
            for exceptional performance and reliability.
          </p>
          
          <ComponentCategories />
        </section>
        
        <ComponentGuide />
        
        <section className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-white mb-8">Featured Components</h2>
          <div className="bg-gaming-dark/30 rounded-lg p-8">
            <p className="text-gray-300 mb-6">
              Browse our selection of high-quality PC components, from processors to graphics cards
              and everything in between. Each component is thoroughly tested for compatibility and performance.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Placeholder for component products */}
              <div className="bg-gaming-dark rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gaming-blue mb-2">Coming Soon</h3>
                <p className="text-gray-400">Our components collection will be available shortly.</p>
              </div>
            </div>
          </div>
        </section>
        
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default ComponentsPage;
