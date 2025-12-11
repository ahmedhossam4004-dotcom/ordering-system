import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Restaurant, MenuItem, Order, CartItem, Size, DiscountCode } from './types';
import { INITIAL_USERS, INITIAL_RESTAURANTS, INITIAL_MENU, INITIAL_PROMOS } from './constants';

interface LoginResult {
  success: boolean;
  error?: string;
}

interface StoreContextType {
  currentUser: User | null;
  users: User[];
  restaurants: Restaurant[];
  menuItems: MenuItem[];
  orders: Order[];
  cart: CartItem[];
  discountCodes: DiscountCode[];
  
  // Auth
  login: (email: string, pass: string) => LoginResult;
  signup: (name: string, email: string, pass: string, phone: string) => void;
  logout: () => void;
  
  // Cart
  addToCart: (item: MenuItem, size: Size, note: string) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  
  // Orders
  placeOrder: (adminId: string, discountCode?: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  assignOrder: (orderId: string, adminId: string) => void;
  validatePromoCode: (code: string) => number | null; 
  
  // Admin/Owner Actions
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  
  addRestaurant: (restaurant: Restaurant) => void;
  updateRestaurant: (id: string, data: Partial<Restaurant>) => void;
  deleteRestaurant: (id: string) => void;
  
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (itemId: string) => void;
  
  addDiscountCode: (code: DiscountCode) => void;
  deleteDiscountCode: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [restaurants, setRestaurants] = useState<Restaurant[]>(INITIAL_RESTAURANTS);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>(INITIAL_PROMOS);

  // Auth Logic
  const login = (email: string, pass: string): LoginResult => {
    const userExists = users.find(u => u.email === email);
    
    if (!userExists) {
      return { success: false, error: "Invalid user name (email not found)" };
    }

    if (userExists.password !== pass) {
      return { success: false, error: "Wrong password" };
    }

    setCurrentUser(userExists);
    return { success: true };
  };

  const signup = (name: string, email: string, pass: string, phone: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      phone,
      password: pass,
      role: 'USER',
    };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  // Cart Logic
  const addToCart = (item: MenuItem, size: Size, note: string) => {
    if (cart.length > 0 && cart[0].restaurantId !== item.restaurantId) {
      if(!window.confirm("Start a new basket? Adding items from a new restaurant will clear your current cart.")) return;
      setCart([]);
    }

    let priceMultiplier = 1;
    if (size === 'M') priceMultiplier = 1.2;
    if (size === 'L') priceMultiplier = 1.5;

    const newItem: CartItem = {
      itemId: item.id,
      name: item.name,
      price: item.price * priceMultiplier,
      quantity: 1,
      size,
      note,
      restaurantId: item.restaurantId,
    };
    
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => setCart([]);

  // Promos
  const validatePromoCode = (code: string) => {
    const promo = discountCodes.find(d => d.code === code && d.active);
    return promo ? promo.percentage : null;
  };

  // Order Logic
  const placeOrder = (adminId: string, discountCodeStr?: string) => {
    if (!currentUser || cart.length === 0) return;

    const restaurant = restaurants.find(r => r.id === cart[0].restaurantId);
    let totalAmount = cart.reduce((sum, item) => sum + item.price, 0) + (restaurant?.deliveryFee || 0);
    
    let discountAmount = 0;
    if (discountCodeStr) {
      const percentage = validatePromoCode(discountCodeStr);
      if (percentage) {
        discountAmount = (totalAmount * percentage) / 100;
      }
    }
    
    const finalAmount = totalAmount - discountAmount;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: currentUser.id,
      restaurantId: restaurant?.id || '',
      restaurantName: restaurant?.name || 'Unknown',
      items: [...cart],
      totalAmount,
      discountAmount,
      finalAmount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      assignedAdminId: adminId
    };

    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const assignOrder = (orderId: string, adminId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, assignedAdminId: adminId } : o));
  };

  // Admin/Owner Logic
  const addUser = (user: User) => setUsers(prev => [...prev, user]);
  const removeUser = (userId: string) => setUsers(prev => prev.filter(u => u.id !== userId));
  
  const addRestaurant = (restaurant: Restaurant) => setRestaurants(prev => [...prev, restaurant]);
  const updateRestaurant = (id: string, data: Partial<Restaurant>) => {
    setRestaurants(prev => prev.map(r => r.id === id ? { ...r, ...data } : r));
  };
  const deleteRestaurant = (id: string) => {
    setRestaurants(prev => prev.filter(r => r.id !== id));
    setMenuItems(prev => prev.filter(m => m.restaurantId !== id)); // Cascade delete items
  };

  const addMenuItem = (item: MenuItem) => setMenuItems(prev => [...prev, item]);
  const deleteMenuItem = (itemId: string) => setMenuItems(prev => prev.filter(i => i.id !== itemId));

  const addDiscountCode = (code: DiscountCode) => setDiscountCodes(prev => [...prev, code]);
  const deleteDiscountCode = (id: string) => setDiscountCodes(prev => prev.filter(d => d.id !== id));

  return (
    <StoreContext.Provider value={{
      currentUser, users, restaurants, menuItems, orders, cart, discountCodes,
      login, signup, logout,
      addToCart, removeFromCart, clearCart,
      placeOrder, updateOrderStatus, assignOrder, validatePromoCode,
      addUser, removeUser,
      addRestaurant, updateRestaurant, deleteRestaurant,
      addMenuItem, deleteMenuItem,
      addDiscountCode, deleteDiscountCode
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
