import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useMarketplace } from "@/hooks/use-marketplace";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Tag, Percent, Award, Star } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Promotion {
  id: string;
  seller_id: string;
  name: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  product_id?: string;
  is_active: boolean;
  start_date: string;
  end_date?: string;
  code?: string;
  created_at: string;
  marketplace_products?: {
    name: string;
  };
}

interface PromotionToolsProps {
  sellerId: string;
}

const mockPromotions: Promotion[] = [
  {
    id: "1",
    seller_id: "seller-1",
    name: "Summer Sale",
    description: "Get 15% off on all products",
    discount_type: "percentage",
    discount_value: 15,
    is_active: true,
    start_date: "2025-04-01T00:00:00Z",
    end_date: "2025-06-30T23:59:59Z",
    code: "SUMMER15",
    created_at: "2025-03-15T10:00:00Z"
  },
  {
    id: "2",
    seller_id: "seller-1",
    name: "Flash Sale",
    description: "Get $20 off on selected products",
    discount_type: "fixed",
    discount_value: 20,
    product_id: "product-123",
    is_active: true,
    start_date: "2025-04-15T00:00:00Z",
    end_date: "2025-04-20T23:59:59Z",
    code: "FLASH20",
    created_at: "2025-04-10T15:30:00Z",
    marketplace_products: {
      name: "Gaming Mouse"
    }
  }
];

