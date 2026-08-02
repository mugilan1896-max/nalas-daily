export interface OrderItem {
  id: string;
  order_id: string;
  meal_id: string;
  meal_type: string;
  quantity: number;
  meal_title: string;
  meal_image_url?: string;
  calories?: number;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  delivery_date: string;
  delivery_time_slot: string;
  status: 'pending' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  address_id: string;
  address_line1?: string;
  city?: string;
  pincode?: string;
  total_amount: number;
  created_at: string;
  items: OrderItem[];
  user_name?: string;
  phone_number?: string;
}
