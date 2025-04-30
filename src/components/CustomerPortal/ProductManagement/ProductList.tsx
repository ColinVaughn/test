
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Loader2 } from "lucide-react";
import { MarketplaceProduct } from "@/types/marketplace";

interface ProductListProps {
  products: MarketplaceProduct[];
  isLoading: boolean;
  onEditClick: (product: MarketplaceProduct) => void;
  onDeleteClick: (productId: string) => void;
}

export const ProductList = ({ 
  products, 
  isLoading, 
  onEditClick, 
  onDeleteClick 
}: ProductListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gaming-blue mx-auto mb-3" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 bg-gaming-dark/20 rounded-lg">
        <p className="text-gray-400 mb-2">You haven't added any products yet.</p>
        <p className="text-sm text-gray-500">Click "Add Product" to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell className="font-medium">{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>{product.stock_quantity}</TableCell>
              <TableCell>
                <Badge 
                  variant={
                    product.status === "approved" ? "default" : 
                    product.status === "pending" ? "outline" : "destructive"
                  }
                >
                  {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditClick(product)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDeleteClick(product.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
