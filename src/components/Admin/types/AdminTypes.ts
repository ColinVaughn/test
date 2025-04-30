import { PrebuiltPC, Benchmark } from "@/types/types";
import { Json } from "@/integrations/supabase/types";

export interface NewPrebuiltSystem extends Partial<PrebuiltPC> {
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  category: string;
  imageUrl: string;
  specs: Record<string, string>;
  bestseller: boolean;
  featured: boolean;
  new: boolean;
}

export interface NewBenchmark extends Partial<Benchmark> {
  game: string;
  fps: number;
}

export interface OrderType {
  id: string;
  created_at: string;
  status: string;
  total: number;
  user_id: string | null;
  updated_at: string;
  paypal_order_id?: string | null;
  stripe_session_id?: string | null;
  affiliate_code?: string | null;
  coupon_code?: string | null;
}

export interface OrderItemType {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  product_type?: 'custom' | 'prebuilt' | 'accessory';
  product_details?: Record<string, any>;
}

export interface ShipmentType {
  id: string;
  tracking_number: string | null;
  carrier: string | null;
  status: string | null;
  estimated_delivery: string | null;
}

export interface PaymentType {
  id: string;
  customer_email: string | null;
  transaction_id: string | null;
  payment_method: string;
  status: string;
  amount: number;
  zelle_received_amount?: number | null;
  zelle_notes?: string | null;
  customer_metadata?: {
    name?: string;
    email?: string;
    shipping_address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    billing_address?: {
      line1?: string;
      line2?: string;
      city?: string;
      state?: string;
      postal_code?: string;
      country?: string;
    };
    components?: string; // Full components list string
    component_count?: number; // Number of components
    component_details?: Record<string, string>; // Structured component details by category
    product_type?: 'custom_pc' | 'prebuilt_pc' | 'accessory';
  };
}

export interface RMARequest {
  id: string;
  user_id: string;
  order_id: string;
  reason: string;
  status: string;
  items: string[];
  created_at: string;
  updated_at: string;
  notes?: string;
  shipping_label_url?: string;
}
