
// Product categories enum and array
export type ProductCategory = 'cpu' | 'gpu' | 'ram' | 'motherboard' | 'storage' | 'case' | 'psu' | 'cooler' | 'os' | 'peripheral' | 'accessory' | 'all';
export const PRODUCT_CATEGORIES: ProductCategory[] = ['cpu', 'gpu', 'ram', 'motherboard', 'storage', 'case', 'psu', 'cooler', 'os', 'peripheral', 'accessory'];

export type ProductCondition = 'new' | 'used' | 'refurbished';
export const PRODUCT_CONDITIONS: ProductCondition[] = ['new', 'used', 'refurbished'];

// Status enums
export type ProgramStatus = 'pending' | 'active' | 'inactive';
export type SampleRequestStatus = 'pending' | 'approved' | 'rejected' | 'shipped' | 'received';
export type MessageStatus = 'unread' | 'read' | 'replied';

// Program types for affiliates
export type ProgramType = 'product_specific' | 'seller_wide' | 'exclusive' | 'commission' | 'free_sample' | 'refundable_sample';

// Seller interface
export interface MarketplaceSeller {
  id: string;
  user_id: string;
  store_name: string;
  description?: string;
  logo_url?: string;
  approved: boolean;
  commission_rate: number;
  created_at: string;
  updated_at: string;
  stripe_connect_id?: string;
  payment_details?: Record<string, any>;
  about_text?: string;
  return_policy?: string;
  buyer_protection_policy?: string;
  banner_url?: string;
  store_slug: string;
  social_links?: {
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  policies?: Record<string, any>;
  rating?: number;
  review_count?: number;
}

// Review interface
export interface SellerReview {
  id: string;
  seller_id: string;
  customer_id: string;
  order_id?: string;
  rating: number;
  review_text?: string;
  created_at: string;
  updated_at: string;
  reported: boolean;
  moderation_status: string;
  helpful_count: number;
  unhelpful_count: number;
  customer: {
    email: string;
  };
}

// Product interface
export interface MarketplaceProduct {
  id: string;
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  condition: ProductCondition;
  seller_id: string;
  stock_quantity: number;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  created_at: string;
  updated_at: string;
  images: string[];
  specs?: Record<string, any>;
  seller?: {
    store_name: string;
    logo_url?: string;
    id?: string;
    store_slug?: string;
    description?: string;
  };
  shipping?: {
    dimensions?: string;
    weight?: string;
    insuranceCoverage?: number;
  };
}

// Order interface for marketplace
export interface MarketplaceOrder {
  id: string;
  seller_id: string;
  order_id: string;
  product_id: string;
  status: string;
  total_price: number;
  quantity: number;
  price_per_unit: number;
  commission_amount: number;
  seller_payout: number;
  created_at: string;
  updated_at: string;
  shipping_deadline_met?: boolean;
  marketplace_shipping_deadlines?: {
    deadline: string;
  }[];
  product?: {
    name: string;
    images: string[];
    category: string;
  };
}

// Customer Message interface
export interface CustomerMessage {
  id: string;
  customer_id?: string;
  seller_id: string;
  subject: string;
  message: string;
  status: MessageStatus;
  created_at: string;
  updated_at: string;
  customer_email?: string;
  order_id?: string;
  product_name?: string;
}

// Message Reply interface
export interface MessageReply {
  id: string;
  message_id: string;
  seller_id: string;
  reply: string;
  created_at: string;
}

// Seller Affiliate Program interface
export interface SellerAffiliateProgram {
  id: string;
  seller_id: string;
  affiliate_id: string;
  program_type: ProgramType;
  status: ProgramStatus;
  commission_rate?: number;
  product_id?: string;
  requirements?: string;
  created_at: string;
  updated_at: string;
  affiliates?: {
    code: string;
    user_profiles?: {
      email: string;
    }
  };
  marketplace_sellers?: {
    store_name: string;
    logo_url?: string;
  };
  marketplace_products?: {
    name: string;
    price: number;
  };
}

// Cart item interface
export interface CartItem {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  product_type: string;
  user_id: string; // We'll keep this required in the interface
  details?: {
    description?: string;
    imageUrl?: string;
    specs?: Record<string, any>;
    seller?: string;
    condition?: string;
    shipping?: {
      dimensions?: string;
      weight?: string;
      insuranceCoverage?: number;
    };
  };
  configuration?: any;
}

// Update the shipping input in ProductFormValues
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
