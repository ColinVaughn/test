import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useMarketplace } from "@/hooks/use-marketplace";
import { MarketplaceProduct } from "@/types/marketplace";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Search, RefreshCw, Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InventoryManagementProps {
  sellerId: string;
}

const InventoryManagement: React.FC<InventoryManagementProps> = ({ sellerId }) => {
  const { sellerProducts, updateProduct, isLoading, fetchSellerProducts } = useMarketplace();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<MarketplaceProduct[]>([]);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [stockValues, setStockValues] = useState<Record<string, number>>({});
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (sellerProducts) {
      const initialStockValues: Record<string, number> = {};
      sellerProducts.forEach(product => {
        initialStockValues[product.id] = product.stock_quantity;
      });
      setStockValues(initialStockValues);
      
      filterProducts();
    }
  }, [sellerProducts, searchQuery]);

  const filterProducts = () => {
    if (!sellerProducts) return;
    
    if (!searchQuery.trim()) {
      setFilteredProducts(sellerProducts);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = sellerProducts.filter(product => 
      product.name.toLowerCase().includes(query) || 
      product.category.toLowerCase().includes(query) ||
      (product.description && product.description.toLowerCase().includes(query))
    );
    
    setFilteredProducts(filtered);
  };

  const handleStockChange = (productId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setStockValues({
        ...stockValues,
        [productId]: numValue
      });
    }
  };

  const updateStock = async (productId: string) => {
    if (stockValues[productId] === undefined) return;
    
    setUpdatingStockId(productId);
    try {
      await updateProduct(productId, { stock_quantity: stockValues[productId] });
      toast.success("Stock level updated successfully");
    } catch (error) {
      console.error("Error updating stock:", error);
      toast.error("Failed to update stock level");
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleBulkUpdate = async () => {
    setIsBulkUpdating(true);
    let successCount = 0;
    let errorCount = 0;
    
    try {
      const productsToUpdate = sellerProducts?.filter(product => 
        stockValues[product.id] !== undefined && stockValues[product.id] !== product.stock_quantity
      );
      
      if (!productsToUpdate || productsToUpdate.length === 0) {
        toast.info("No stock changes detected");
        setIsBulkUpdating(false);
        return;
      }
      
      for (const product of productsToUpdate) {
        try {
          await updateProduct(product.id, { 
            stock_quantity: stockValues[product.id] 
          });
          successCount++;
        } catch (error) {
          console.error(`Error updating stock for ${product.name}:`, error);
          errorCount++;
        }
      }
      
      if (successCount > 0) {
        toast.success(`Updated stock for ${successCount} products`);
      }
      
      if (errorCount > 0) {
        toast.error(`Failed to update ${errorCount} products`);
      }
    } catch (error) {
      console.error("Error in bulk update:", error);
      toast.error("An error occurred during bulk update");
    } finally {
      setIsBulkUpdating(false);
    }
  };

  const handleExportInventory = async () => {
    setIsExporting(true);
    try {
      if (!sellerProducts || sellerProducts.length === 0) {
        toast.error("No products to export");
        return;
      }
      
      const csvData = sellerProducts.map(product => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        stock_quantity: product.stock_quantity,
        condition: product.condition
      }));
      
      const replacer = (key: string, value: any) => value === null ? '' : value;
      const header = Object.keys(csvData[0]);
      const csv = [
        header.join(','),
        ...csvData.map(row => header.map(fieldName => JSON.stringify(row[fieldName as keyof typeof row], replacer)).join(','))
      ].join('\r\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.setAttribute('hidden', '');
      a.setAttribute('href', url);
      a.setAttribute('download', `inventory_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      toast.success("Inventory exported successfully");
    } catch (error) {
      console.error("Error exporting inventory:", error);
      toast.error("Failed to export inventory");
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportInventory = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setIsImporting(true);
    try {
      const file = event.target.files[0];
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          toast.error("Failed to read file");
          setIsImporting(false);
          return;
        }
        
        try {
          const rows = text.split('\r\n');
          if (rows.length < 2) {
            toast.error("CSV file is empty or invalid");
            setIsImporting(false);
            return;
          }
          
          const headers = rows[0].split(',').map(header => header.trim());
          const idIndex = headers.indexOf('id');
          const stockIndex = headers.indexOf('stock_quantity');
          
          if (idIndex === -1 || stockIndex === -1) {
            toast.error("CSV must contain 'id' and 'stock_quantity' columns");
            setIsImporting(false);
            return;
          }
          
          let successCount = 0;
          let errorCount = 0;
          
          for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;
            
            const values = rows[i].split(',').map(value => {
              const trimmed = value.trim();
              return trimmed.startsWith('"') && trimmed.endsWith('"') 
                ? trimmed.substring(1, trimmed.length - 1) 
                : trimmed;
            });
            
            const productId = values[idIndex];
            const stockQty = parseInt(values[stockIndex], 10);
            
            if (!productId || isNaN(stockQty) || stockQty < 0) continue;
            
            try {
              await updateProduct(productId, { stock_quantity: stockQty });
              successCount++;
            } catch (error) {
              console.error(`Error updating product ${productId}:`, error);
              errorCount++;
            }
          }
          
          await fetchSellerProducts();
          
          if (successCount > 0) {
            toast.success(`Updated ${successCount} products`);
          }
          
          if (errorCount > 0) {
            toast.error(`Failed to update ${errorCount} products`);
          }
          
        } catch (error) {
          console.error("Error processing CSV:", error);
          toast.error("Failed to process CSV file");
        }
        
        setIsImporting(false);
      };
      
      reader.onerror = () => {
        toast.error("Failed to read file");
        setIsImporting(false);
      };
      
      reader.readAsText(file);
      
    } catch (error) {
      console.error("Error importing inventory:", error);
      toast.error("Failed to import inventory");
      setIsImporting(false);
    }
  };

  const getStockStatusClass = (quantity: number) => {
    if (quantity === 0) return "bg-red-500/20 text-red-300";
    if (quantity < 5) return "bg-yellow-500/20 text-yellow-300";
    return "bg-green-500/20 text-green-300";
  };

  const getStockStatusText = (quantity: number) => {
    if (quantity === 0) return "Out of Stock";
    if (quantity < 5) return "Low Stock";
    return "In Stock";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Inventory Management</CardTitle>
        <div className="flex gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full md:w-auto"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchSellerProducts()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button
            variant="outline" 
            size="sm"
            onClick={() => {}}
            disabled={true}
          >
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              <Upload className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Import</span>
            </Button>
          </div>
          
          <Button
            disabled={true}
            size="sm"
          >
            Update All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
          </div>
        ) : !filteredProducts || filteredProducts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400">No products found</p>
          </div>
        ) : (
          <div className="border rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">Current Stock</TableHead>
                    <TableHead className="text-right">New Stock</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{product.stock_quantity}</TableCell>
                      <TableCell className="text-right">
                        <Input
                          type="number"
                          min="0"
                          value={stockValues[product.id] || 0}
                          onChange={() => {}}
                          className="w-20 text-right inline-block"
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-green-500/20 text-green-300">
                          In Stock
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={true}
                        >
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InventoryManagement;
