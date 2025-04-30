
import React, { useState, useEffect } from "react";
import { useMarketplace } from "@/hooks/use-marketplace";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MarketplaceProduct } from "@/types/marketplace";
import { useProductImages } from "@/hooks/use-product-images";
import { ProductList } from "./ProductList";
import { AddProductDialog } from "./AddProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export const ProductManagement = () => {
  const { sellerProfile, sellerProducts, addProduct, updateProduct, deleteProduct, isLoading } = useMarketplace();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MarketplaceProduct | null>(null);
  const { isUploading, uploadMultipleImages } = useProductImages();
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  useEffect(() => {
    // For debugging
    console.log("Seller products in ProductManagement:", sellerProducts);
    console.log("Seller profile:", sellerProfile);
  }, [sellerProducts, sellerProfile]);

  const handleAddProduct = async (data: Omit<MarketplaceProduct, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'>) => {
    setLoadingMessage("Uploading images and adding product...");
    const fileInput = document.querySelector<HTMLInputElement>('#product-images');
    let imageUrls: string[] = [];

    try {
      if (fileInput?.files?.length) {
        imageUrls = await uploadMultipleImages(fileInput.files);
      }

      // Using void to ignore any return value
      await addProduct({
        ...data,
        images: imageUrls,
        specs: {},
        featured: false
      });
      
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error("Error in handleAddProduct:", error);
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleEditProduct = async (data: Partial<MarketplaceProduct>) => {
    if (!selectedProduct) return;
    
    setLoadingMessage("Updating product...");
    try {
      await updateProduct(selectedProduct.id, data);
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error in handleEditProduct:", error);
    } finally {
      setLoadingMessage(null);
    }
  };

  const handleEditClick = (product: MarketplaceProduct) => {
    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setLoadingMessage("Deleting product...");
      try {
        await deleteProduct(productId);
      } catch (error) {
        console.error("Error in handleDeleteProduct:", error);
      } finally {
        setLoadingMessage(null);
      }
    }
  };

  // Display loading overlay when performing operations
  const LoadingOverlay = () => loadingMessage ? (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-lg">
      <div className="bg-gaming-dark p-4 rounded-lg flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-gaming-blue" />
        <span className="text-white">{loadingMessage}</span>
      </div>
    </div>
  ) : null;

  return (
    <Card className="relative">
      <LoadingOverlay />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Products</CardTitle>
        <Button onClick={() => setIsAddDialogOpen(true)}>Add Product</Button>
      </CardHeader>
      <CardContent>
        <ProductList
          products={sellerProducts}
          isLoading={isLoading}
          onEditClick={handleEditClick}
          onDeleteClick={handleDeleteProduct}
        />
        <AddProductDialog
          isOpen={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSubmit={handleAddProduct}
          isLoading={isLoading || isUploading}
          isUploading={isUploading}
        />
        <EditProductDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          selectedProduct={selectedProduct}
          onSubmit={handleEditProduct}
          isLoading={isLoading}
          isUploading={isUploading}
        />
      </CardContent>
    </Card>
  );
};
