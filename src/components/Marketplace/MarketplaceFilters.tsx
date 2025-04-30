
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { PRODUCT_CATEGORIES, ProductCategory } from "@/types/marketplace";

interface MarketplaceFiltersProps {
  selectedCategory: ProductCategory | 'all';
  setSelectedCategory: (category: ProductCategory | 'all') => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const MarketplaceFilters = ({
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  searchQuery,
  setSearchQuery
}: MarketplaceFiltersProps) => {
  return (
    <Card className="bg-gaming-dark/30 sticky top-4">
      <CardContent className="p-4">
        <div className="space-y-6">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label className="mb-2 block">Category</Label>
            <RadioGroup
              value={selectedCategory}
              onValueChange={(value) => setSelectedCategory(value as ProductCategory | 'all')}
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="all" />
                <Label htmlFor="all" className="capitalize">All Categories</Label>
              </div>
              
              {PRODUCT_CATEGORIES.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <RadioGroupItem value={category} id={category} />
                  <Label htmlFor={category} className="capitalize">{category}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <Label>Price Range</Label>
              <span className="text-sm text-gray-400">
                ${priceRange[0]} - ${priceRange[1]}
              </span>
            </div>
            <Slider
              defaultValue={[0, 5000]}
              value={priceRange}
              onValueChange={(values) => setPriceRange(values as [number, number])}
              min={0}
              max={5000}
              step={50}
              className="mt-2"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
