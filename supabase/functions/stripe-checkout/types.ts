
export type CheckoutData = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl?: string;
  addresses?: any;
  promoCode?: string;
  accessories?: string[];
  affiliateCode?: string | null;
  couponCode?: string | null;
  pcConfiguration?: Record<string, any> | null;
  components?: Record<string, string> | null;
};

export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          total: number;
          status: string;
          stripe_session_id: string | null;
          updated_at: string | null;
        }
      },
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          product_name: string;
          quantity: number;
          price: number;
          product_details: Record<string, any> | null;
        }
      },
      payment_transactions: {
        Row: {
          id: string;
          order_id: string;
          amount: number;
          status: string;
          payment_method: string;
          transaction_id: string | null;
          customer_email: string | null;
          zelle_notes: string | null;
          zelle_received_amount: number | null;
          customer_metadata: Record<string, any> | null;
        }
      }
    }
  }
};
