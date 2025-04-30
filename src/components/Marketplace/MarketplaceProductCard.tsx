import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, MessageSquare } from "lucide-react";
import { MarketplaceProduct } from "@/types/marketplace";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useCart } from "@/hooks/use-cart";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface MarketplaceProductCardProps {
  product: MarketplaceProduct;
}

export const MarketplaceProductCard = ({ product }: MarketplaceProductCardProps) => {
  const { addItem } = useCart();
  const { currentUser } = useAuth();
  const [isContactDialogOpen, setIsContactDialogOpen] = useState(false);
  const [messageSubject, setMessageSubject] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleAddToCart = () => {
    addItem({
      product_id: product.id,
      product_name: product.name,
      price: product.price,
      quantity: 1,
      product_type: 'marketplace',
      details: {
        specs: product.specs,
        description: product.description,
        imageUrl: product.images && product.images.length > 0 ? product.images[0] : "/placeholder.svg",
        seller: product.seller?.store_name || "Unknown Seller",
        condition: product.condition,
        shipping: product.shipping
      }
    }).catch(error => {
      console.error("Error adding to cart:", error);
      toast.error(`Failed to add ${product.name} to cart`);
    });
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      toast.error("Please sign in to contact sellers");
      return;
    }

    if (!messageSubject.trim() || !messageBody.trim()) {
      toast.error("Please provide both subject and message");
      return;
    }

    setIsSendingMessage(true);
    try {
      console.log("Sending message to seller:", {
        seller_id: product.seller_id,
        customer_id: currentUser.id,
        subject: messageSubject.trim(),
        message: messageBody.trim(),
        product_name: product.name
      });
      
      const { data, error } = await supabase
        .from('marketplace_customer_messages')
        .insert({
          seller_id: product.seller_id,
          customer_id: currentUser.id,
          subject: messageSubject.trim(),
          message: messageBody.trim(),
          product_name: product.name
        })
        .select();

      if (error) {
        console.error("Database error sending message:", error);
        throw error;
      }
      
      console.log("Message sent successfully:", data);
      toast.success("Message sent to seller successfully");
      setIsContactDialogOpen(false);
      setMessageSubject("");
      setMessageBody("");
    } catch (error) {
      console.error("Error sending message to seller:", error);
      toast.error("Failed to send message to seller");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const openContactDialog = () => {
    console.log("Contact seller clicked for product:", product);
    if (!product.seller_id) {
      console.error("No seller ID available for this product");
      toast.error("Cannot contact seller: Seller information not available");
      return;
    }
    
    if (!currentUser) {
      toast.error("Please sign in to contact sellers");
      return;
    }
    
    setIsContactDialogOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden bg-gaming-dark/30 border-gaming-dark hover:border-gaming-accent/30 transition-all duration-300">
        <div className="relative h-52 overflow-hidden">
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          {product.featured && (
            <Badge className="absolute top-2 left-2 bg-gaming-blue">
              Featured
            </Badge>
          )}
          <Badge 
            className={`absolute top-2 right-2 ${
              product.condition === 'new' ? 'bg-green-600' : 
              product.condition === 'used' ? 'bg-amber-600' : 'bg-blue-600'
            }`}
          >
            {product.condition}
          </Badge>
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium text-lg truncate">{product.name}</h3>
              {product.seller && (
                <Link 
                  to={`/marketplace/seller/${product.seller.store_slug || product.seller_id}`}
                  className="text-sm text-gaming-blue hover:underline"
                >
                  {product.seller.store_name}
                </Link>
              )}
            </div>
            <p className="text-gaming-blue font-bold">${product.price.toFixed(2)}</p>
          </div>
          <p className="text-sm text-gray-400 mt-2 line-clamp-2">
            {product.description || "No description available."}
          </p>
          <div className="mt-2">
            <Badge variant="outline" className="mr-1">
              {product.category}
            </Badge>
            {product.stock_quantity < 5 && (
              <Badge variant={product.stock_quantity === 0 ? "destructive" : "secondary"}>
                {product.stock_quantity === 0 ? "Out of stock" : `Only ${product.stock_quantity} left`}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
          <Button 
            variant="default" 
            className="flex-1 min-w-[100px]"
            onClick={handleAddToCart}
            disabled={product.stock_quantity === 0}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add to Cart
          </Button>
          <Link to={`/marketplace/product/${product.id}`} className="flex-1 min-w-[100px]">
            <Button variant="outline" className="w-full">
              Details
            </Button>
          </Link>
          <Button 
            variant="secondary" 
            className="w-full mt-2"
            onClick={openContactDialog}
            disabled={!product.seller_id || !currentUser}
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Seller
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isContactDialogOpen} onOpenChange={setIsContactDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Contact {product.seller?.store_name || "Seller"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subject" className="text-right">
                Subject
              </Label>
              <Input
                id="subject"
                value={messageSubject}
                onChange={(e) => setMessageSubject(e.target.value)}
                className="col-span-3"
                placeholder="Question about product"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label htmlFor="message" className="text-right">
                Message
              </Label>
              <Textarea
                id="message"
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                className="col-span-3"
                rows={6}
                placeholder="Your question or inquiry about this product..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsContactDialogOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleSendMessage} disabled={isSendingMessage}>
              {isSendingMessage ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
