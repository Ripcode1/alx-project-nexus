import { ProductListResponse, Product, Category, Review, Order } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://ecommerce-api-wp9c.onrender.com/api/v1';

type Opts = { method?: string; body?: unknown; token?: string };

async function request<T>(endpoint: string, opts: Opts = {}): Promise<T> {
  const { method = 'GET', body, token } = opts;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const config: RequestInit = { method, headers };
  if (body) config.body = JSON.stringify(body);

  const res = await fetch(`${API_BASE}${endpoint}`, config);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || err.message || `Request failed (${res.status})`);
  }
  if (res.status === 204) return {} as T;
  return res.json();
}

type AuthUser = { id: number; email: string; username: string; first_name: string; last_name: string; is_seller: boolean };
type AuthResponse = { access: string; refresh: string; user: AuthUser; tokens?: { access: string; refresh: string } };

export const login = (email: string, password: string) =>
  request<AuthResponse>('/auth/login/', { method: 'POST', body: { email, password } });

export const register = (data: { email: string; username: string; password: string; password_confirm: string; first_name: string; last_name: string }) =>
  request<AuthResponse>('/auth/register/', { method: 'POST', body: data });

export const getProducts = (params?: Record<string, string>) => {
  const q = params ? '?' + new URLSearchParams(params).toString() : '';
  return request<ProductListResponse>(`/products/${q}`);
};

export const getProduct = (slug: string) => request<Product>(`/products/${slug}/`);
export const getProductReviews = (slug: string) => request<Review[]>(`/products/${slug}/reviews/`);
export const createReview = (slug: string, data: { rating: number; comment: string }, token: string) =>
  request<Review>(`/products/${slug}/reviews/`, { method: 'POST', body: data, token });
export const getCategories = () => request<Category[]>(`/categories/`);

export const placeOrder = (items: { product: number; quantity: number }[], token: string) =>
  request<Order>('/orders/place/', { method: 'POST', body: { items }, token });
export const getOrders = (token: string) =>
  request<{ count: number; results: Order[] }>('/orders/', { token });
export const cancelOrder = (id: number, token: string) =>
  request<Order>(`/orders/${id}/cancel/`, { method: 'POST', token });
