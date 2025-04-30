
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ProductForm, ProductFormValues } from "./ProductForm";
import { MarketplaceProduct } from "@/types/marketplace";

interface AddProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Omit<MarketplaceProduct, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'>) => Promise<void>;
  isLoading: boolean;
  isUploading: boolean;
}

export const AddProductDialog = ({
  isOpen,
  onOpenChange,
  onSubmit,
  isLoading,
  isUploading
}: AddProductDialogProps) => {
  // Handle form submission and map ProductFormValues to the expected type
  const handleSubmit = async (data: ProductFormValues) => {
    // Map ProductFormValues to the expected type by setting default values for any missing properties
    const productData: Omit<MarketplaceProduct, 'id' | 'seller_id' | 'status' | 'created_at' | 'updated_at'> = {
      ...data,
      images: data.images || [],
      featured: data.featured || false
    };
    await onSubmit(productData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isUploading={isUploading}
          mode="add"
        />
      </DialogContent>
    </Dialog>
  );
};
