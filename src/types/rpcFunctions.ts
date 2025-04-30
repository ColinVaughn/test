
import { SupabaseClient } from '@supabase/supabase-js';

// Define the return types for our RPC functions
export interface SellerReview {
  id: string;
  seller_id: string;
  customer_id: string;
  order_id: string | null;
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

// Update the CustomSupabaseClient interface
export interface CustomSupabaseClient extends Omit<SupabaseClient, 'rpc'> {
  rpc<T = any>(
    fn: 'is_admin' | 'fetch_users_for_admin' | 'increment' | 'get_seller_reviews' | 'create_or_update_article',
    params?: Record<string, unknown>
  ): Promise<{ data: T; error: Error | null }>;
}
