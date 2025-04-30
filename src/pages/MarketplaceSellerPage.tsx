
import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MarketplaceProvider } from "@/hooks/use-marketplace";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";

const MarketplaceSellerPage = () => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <MarketplaceProvider>
      <div className="min-h-screen bg-gaming-darker flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8 px-4">
          <h1 className="text-3xl font-bold text-gaming-blue mb-6">Become a Seller</h1>
          
          <Card className="bg-gaming-dark/30 p-6 mb-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Why Sell on Our Marketplace?</h2>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 p-4 bg-gaming-dark/20 rounded-lg">
                  <h3 className="text-lg font-medium text-gaming-blue">Reach PC Enthusiasts</h3>
                  <p className="text-gray-300">Connect with a community of gamers and PC builders looking for quality parts.</p>
                </div>
                
                <div className="space-y-2 p-4 bg-gaming-dark/20 rounded-lg">
                  <h3 className="text-lg font-medium text-gaming-blue">Low Commission</h3>
                  <p className="text-gray-300">Only 5% total fee (3% payment processing + 2% platform fee).</p>
                </div>
                
                <div className="space-y-2 p-4 bg-gaming-dark/20 rounded-lg">
                  <h3 className="text-lg font-medium text-gaming-blue">Simple Setup</h3>
                  <p className="text-gray-300">Get started quickly with our easy-to-use seller tools and dashboard.</p>
                </div>
              </div>
              
              <div className="pt-4 flex justify-center">
                <Link to="/account">
                  <Button size="lg">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
          
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="space-y-2 border border-gaming-dark p-4 rounded-lg">
                  <div className="text-4xl font-bold text-gaming-blue mb-2">1</div>
                  <h3 className="text-lg font-medium">Apply to be a seller</h3>
                  <p className="text-gray-400">Create your seller profile in your account dashboard.</p>
                </div>
                
                <div className="space-y-2 border border-gaming-dark p-4 rounded-lg">
                  <div className="text-4xl font-bold text-gaming-blue mb-2">2</div>
                  <h3 className="text-lg font-medium">List your products</h3>
                  <p className="text-gray-400">Add your PC components and set your prices and inventory.</p>
                </div>
                
                <div className="space-y-2 border border-gaming-dark p-4 rounded-lg">
                  <div className="text-4xl font-bold text-gaming-blue mb-2">3</div>
                  <h3 className="text-lg font-medium">Ship & get paid</h3>
                  <p className="text-gray-400">Fulfill orders and receive payments directly to your account.</p>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">FAQ</h2>
              <div className="space-y-4">
                <div className="border border-gaming-dark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">What can I sell?</h3>
                  <p className="text-gray-400">New, used, or refurbished PC components including CPUs, GPUs, motherboards, RAM, storage, cooling solutions, cases, power supplies, and accessories.</p>
                </div>
                
                <div className="border border-gaming-dark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">How much does it cost?</h3>
                  <p className="text-gray-400">We charge a flat 5% fee on each sale (3% for payment processing and 2% platform fee).</p>
                </div>
                
                <div className="border border-gaming-dark p-4 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">When do I get paid?</h3>
                  <p className="text-gray-400">Payments are processed within 7 days after an order is successfully delivered.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </MarketplaceProvider>
  );
};

export default MarketplaceSellerPage;
