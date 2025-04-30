
import { CheckIcon, XIcon } from "lucide-react";

const BenefitsComparison = () => {
  const comparisons = [
    {
      feature: "Expert PC Building",
      customPC: true,
      prebuiltPC: true,
      retailPC: false,
    },
    {
      feature: "Premium Component Selection",
      customPC: true,
      prebuiltPC: true,
      retailPC: false,
    },
    {
      feature: "Professional Cable Management",
      customPC: true,
      prebuiltPC: true,
      retailPC: false,
    },
    {
      feature: "Custom RGB Lighting",
      customPC: true,
      prebuiltPC: true,
      retailPC: false,
    },
    {
      feature: "Extended Stress Testing",
      customPC: true,
      prebuiltPC: true,
      retailPC: false,
    },
    {
      feature: "Personalized Configuration",
      customPC: true,
      prebuiltPC: false,
      retailPC: false,
    },
    {
      feature: "3-Year Comprehensive Warranty",
      customPC: true,
      prebuiltPC: true,
      retailPC: false,
    },
    {
      feature: "Lifetime Technical Support",
      customPC: true,
      prebuiltPC: true,
      retailPC: false,
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gaming-dark to-gaming-darker">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white text-center">Why Choose BattleforgePC?</h2>
        <p className="text-gray-300 text-center max-w-3xl mx-auto mb-12">
          See how our custom and pre-built gaming computers compare to mass-produced retail options.
          With expert craftsmanship and premium components, we deliver superior performance and reliability.
        </p>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gaming-dark rounded-lg overflow-hidden">
            <thead>
              <tr className="border-b border-gaming-light-gray/20">
                <th className="py-4 px-6 text-left text-gray-300">Feature</th>
                <th className="py-4 px-6 text-center text-gaming-blue">BattleforgePC Custom</th>
                <th className="py-4 px-6 text-center text-gaming-purple">BattleforgePC Pre-built</th>
                <th className="py-4 px-6 text-center text-gray-400">Mass Market PC</th>
              </tr>
            </thead>
            <tbody>
              {comparisons.map((comparison, index) => (
                <tr 
                  key={index} 
                  className={`${index % 2 === 0 ? 'bg-gaming-darker/50' : ''} border-b border-gaming-light-gray/10`}
                >
                  <td className="py-3 px-6 text-white">{comparison.feature}</td>
                  <td className="py-3 px-6 text-center">
                    {comparison.customPC ? (
                      <CheckIcon className="inline-block h-5 w-5 text-gaming-blue" />
                    ) : (
                      <XIcon className="inline-block h-5 w-5 text-gray-500" />
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {comparison.prebuiltPC ? (
                      <CheckIcon className="inline-block h-5 w-5 text-gaming-purple" />
                    ) : (
                      <XIcon className="inline-block h-5 w-5 text-gray-500" />
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {comparison.retailPC ? (
                      <CheckIcon className="inline-block h-5 w-5 text-green-500" />
                    ) : (
                      <XIcon className="inline-block h-5 w-5 text-gray-500" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BenefitsComparison;
