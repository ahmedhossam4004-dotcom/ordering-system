import { MenuItem, Restaurant, User, DiscountCode } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    name: 'System Owner',
    email: 'owner@system.com',
    phone: '123-456-7890',
    password: '123',
    role: 'OWNER',
  },
  {
    id: 'u2',
    name: 'Admin Burger',
    email: 'admin@burger.com',
    phone: '987-654-3210',
    password: '123',
    role: 'ADMIN',
    assignedRestaurantId: 'r1',
  },
  {
    id: 'u3',
    name: 'John Doe',
    email: 'user@gmail.com',
    phone: '555-555-5555',
    password: '123',
    role: 'USER',
  },
];

export const INITIAL_RESTAURANTS: Restaurant[] = [
  {
    id: 'r1',
    name: 'Burger Kingpin',
    description: 'The best flame-grilled burgers in town.',
    image: 'https://picsum.photos/800/600?random=1',
    deliveryFee: 2.99,
    rating: 4.5,
  },
  {
    id: 'r2',
    name: 'Sushi Master',
    description: 'Fresh japanese cuisine and rolls.',
    image: 'https://picsum.photos/800/600?random=2',
    deliveryFee: 4.99,
    rating: 4.8,
  },
  {
    id: 'r3',
    name: 'Pizza Palace',
    description: 'Authentic Italian stone-baked pizza.',
    image: 'https://picsum.photos/800/600?random=3',
    deliveryFee: 1.99,
    rating: 4.2,
  },
];

export const INITIAL_MENU: MenuItem[] = [
  { id: 'm1', restaurantId: 'r1', name: 'Classic Cheese', description: 'Beef patty, cheddar, lettuce.', price: 8.99, category: 'Burgers', available: true },
  { id: 'm2', restaurantId: 'r1', name: 'Bacon Deluxe', description: 'Double beef, bacon, bbq sauce.', price: 12.99, category: 'Burgers', available: true },
  { id: 'm3', restaurantId: 'r2', name: 'Salmon Roll', description: 'Fresh salmon, avocado, rice.', price: 6.50, category: 'Sushi', available: true },
  { id: 'm4', restaurantId: 'r3', name: 'Pepperoni', description: 'Mozzarella and spicy pepperoni.', price: 14.00, category: 'Pizza', available: true },
];

export const INITIAL_PROMOS: DiscountCode[] = [
  { id: 'p1', code: 'WELCOME10', percentage: 10, active: true },
  { id: 'p2', code: 'SAVE20', percentage: 20, active: true },
];
