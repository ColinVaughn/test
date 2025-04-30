

export interface SellerReview {
  id: string;
  seller_id: string;
  customer_id: string;
  order_id?: string | null; // Make optional to match the type in rpcFunctions.ts
  rating: number;
  review_text: string;
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

