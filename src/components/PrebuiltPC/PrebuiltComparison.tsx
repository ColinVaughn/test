
import { Helmet } from "react-helmet-async";

const PrebuiltComparison = () => {
  return (
    <section className="py-16 bg-gaming-darker">
      <Helmet>
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Table",
            "about": "Gaming PC Comparison",
            "description": "Comparison of BattleforgePC gaming systems specifications and performance"
          }
        `}</script>
      </Helmet>
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">Pre-built PC Comparison</h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Compare our most popular pre-built gaming PCs to find the perfect system for your gaming needs and budget.
          All systems include free shipping, 3-year warranty, and expert assembly.
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full bg-gaming-dark border-collapse rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gaming-darker">
                <th className="p-4 text-left text-white border-b border-gaming-light-gray/20">Model</th>
                <th className="p-4 text-center text-white border-b border-gaming-light-gray/20">Starter</th>
                <th className="p-4 text-center text-white border-b border-gaming-light-gray/20">Pro</th>
                <th className="p-4 text-center text-white border-b border-gaming-light-gray/20">Elite</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">Price</td>
                <td className="p-4 text-center text-gaming-blue border-b border-gaming-light-gray/10">$999</td>
                <td className="p-4 text-center text-gaming-purple border-b border-gaming-light-gray/10">$1,799</td>
                <td className="p-4 text-center text-gaming-red border-b border-gaming-light-gray/10">$2,999</td>
              </tr>
              <tr className="bg-gaming-darker/30">
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">CPU</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Intel Core i5-13400F</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Intel Core i7-13700KF</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Intel Core i9-13900KF</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">GPU</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">RTX 4060 8GB</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">RTX 4070 12GB</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">RTX 4090 24GB</td>
              </tr>
              <tr className="bg-gaming-darker/30">
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">RAM</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">16GB DDR4 3200MHz</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">32GB DDR5 5200MHz</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">64GB DDR5 6000MHz</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">Storage</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">1TB NVMe SSD</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">2TB NVMe SSD</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">4TB NVMe SSD</td>
              </tr>
              <tr className="bg-gaming-darker/30">
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">Cooling</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Air Cooling</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">240mm AIO</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">360mm AIO</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">Power Supply</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">650W Gold</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">850W Gold</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">1200W Platinum</td>
              </tr>
              <tr className="bg-gaming-darker/30">
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">1080p Performance</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Excellent</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Outstanding</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Exceptional</td>
              </tr>
              <tr>
                <td className="p-4 text-gray-300 border-b border-gaming-light-gray/10">1440p Performance</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Good</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Excellent</td>
                <td className="p-4 text-center text-white border-b border-gaming-light-gray/10">Outstanding</td>
              </tr>
              <tr className="bg-gaming-darker/30">
                <td className="p-4 text-gray-300">4K Performance</td>
                <td className="p-4 text-center text-white">Entry-Level</td>
                <td className="p-4 text-center text-white">Good</td>
                <td className="p-4 text-center text-white">Exceptional</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PrebuiltComparison;
