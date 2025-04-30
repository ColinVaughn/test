
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Store } from 'lucide-react';
import { MarketplaceSeller } from '@/types/marketplace';

interface SellerProfileCardProps {
  seller: MarketplaceSeller;
}

export const SellerProfileCard = ({ seller }: SellerProfileCardProps) => {
  return (
    <Card className="bg-gaming-dark/30">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {seller.logo_url && (
            <img 
              src={seller.logo_url} 
              alt={seller.store_name} 
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Store className="h-4 w-4 text-gaming-blue" />
              <h3 className="font-medium">{seller.store_name}</h3>
            </div>
            {seller.description && (
              <p className="text-sm text-gray-400 mb-3">{seller.description}</p>
            )}
            <Link to={`/marketplace/seller/${seller.store_slug}`}>
              <Button variant="outline" size="sm">View Store Profile</Button>
            </Link>
          </div>
        </div>

        {(seller.return_policy || seller.buyer_protection_policy) && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              {seller.return_policy && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Return Policy</h4>
                  <p className="text-sm text-gray-400">{seller.return_policy}</p>
                </div>
              )}
              {seller.buyer_protection_policy && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Buyer Protection</h4>
                  <p className="text-sm text-gray-400">{seller.buyer_protection_policy}</p>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
