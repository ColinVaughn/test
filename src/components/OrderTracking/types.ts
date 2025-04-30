
export interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
}

export interface OrderItem {
  id: string;
  product_name: string;
  quantity: number;
  price: number;
  product_id?: string;
  product_type?: 'custom' | 'prebuilt' | 'accessory';
  product_details?: Record<string, any>;
}

export interface Shipment {
  id: string;
  tracking_number: string | null;
  carrier: string | null;
  status: string | null;
  estimated_delivery: string | null;
  tracking_url?: string | null;
}