const PromotionTools: React.FC<PromotionToolsProps> = ({ sellerId }) => {
  const { sellerProducts } = useMarketplace();
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAction, setIsLoadingAction] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState("");
  const [productId, setProductId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [code, setCode] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (sellerId) {
      fetchPromotions();
    }
  }, [sellerId]);

  const fetchPromotions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('marketplace_promotions')
        .select(`
          *,
          marketplace_products (name)
        `)
        .eq('seller_id', sellerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromotions(data as Promotion[]);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      toast.error("Failed to load promotions");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDiscountType('percentage');
    setDiscountValue("");
    setProductId("");
    setIsActive(true);
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate("");
    setCode("");
    setSelectedProducts({});
  };

  const openDialog = (promotion: Promotion | null = null) => {
    resetForm();
    
    if (promotion) {
      setName(promotion.name);
      setDescription(promotion.description || "");
      setDiscountType(promotion.discount_type);
      setDiscountValue(promotion.discount_value.toString());
      setProductId(promotion.product_id || "");
      setIsActive(promotion.is_active);
      setStartDate(promotion.start_date.split('T')[0]);
      setEndDate(promotion.end_date ? promotion.end_date.split('T')[0] : "");
      setCode(promotion.code || "");
      setEditingPromotion(promotion);
      
      if (promotion.product_id) {
        setSelectedProducts({ [promotion.product_id]: true });
      }
    } else {
      setEditingPromotion(null);
      setStartDate(new Date().toISOString().split('T')[0]);
    }
    
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingAction(true);
    
    try {
      if (!name || !discountValue || !startDate) {
        toast.error("Please fill in all required fields");
        setIsLoadingAction(false);
        return;
      }
      
      const numDiscountValue = parseFloat(discountValue);
      if (isNaN(numDiscountValue) || numDiscountValue <= 0) {
        toast.error("Discount value must be a positive number");
        setIsLoadingAction(false);
        return;
      }
      
      if (discountType === 'percentage' && (numDiscountValue <= 0 || numDiscountValue > 100)) {
        toast.error("Percentage discount must be between 1 and 100");
        setIsLoadingAction(false);
        return;
      }
      
      if (endDate && new Date(endDate) <= new Date(startDate)) {
        toast.error("End date must be after start date");
        setIsLoadingAction(false);
        return;
      }
      
      const selectedProductId = Object.keys(selectedProducts).length === 1 
        ? Object.keys(selectedProducts)[0] 
        : undefined;
      
      setTimeout(() => {
        if (editingPromotion) {
          setPromotions(promotions.map(p => 
            p.id === editingPromotion.id 
              ? {
                  ...p,
                  name,
                  description,
                  discount_type: discountType,
                  discount_value: numDiscountValue,
                  product_id: selectedProductId,
                  is_active: isActive,
                  start_date: new Date(startDate).toISOString(),
                  end_date: endDate ? new Date(endDate).toISOString() : undefined,
                  code
                }
              : p
          ));
          toast.success("Promotion updated successfully");
        } else {
          const newPromotion: Promotion = {
            id: `promo-${Date.now()}`,
            seller_id: sellerId,
            name,
            description,
            discount_type: discountType,
            discount_value: numDiscountValue,
            product_id: selectedProductId,
            is_active: isActive,
            start_date: new Date(startDate).toISOString(),
            end_date: endDate ? new Date(endDate).toISOString() : undefined,
            code,
            created_at: new Date().toISOString()
          };
          
          setPromotions([...promotions, newPromotion]);
          toast.success("Promotion created successfully");
        }
        
        setIsDialogOpen(false);
        setIsLoadingAction(false);
      }, 500);
    } catch (error) {
      console.error("Error saving promotion:", error);
      toast.error("Failed to save promotion");
      setIsLoadingAction(false);
    }
  };

  const togglePromotionStatus = async (promotion: Promotion) => {
    try {
      setPromotions(promotions.map(p => 
        p.id === promotion.id ? { ...p, is_active: !p.is_active } : p
      ));
      
      toast.success(`Promotion ${promotion.is_active ? 'disabled' : 'enabled'}`);
    } catch (error) {
      console.error("Error toggling promotion status:", error);
      toast.error("Failed to update promotion");
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this promotion?")) return;
    
    try {
      setPromotions(promotions.filter(p => p.id !== id));
      toast.success("Promotion deleted successfully");
    } catch (error) {
      console.error("Error deleting promotion:", error);
      toast.error("Failed to delete promotion");
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts({
      ...selectedProducts,
      [productId]: !selectedProducts[productId]
    });
  };

  const generatePromoCode = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const length = 8;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
  };

  const formatDiscount = (type: 'percentage' | 'fixed', value: number) => {
    return type === 'percentage' ? `${value}%` : `$${value.toFixed(2)}`;
  };

  const formatDateRange = (start: string, end?: string) => {
    const startDate = new Date(start).toLocaleDateString();
    if (!end) return `From ${startDate}`;
    const endDate = new Date(end).toLocaleDateString();
    return `${startDate} - ${endDate}`;
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Promotions & Discounts</CardTitle>
          <Button onClick={() => openDialog()}>
            Create Promotion
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gaming-blue" />
            </div>
          ) : promotions.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed rounded-lg border-gray-600">
              <Tag className="h-12 w-12 mx-auto text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No promotions yet</h3>
              <p className="mt-2 text-sm text-gray-400 max-w-sm mx-auto">
                Create discounts, special offers, and promotional codes to boost your sales
              </p>
              <Button 
                className="mt-4" 
                variant="outline"
                onClick={() => openDialog()}
              >
                Create Your First Promotion
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {promotions.map((promotion) => (
                <Card key={promotion.id} className="bg-gaming-dark/30">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {promotion.is_active ? (
                            <div className="h-2 w-2 rounded-full bg-green-500"></div>
                          ) : (
                            <div className="h-2 w-2 rounded-full bg-gray-500"></div>
                          )}
                          <h3 className="font-medium">{promotion.name}</h3>
                          {promotion.code && (
                            <div className="bg-gaming-darker text-xs font-mono px-2 py-1 rounded">
                              {promotion.code}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-400 mb-2">
                          {formatDateRange(promotion.start_date, promotion.end_date)}
                        </div>
                        
                        {promotion.description && (
                          <p className="text-sm text-gray-300 mb-2">{promotion.description}</p>
                        )}
                        
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center">
                            {promotion.discount_type === 'percentage' ? (
                              <Percent className="h-3 w-3 text-gaming-blue mr-1" />
                            ) : (
                              <Tag className="h-3 w-3 text-gaming-blue mr-1" />
                            )}
                            <span className="text-gaming-blue font-medium">
                              {formatDiscount(promotion.discount_type, promotion.discount_value)}
                            </span>
                            <span className="text-gray-400 ml-1">discount</span>
                          </div>
                          
                          {promotion.product_id && (
                            <div className="text-gray-400">
                              • For {promotion.marketplace_products?.name || "specific product"}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Switch
                          checked={promotion.is_active}
                          onCheckedChange={() => togglePromotionStatus(promotion)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => openDialog(promotion)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeletePromotion(promotion.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingPromotion ? "Edit Promotion" : "Create New Promotion"}
            </DialogTitle>
            <DialogDescription>
              Create discounts and special offers for your products
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Promotion Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Summer Sale, Holiday Discount, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your promotion"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Discount Type *</Label>
                <Select 
                  value={discountType} 
                  onValueChange={(value) => setDiscountType(value as 'percentage' | 'fixed')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select discount type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="percentage">Percentage (%)</SelectItem>
                      <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value *</Label>
                <div className="relative">
                  <Input
                    id="discountValue"
                    type="number"
                    min="0"
                    step={discountType === 'percentage' ? "1" : "0.01"}
                    max={discountType === 'percentage' ? "100" : undefined}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    placeholder={discountType === 'percentage' ? "10" : "5.99"}
                    className="pl-7"
                    required
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    {discountType === 'percentage' ? '%' : '$'}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <p className="text-xs text-gray-400">Leave blank for no end date</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Promotion Code</Label>
              <div className="flex gap-2">
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="SUMMER25, HOLIDAY20, etc."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={generatePromoCode}
                >
                  Generate
                </Button>
              </div>
              <p className="text-xs text-gray-400">Optional code customers can enter at checkout</p>
            </div>

            <div className="space-y-2">
              <Label>Products</Label>
              {sellerProducts && sellerProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-md p-2">
                  {sellerProducts.map((product) => (
                    <div key={product.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={product.id}
                        checked={!!selectedProducts[product.id]}
                        onCheckedChange={() => toggleProductSelection(product.id)}
                      />
                      <label htmlFor={product.id} className="text-sm">{product.name}</label>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No products available</p>
              )}
              <p className="text-xs text-gray-400">
                Select products to include or leave unselected for store-wide promotion
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="active">Promotion Active</Label>
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoadingAction}
              >
                {isLoadingAction ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    {editingPromotion ? "Update" : "Create"} Promotion
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PromotionTools;
