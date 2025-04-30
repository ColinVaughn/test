
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const MarketplaceHero = () => {
  return (
    <div className="bg-gaming-dark w-full py-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gaming-blue mb-4">
              PC Parts Marketplace
            </h1>
            <p className="text-lg text-gray-300 mb-6">
              Buy and sell computer parts from verified sellers. From CPUs to complete setups, 
              find what you need or sell what you don't.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace/sell">
                <Button variant="default" size="lg">
                  Become a Seller
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" size="lg">
                  Browse Products
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-8 md:mt-0">
            <div className="w-64 h-64 rounded-lg bg-gradient-to-br from-gaming-accent/20 to-gaming-blue/30 flex items-center justify-center">
              <span className="text-6xl">🛒</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
