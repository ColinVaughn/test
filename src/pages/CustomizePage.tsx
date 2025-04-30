
import HeaderWithAdmin from "@/components/HeaderWithAdmin";
import Footer from "@/components/Footer";
import PCCustomizer from "@/components/CustomizePC/PCCustomizer";
import { Helmet } from "react-helmet-async";
import CustomizeSteps from "@/components/CustomizePC/CustomizeSteps";
import { Link } from "react-router-dom";
import { CheckIcon } from "lucide-react";

const CustomizePage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker flex flex-col">
      <Helmet>
        <title>Ultimate PC Builder | Design Your Dream Gaming Rig | BattleforgePC</title>
        <meta 
          name="description" 
          content="Unleash your creativity with BattleforgePC's interactive custom PC builder. Handpick premium components like RTX GPUs, Intel and AMD CPUs, and create a personalized gaming masterpiece." 
        />
        <meta 
          name="keywords" 
          content="custom pc builder, gaming pc configurator, pc part picker, build your own gaming pc, custom gaming computer, performance pc builder, personalized gaming rig" 
        />
        <link rel="canonical" href="https://battleforgepc.com/customize" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="Design Your Dream Gaming PC | BattleforgePC Custom PC Builder" />
        <meta property="og:description" content="Build your perfect gaming PC with our interactive PC builder. Premium components, expert assembly, and free shipping." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://battleforgepc.com/customize" />
        <meta property="og:image" content="https://battleforgepc.com/og-pc-builder.jpg" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Custom Gaming PC Builder | BattleforgePC" />
        <meta name="twitter:description" content="Design your dream gaming PC with our interactive builder. Expert assembly and premium components." />
        <meta name="twitter:image" content="https://battleforgepc.com/twitter-pc-builder.jpg" />
        
        {/* Schema.org markup for PC Builder Tool */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "BattleforgePC Custom PC Builder",
              "url": "https://battleforgepc.com/customize",
              "description": "Interactive PC building tool for creating custom gaming computers",
              "applicationCategory": "DesktopApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "AggregateOffer",
                "lowPrice": "999.00",
                "highPrice": "5999.00",
                "priceCurrency": "USD",
                "offerCount": "1000+"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "256",
                "reviewCount": "189"
              },
              "potentialAction": {
                "@type": "BuildAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://battleforgepc.com/customize",
                  "actionPlatform": [
                    "http://schema.org/DesktopWebPlatform"
                  ]
                },
                "result": {
                  "@type": "Product",
                  "name": "Custom Gaming PC"
                }
              }
            }
          `}
        </script>
        
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
                "name": "PC Customizer",
                "item": "https://battleforgepc.com/customize"
              }
            ]
          }
        `}</script>
        
        {/* FAQ Schema */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [{
                "@type": "Question",
                "name": "How long does it take to build a custom PC?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most custom PC builds are completed and shipped within 10-15 business days from order confirmation."
                }
              }, {
                "@type": "Question",
                "name": "Do you offer a warranty on custom builds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, all custom PCs come with a 3-year warranty covering parts and labor, plus lifetime technical support."
                }
              }, {
                "@type": "Question",
                "name": "Can I upgrade my PC later?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! All our custom builds use standard components that can be easily upgraded in the future."
                }
              }]
            }
          `}
        </script>
      </Helmet>
      <HeaderWithAdmin />
      
      <main className="flex-grow">
        <section className="bg-gaming-dark py-8">
          <div className="container mx-auto px-4">
            <nav className="mb-6">
              <ol className="flex text-sm">
                <li className="text-gray-400">
                  <Link to="/" className="hover:text-gaming-blue">Home</Link>
                </li>
                <li className="mx-2 text-gray-400">/</li>
                <li className="text-gaming-blue">PC Customizer</li>
              </ol>
            </nav>
            
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">Design Your Dream Gaming PC</h1>
              <p className="text-gray-300 mb-6">
                Our interactive PC builder lets you create the perfect custom gaming computer with 
                hand-picked components tailored to your specific needs and budget. Every system is 
                expertly assembled, rigorously tested, and backed by our 3-year warranty.
              </p>
            </div>
          </div>
        </section>
        
        <PCCustomizer />
        
        {/* Custom Build Benefits section */}
        <section className="bg-gaming-darker py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Custom Build Benefits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                "Premium components from trusted brands",
                "Guaranteed compatibility between all parts",
                "Professional cable management", 
                "Clean Windows installation with no bloatware",
                "Comprehensive 3-year warranty",
                "Lifetime technical support", 
                "Free shipping on all custom builds",
                "30-day satisfaction guarantee"
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3 bg-gaming-dark rounded-lg p-4">
                  <CheckIcon className="h-6 w-6 text-gaming-blue shrink-0" />
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works section moved to bottom */}
        <CustomizeSteps />
      </main>
      <Footer />
    </div>
  );
};

export default CustomizePage;
