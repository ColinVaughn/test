
import React from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MarketplaceProduct, PRODUCT_CATEGORIES, ProductCategory, ProductCondition } from "@/types/marketplace";
import { Card, CardContent } from "@/components/ui/card";

export interface ProductFormValues {
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  category: ProductCategory;
  condition: ProductCondition;
  featured?: boolean;
  images?: string[];
  shipping?: {
    dimensions: string;
    weight: string;
    insuranceCoverage: number;
  };
}

interface ProductFormProps {
  defaultValues?: Partial<MarketplaceProduct>;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  isLoading: boolean;
  isUploading: boolean;
  mode: 'add' | 'edit';
}

export const ProductForm = ({ 
  defaultValues, 
  onSubmit, 
  isLoading, 
  isUploading, 
  mode 
}: ProductFormProps) => {
  console.log("ProductForm - Default values received:", defaultValues);
  
  // Extract shipping details from specs or from shipping directly
  const shippingDefaults = {
    dimensions: "",
    weight: "",
    insuranceCoverage: 100
  };
  
  if (defaultValues) {
    // Check if shipping data is available directly
    if (defaultValues.shipping) {
      console.log("ProductForm - Found shipping data:", defaultValues.shipping);
    } else {
      console.log("ProductForm - No shipping data found in defaults");
    }
  }
  
  const form = useForm<ProductFormValues>({
    defaultValues: {
      name: defaultValues?.name || "",
      description: defaultValues?.description || "",
      price: defaultValues?.price || 0,
      stock_quantity: defaultValues?.stock_quantity || 1,
      category: defaultValues?.category || "cpu",
      condition: defaultValues?.condition || "new",
      featured: defaultValues?.featured || false,
      images: defaultValues?.images || [],
      shipping: defaultValues?.shipping || shippingDefaults
    }
  });

  const handleFormSubmit = async (data: ProductFormValues) => {
    // Ensure shipping data is properly formatted
    const formattedData = {
      ...data,
      shipping: {
        dimensions: data.shipping?.dimensions || "",
        weight: data.shipping?.weight || "",
        insuranceCoverage: data.shipping?.insuranceCoverage || 100
      }
    };
    
    console.log("ProductForm - Submitting form with data:", formattedData);
    await onSubmit(formattedData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Product Name" />
              </FormControl>
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Product Description" rows={3} />
              </FormControl>
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="stock_quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Quantity</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    type="number" 
                    min="0" 
                    step="1" 
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select 
                  onValueChange={(value: ProductCategory) => field.onChange(value)} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {PRODUCT_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="condition"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Condition</FormLabel>
                <Select 
                  onValueChange={(value: ProductCondition) => field.onChange(value)} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>
        
        <Card className="p-4 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            <h3 className="font-medium mb-2">Shipping Information</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              These details are used to calculate shipping costs and requirements.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="shipping.dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dimensions (WxHxD inches)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="12x8x3" 
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          console.log("Dimensions changed to:", e.target.value);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">Format: WidthxHeightxDepth (in inches)</p>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="shipping.weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="5" 
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          console.log("Weight changed to:", e.target.value);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">Weight in pounds</p>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4">
              <FormField
                control={form.control}
                name="shipping.insuranceCoverage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Insurance Coverage ($)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        min="0" 
                        step="10" 
                        onChange={(e) => {
                          const value = parseFloat(e.target.value);
                          field.onChange(value);
                          console.log("Insurance changed to:", value);
                        }}
                      />
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      Default coverage is $100. Additional insurance costs extra.
                    </p>
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="product-images">Product Images</Label>
            <Input
              id="product-images"
              type="file"
              multiple
              accept="image/*"
              disabled={isUploading}
            />
            <p className="text-xs text-gray-400">
              Upload up to 5 images. They will be automatically optimized.
            </p>
          </div>
        </div>
        
        <div className="flex justify-end pt-4">
          <Button type="submit" disabled={isLoading || isUploading}>
            {isLoading || isUploading ? (mode === 'add' ? "Adding..." : "Saving...") : (mode === 'add' ? "Add Product" : "Save Changes")}
          </Button>
        </div>
      </form>
    </Form>
  );
};
