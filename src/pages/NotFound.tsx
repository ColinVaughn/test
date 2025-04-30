
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { HomeIcon, ShoppingCart, HeadphonesIcon, BugIcon } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    // Log 404s for tracking purposes
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // Common misspellings and old URLs redirects
  const redirectMap: Record<string, string> = {
    "/customise": "/customize",
    "/gaming": "/gaming-pcs",
    "/prebuilds": "/prebuilt",
    "/custom": "/customize",
    "/workstation": "/workstations",
    "/about-us": "/about",
  };

  useEffect(() => {
    const path = location.pathname.toLowerCase();
    const redirectTo = redirectMap[path];
    
    if (redirectTo) {
      window.location.href = redirectTo;
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gaming-darker">
      <Helmet>
        <title>Page Not Found | BattleforgePC</title>
        <meta 
          name="description" 
          content="The page you're looking for cannot be found. Explore our custom gaming PCs and prebuilt systems instead." 
        />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <div className="container py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-gaming-red" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M64 8L8 64L64 120L120 64L64 8Z" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M64 40V72" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="64" cy="88" r="4" fill="currentColor" />
            </svg>
          </div>
          
          <h1 className="text-6xl font-bold text-gaming-red mb-4">404</h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Page Not Found</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-gaming-blue via-gaming-purple to-gaming-red mx-auto mb-6"></div>
          
          <p className="text-gray-300 mb-8 max-w-lg mx-auto text-lg">
            The page you were looking for doesn't exist or has been moved. 
            We've logged this error and will investigate if needed.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <Button asChild variant="default" className="w-full bg-gaming-blue hover:bg-gaming-blue/80">
              <Link to="/" className="flex items-center justify-center gap-2 py-6">
                <HomeIcon className="w-5 h-5" />
                Return to Homepage
              </Link>
            </Button>
            
            <Button asChild variant="secondary" className="w-full bg-gaming-purple hover:bg-gaming-purple/80">
              <Link to="/prebuilt" className="flex items-center justify-center gap-2 py-6">
                <ShoppingCart className="w-5 h-5" />
                Browse Gaming PCs
              </Link>
            </Button>
            
            <Button asChild variant="outline" className="w-full border-gaming-red hover:bg-gaming-red/10">
              <Link to="/support" className="flex items-center justify-center gap-2 py-6">
                <HeadphonesIcon className="w-5 h-5" />
                Contact Support
              </Link>
            </Button>
          </div>
          
          <div className="px-6 py-4 bg-gaming-dark/50 rounded-lg border border-gaming-light-gray/30 inline-flex items-center gap-2">
            <BugIcon className="w-5 h-5 text-gaming-blue" />
            <span className="text-sm text-gray-300">Did you find a broken link? <Link to="/support" className="text-gaming-blue hover:underline">Report it here</Link></span>
          </div>
          
          {/* Added additional internal links for SEO improvement */}
          <div className="mt-12 border-t border-gaming-light-gray/20 pt-8">
            <h3 className="text-xl font-semibold text-white mb-4">Popular Pages</h3>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/customize" className="text-gaming-blue hover:underline">Customize Your PC</Link>
              <Link to="/prebuilt" className="text-gaming-blue hover:underline">Pre-Built Gaming PCs</Link>
              <Link to="/gaming-pcs" className="text-gaming-blue hover:underline">Gaming Computers</Link>
              <Link to="/components" className="text-gaming-blue hover:underline">PC Components</Link>
              <Link to="/workstations" className="text-gaming-blue hover:underline">Workstation PCs</Link>
              <Link to="/about" className="text-gaming-blue hover:underline">About Us</Link>
              <Link to="/support" className="text-gaming-blue hover:underline">Customer Support</Link>
              <Link to="/sitemap" className="text-gaming-blue hover:underline">Sitemap</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
