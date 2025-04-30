
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm, ProductFormValues } from "./ProductForm";
import { MarketplaceProduct } from "@/types/marketplace";

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedProduct: MarketplaceProduct | null;
  onSubmit: (data: Partial<MarketplaceProduct>) => Promise<void>;
  isLoading: boolean;
  isUploading: boolean;
}

export const EditProductDialog = ({
  isOpen,
  onOpenChange,
  selectedProduct,
  onSubmit,
  isLoading,
  isUploading
}: EditProductDialogProps) => {
  if (!selectedProduct) return null;
  
  // Handle form submission and map ProductFormValues to the expected type
  const handleSubmit = async (data: ProductFormValues) => {
    // Map form data to MarketplaceProduct partial
    await onSubmit(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>
        <ProductForm
          defaultValues={selectedProduct}
          onSubmit={handleSubmit}
          isLoading={isLoading}
          isUploading={isUploading}
          mode="edit"
        />
      </DialogContent>
    </Dialog>
  );
};
