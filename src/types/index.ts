export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_seller: boolean;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent: number | null;
}

export interface ProductImage {
  id: number;
  image: string;
  alt_text: string;
}

export interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: string;
  compare_at_price: string | null;
  sku?: string;
  stock_quantity?: number;
  category?: Category;
  category_name?: string;
  seller?: number;
  seller_name?: string;
  images?: ProductImage[];
  image_url?: string | null;
  average_rating?: number;
  avg_rating?: number | null;
  review_count?: number;
  is_in_stock?: boolean;
  in_stock?: boolean;
  discount_percent?: number;
  created_at: string;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface OrderItem {
  id: number;
  product_name: string;
  product_price: string;
  quantity: number;
  subtotal: string;
}

export interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: string;
  items: OrderItem[];
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ProductFilters {
  category?: string;
  min_price?: string;
  max_price?: string;
  in_stock?: string;
  search?: string;
  ordering?: string;
  page?: number;
}
