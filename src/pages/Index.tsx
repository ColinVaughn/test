import { lazy, Suspense } from "react";
import HeaderWithAdmin from "@/components/HeaderWithAdmin";
import Hero from "@/components/Hero";
import { Helmet } from "react-helmet-async";
import { NewsletterPopup } from "@/components/Newsletter/NewsletterPopup";
import { DiscordPopup } from "@/components/Discord/DiscordPopup";

// Lazily load non-critical components
const Features = lazy(() => import("@/components/Features"));
const FeaturedProducts = lazy(() => import("@/components/FeaturedProducts"));
const Testimonials = lazy(() => import("@/components/Testimonials"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const CTA = lazy(() => import("@/components/CTA"));
const FAQ = lazy(() => import("@/components/FAQ"));
const BenefitsComparison = lazy(() => import("@/components/BenefitsComparison"));
const Footer = lazy(() => import("@/components/Footer"));

// Simple loading placeholder
const LoadingPlaceholder = () => <div className="h-20 bg-gaming-dark/50 animate-pulse rounded-md"></div>;

const Index = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Helmet>
        <title>BattleforgePC | Custom Gaming PCs & High-Performance Computers</title>
        <meta 
          name="description" 
          content="Transform your gaming experience with BattleforgePC's cutting-edge custom computers. From budget-friendly rigs to ultra-high-end workstations, we deliver unparalleled performance, expert craftsmanship, and innovative design." 
        />
        <meta 
          name="keywords" 
          content="gaming pc, custom pc, high performance computer, gaming rig, custom built pc, gaming computer, rtx gaming pc, battleforge pc, prebuilt gaming pc, custom workstation" 
        />
        <link rel="canonical" href="https://battleforgepc.com" />
        
        {/* Schema.org markup for Product */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Product",
            "name": "BattleforgePC Custom Gaming Computers",
            "description": "High-performance custom gaming PCs built with premium components",
            "brand": {
              "@type": "Brand",
              "name": "BattleforgePC"
            },
            "offers": {
              "@type": "AggregateOffer",
              "lowPrice": "999.00",
              "highPrice": "4999.00",
              "priceCurrency": "USD",
              "offerCount": "10",
              "availability": "https://schema.org/InStock"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "150"
            }
          }
        `}</script>

        {/* Schema.org markup for Organization */}
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "BattleforgePC",
            "url": "https://battleforgepc.com",
            "logo": "https://battleforgepc.com/logo.png",
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+1-555-123-4567",
              "contactType": "customer service",
              "availableLanguage": "English"
            },
            "sameAs": [
              "https://www.facebook.com/battleforgepc",
              "https://twitter.com/battleforgepc",
              "https://www.instagram.com/battleforgepc"
            ]
          }
        `}</script>
      </Helmet>
      
      <HeaderWithAdmin />
      <NewsletterPopup />
      <DiscordPopup />
      <main>
        <Hero />
        
        {/* Non-critical components that can be lazy loaded */}
        <Suspense fallback={<LoadingPlaceholder />}>
          <Features />
        </Suspense>
        
        <Suspense fallback={<LoadingPlaceholder />}>
          <FeaturedProducts />
        </Suspense>
        
        <Suspense fallback={<LoadingPlaceholder />}>
          <BenefitsComparison />
        </Suspense>
        
        <Suspense fallback={<LoadingPlaceholder />}>
          <Testimonials />
        </Suspense>
        
        <Suspense fallback={<LoadingPlaceholder />}>
          <FAQ />
        </Suspense>
        
        <Suspense fallback={<LoadingPlaceholder />}>
          <CTA />
        </Suspense>
        
        <Suspense fallback={<LoadingPlaceholder />}>
          <Newsletter />
        </Suspense>
      </main>
      
      <Suspense fallback={<LoadingPlaceholder />}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
