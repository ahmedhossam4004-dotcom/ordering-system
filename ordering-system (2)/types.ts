export type Role = 'OWNER' | 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string; // New field
  password: string; // In a real app, this would be hashed
  role: Role;
  assignedRestaurantId?: string; // For Admins
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  deliveryFee: number;
  rating: number;
}

export type Size = 'S' | 'M' | 'L';

export interface CartItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
  size: Size;
  note: string;
  restaurantId: string;
}

export type OrderStatus = 'PENDING' | 'PREPARING' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  restaurantName: string;
  items: CartItem[];
  totalAmount: number;
  discountAmount?: number;
  finalAmount?: number;
  status: OrderStatus;
  createdAt: string; // ISO Date string
  assignedAdminId?: string; // New field for assigning orders
}

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeOrders: number;
}

export interface DiscountCode {
  id: string;
  code: string;
  percentage: number; // 0-100
  active: boolean;
}
