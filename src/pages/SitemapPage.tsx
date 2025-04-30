import React from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const SitemapPage = () => {
  return (
    <div className="min-h-screen bg-gaming-darker">
      <Helmet>
        <title>Sitemap | Navigation Guide | BattleforgePC</title>
        <meta 
          name="description" 
          content="Navigate the BattleforgePC website easily. Find links to our gaming PCs, PC builder, support, and all other pages in one convenient location." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://battleforgepc.com/sitemap" />
      </Helmet>
      <Header />
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Sitemap</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* Products */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Products</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/prebuilt" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Pre-built Gaming PCs
                </Link>
              </li>
              <li>
                <Link to="/gaming-pcs" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Gaming PCs
                </Link>
              </li>
              <li>
                <Link to="/workstations" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Workstations
                </Link>
              </li>
              <li>
                <Link to="/components" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Components
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Marketplace */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Marketplace</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/marketplace" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Browse Marketplace
                </Link>
              </li>
              <li>
                <Link to="/marketplace/sell" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Sell on Marketplace
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Configuration */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Build Your PC</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/customize" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  PC Configurator
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Customer Support */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Support</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/support" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Support Center
                </Link>
              </li>
              <li>
                <Link to="/support#faq" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/order-tracking" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Order Tracking
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Account & Portal */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Your Account</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/account" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Customer Portal
                </Link>
              </li>
              <li>
                <Link to="/auth" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Affiliate Program */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Affiliate Program</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/affiliate/apply" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Become an Affiliate
                </Link>
              </li>
              <li>
                <Link to="/affiliate/dashboard" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Affiliate Dashboard
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Company */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Company</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Home
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Legal</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/terms" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Articles */}
          <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20">
            <h2 className="text-xl font-bold mb-4 text-white">Articles</h2>
            <ul className="space-y-3">
              <li>
                <Link to="/articles" className="flex items-center text-gray-300 hover:text-gaming-blue transition-colors">
                  <ArrowRight className="h-4 w-4 mr-2" />
                  Browse Articles
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-gaming-dark p-6 rounded-lg border border-gaming-light-gray/20 mb-8">
          <h2 className="text-xl font-bold mb-4 text-white">XML Sitemap</h2>
          <p className="text-gray-300 mb-4">
            Our website also provides an XML sitemap for search engines and web crawlers to better index our content.
          </p>
          <a 
            href="/sitemap.xml" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-gaming-blue hover:bg-gaming-blue/80 text-white py-2 px-4 rounded-md"
          >
            View XML Sitemap
          </a>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SitemapPage;
