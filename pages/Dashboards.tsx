import React, { useState } from 'react';
import { useStore } from '../store';
import { Card, Button, Input } from '../components/UI';
import { Trash2, UserPlus, Package, DollarSign, Store, Tag, Settings, User } from 'lucide-react';
import { MenuItem, Restaurant, DiscountCode, OrderStatus } from '../types';

export const Dashboards = () => {
  const { currentUser } = useStore();

  if (!currentUser) return null;

  if (currentUser.role === 'OWNER') return <OwnerDashboard />;
  if (currentUser.role === 'ADMIN') return <AdminDashboard />;
  return <UserDashboard />;
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <Card className="p-6 flex items-center gap-4 bg-dark-900 border-dark-800">
    <div className={`p-3 rounded-xl ${color} bg-opacity-10 backdrop-blur-sm`}>
      <Icon size={24} className={color.replace('bg-', 'text-')} />
    </div>
    <div>
      <p className="text-zinc-400 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white">{value}</h3>
    </div>
  </Card>
);

// --- Owner Dashboard ---
const OwnerDashboard = () => {
  const { 
    users, orders, restaurants, menuItems, discountCodes,
    addUser, removeUser, 
    addRestaurant, deleteRestaurant, 
    addMenuItem, deleteMenuItem,
    addDiscountCode, deleteDiscountCode 
  } = useStore();
  
  const [activeTab, setActiveTab] = useState<'STATS' | 'USERS' | 'ORDERS' | 'RESTAURANTS' | 'MENU' | 'PROMOS'>('STATS');
  
  // Forms
  const [newUser, setNewUser] = useState({ name: '', email: '', phone: '', password: '', role: 'USER' });
  const [newRest, setNewRest] = useState<Partial<Restaurant>>({ name: '', description: '', deliveryFee: 0, image: '' });
  const [newPromo, setNewPromo] = useState<Partial<DiscountCode>>({ code: '', percentage: 10 });
  
  // For Menu Management
  const [selectedRestId, setSelectedRestId] = useState<string>('');
  const [newItem, setNewItem] = useState<Partial<MenuItem>>({ name: '', price: 0, category: '', description: '' });

  const stats = {
    revenue: orders.reduce((acc, o) => acc + (o.finalAmount || o.totalAmount), 0).toFixed(2),
    totalOrders: orders.length,
    activeUsers: users.length
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    addUser({ ...newUser, id: Date.now().toString(), role: newUser.role as any });
    setNewUser({ name: '', email: '', phone: '', password: '', role: 'USER' });
  };

  const handleAddRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newRest.name) return;
    addRestaurant({
      id: `r-${Date.now()}`,
      name: newRest.name,
      description: newRest.description || '',
      deliveryFee: Number(newRest.deliveryFee),
      image: newRest.image || 'https://picsum.photos/800/600',
      rating: 5.0
    } as Restaurant);
    setNewRest({ name: '', description: '', deliveryFee: 0, image: '' });
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRestId || !newItem.name) return;
    addMenuItem({
      id: Date.now().toString(),
      restaurantId: selectedRestId,
      name: newItem.name,
      description: newItem.description || '',
      price: Number(newItem.price),
      category: newItem.category || 'General',
      available: true
    });
    setNewItem({ name: '', price: 0, category: '', description: '' });
  };

  const handleAddPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) return;
    addDiscountCode({
      id: Date.now().toString(),
      code: newPromo.code.toUpperCase(),
      percentage: Number(newPromo.percentage),
      active: true
    });
    setNewPromo({ code: '', percentage: 10 });
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <h1 className="text-3xl font-bold text-white tracking-tight">Owner Control Panel</h1>
        <div className="flex flex-wrap gap-2 bg-dark-900 p-1.5 rounded-xl border border-dark-800">
          {['STATS', 'USERS', 'RESTAURANTS', 'MENU', 'PROMOS', 'ORDERS'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${activeTab === tab ? 'bg-primary text-white shadow-lg shadow-blue-900/20' : 'text-zinc-400 hover:text-white hover:bg-dark-800'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'STATS' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard title="Total Revenue" value={`$${stats.revenue}`} icon={DollarSign} color="text-emerald-400" />
          <StatCard title="Total Orders" value={stats.totalOrders} icon={Package} color="text-blue-400" />
          <StatCard title="Total Users" value={stats.activeUsers} icon={UserPlus} color="text-purple-400" />
        </div>
      )}

      {activeTab === 'USERS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">System Users</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-zinc-400">
                <thead className="bg-dark-900 text-zinc-200 uppercase font-medium rounded-lg">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Name</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3 text-right rounded-r-lg">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-800">
                  {users.map(user => (
                    <tr key={user.id} className="hover:bg-dark-800/50 transition-colors">
                      <td className="px-4 py-3 text-white font-medium">{user.name}</td>
                      <td className="px-4 py-3 text-zinc-500">{user.phone}</td>
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold uppercase tracking-wider bg-dark-900 px-2 py-1 rounded border border-dark-700">{user.role}</span></td>
                      <td className="px-4 py-3 text-right">
                        {user.role !== 'OWNER' && (
                          <button onClick={() => removeUser(user.id)} className="text-red-500 hover:text-red-400 transition-colors bg-red-900/10 p-1.5 rounded-md hover:bg-red-900/20">
                            <Trash2 size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card className="p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">Add User</h3>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input label="Name" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required />
              <Input label="Mobile" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} placeholder="+1 234 567 890" required />
              <Input label="Email" type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
              <Input label="Password" type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required />
              <div className="mb-4">
                <label className="block text-zinc-400 text-sm font-medium mb-1">Role</label>
                <select 
                  className="w-full bg-dark-900 border border-dark-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                  value={newUser.role}
                  onChange={e => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="OWNER">Owner</option>
                </select>
              </div>
              <Button type="submit" fullWidth>Create User</Button>
            </form>
          </Card>
        </div>
      )}

      {activeTab === 'RESTAURANTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="p-6 lg:col-span-2">
            <h3 className="text-xl font-bold text-white mb-4">Current Restaurants</h3>
            <div className="grid gap-4">
              {restaurants.map(rest => (
                <div key={rest.id} className="flex justify-between items-center bg-dark-900 p-4 rounded-xl border border-dark-800">
                   <div className="flex items-center gap-4">
                      <img src={rest.image} className="w-16 h-16 rounded-lg object-cover bg-dark-800" />
                      <div>
                        <h4 className="font-bold text-white text-lg">{rest.name}</h4>
                        <p className="text-sm text-zinc-400">{rest.description}</p>
                        <p className="text-xs text-primary font-medium mt-1">${rest.deliveryFee} Fee</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => { setSelectedRestId(rest.id); setActiveTab('MENU'); }} className="text-xs">
                        Menu
                      </Button>
                      <button onClick={() => deleteRestaurant(rest.id)} className="text-red-500 p-2 hover:bg-dark-800 rounded-lg"><Trash2 size={18}/></button>
                   </div>
                </div>
              ))}
            </div>
           </Card>
           <Card className="p-6 h-fit">
             <h3 className="text-xl font-bold text-white mb-4">Add Restaurant</h3>
             <form onSubmit={handleAddRestaurant} className="space-y-4">
                <Input label="Name" value={newRest.name} onChange={e => setNewRest({...newRest, name: e.target.value})} required />
                <Input label="Description" value={newRest.description} onChange={e => setNewRest({...newRest, description: e.target.value})} />
                <Input label="Delivery Fee ($)" type="number" step="0.1" value={newRest.deliveryFee} onChange={e => setNewRest({...newRest, deliveryFee: Number(e.target.value)})} />
                <Input label="Image URL" value={newRest.image} onChange={e => setNewRest({...newRest, image: e.target.value})} placeholder="https://..." />
                <Button type="submit" fullWidth>Create Restaurant</Button>
             </form>
           </Card>
        </div>
      )}

      {activeTab === 'MENU' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="p-6 lg:col-span-2">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-white">Menu Items</h3>
               <select 
                  className="bg-dark-900 border border-dark-700 text-white rounded-lg px-4 py-2 text-sm focus:border-primary outline-none"
                  value={selectedRestId}
                  onChange={(e) => setSelectedRestId(e.target.value)}
               >
                 <option value="">Select Restaurant...</option>
                 {restaurants.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
               </select>
             </div>
             {selectedRestId ? (
                <ul className="space-y-3">
                  {menuItems.filter(m => m.restaurantId === selectedRestId).map(item => (
                    <li key={item.id} className="flex justify-between items-center bg-dark-900 p-4 rounded-xl border border-dark-800 hover:border-dark-700 transition-colors">
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        <p className="text-xs text-zinc-500">{item.description}</p>
                        <p className="text-sm text-primary font-mono mt-1">${item.price.toFixed(2)}</p>
                      </div>
                      <button onClick={() => deleteMenuItem(item.id)} className="text-red-500 p-2 hover:bg-dark-800 rounded-lg transition-colors"><Trash2 size={18}/></button>
                    </li>
                  ))}
                  {menuItems.filter(m => m.restaurantId === selectedRestId).length === 0 && (
                    <div className="text-center py-10 border border-dashed border-dark-800 rounded-xl">
                      <p className="text-zinc-500">No items yet. Add one!</p>
                    </div>
                  )}
                </ul>
             ) : (
               <div className="text-center py-12">
                 <Store size={48} className="mx-auto text-zinc-700 mb-4" />
                 <p className="text-zinc-500">Please select a restaurant to manage its menu.</p>
               </div>
             )}
           </Card>
           
           <Card className="p-6 h-fit">
            <h3 className="text-xl font-bold text-white mb-4">Add Item</h3>
            {selectedRestId ? (
              <form onSubmit={handleAddItem} className="space-y-3">
                <Input label="Name" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                <Input label="Description" value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})} />
                <Input label="Price" type="number" step="0.01" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})} required />
                <Input label="Category" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
                <Button type="submit" fullWidth>Add to Menu</Button>
              </form>
            ) : (
              <p className="text-zinc-500 text-sm">Select a restaurant first to add items.</p>
            )}
           </Card>
        </div>
      )}

      {activeTab === 'PROMOS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <Card className="p-6 lg:col-span-2">
             <h3 className="text-xl font-bold text-white mb-4">Active Discount Codes</h3>
             <div className="grid gap-3">
                {discountCodes.map(promo => (
                  <div key={promo.id} className="flex justify-between items-center bg-dark-900 p-4 rounded-xl border border-dashed border-dark-700">
                    <div className="flex items-center gap-3">
                       <Tag className="text-primary" />
                       <div>
                         <span className="text-lg font-mono font-bold text-white tracking-wider">{promo.code}</span>
                         <span className="ml-3 text-xs bg-emerald-900 text-emerald-400 px-2 py-1 rounded-md border border-emerald-800">{promo.percentage}% OFF</span>
                       </div>
                    </div>
                    <button onClick={() => deleteDiscountCode(promo.id)} className="text-red-500 hover:text-red-400 transition-colors"><Trash2 size={18}/></button>
                  </div>
                ))}
             </div>
           </Card>
           <Card className="p-6 h-fit">
             <h3 className="text-xl font-bold text-white mb-4">Create Promo</h3>
             <form onSubmit={handleAddPromo} className="space-y-4">
               <Input label="Code" value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value})} placeholder="SUMMER20" required />
               <Input label="Percentage Off" type="number" min="1" max="100" value={newPromo.percentage} onChange={e => setNewPromo({...newPromo, percentage: Number(e.target.value)})} required />
               <Button type="submit" fullWidth>Create Code</Button>
             </form>
           </Card>
        </div>
      )}

      {activeTab === 'ORDERS' && (
        <OrdersTable orders={orders} isOwner />
      )}
    </div>
  );
};

// --- Admin Dashboard ---
const AdminDashboard = () => {
  const { currentUser, orders } = useStore();
  
  // Orders logic: Assigned specifically to me
  const myOrders = orders.filter(o => o.assignedAdminId === currentUser?.id);

  const stats = {
    revenue: myOrders.reduce((acc, o) => acc + (o.finalAmount || o.totalAmount), 0).toFixed(2),
    count: myOrders.length
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Delivery Agent Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
             <User size={16} className="text-primary" />
             <p className="text-zinc-400 font-medium">Welcome, {currentUser?.name}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <StatCard title="My Delivered Revenue" value={`$${stats.revenue}`} icon={DollarSign} color="text-emerald-400" />
          <StatCard title="Assigned Orders" value={stats.count} icon={Package} color="text-blue-400" />
      </div>

      <Card className="p-6">
        <h3 className="text-xl font-bold text-white mb-4">My Tasks</h3>
        {myOrders.length === 0 ? (
          <p className="text-zinc-500">No orders assigned to you yet.</p>
        ) : (
          <OrdersTable orders={myOrders} isAdmin />
        )}
      </Card>
    </div>
  );
};

const UserDashboard = () => {
  const { currentUser, orders } = useStore();
  const myOrders = orders.filter(o => o.userId === currentUser?.id);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">My Orders</h1>
      {myOrders.length === 0 ? (
        <div className="text-center py-20 bg-dark-900 rounded-xl border border-dark-800 border-dashed">
          <Package className="mx-auto text-zinc-600 mb-4" size={48} />
          <h3 className="text-xl font-medium text-white">No orders yet</h3>
          <p className="text-zinc-500">Go find some delicious food!</p>
        </div>
      ) : (
        <OrdersTable orders={myOrders} />
      )}
    </div>
  );
};

// Reusable Orders Table
const OrdersTable = ({ orders, isAdmin = false, isOwner = false }: { orders: any[], isAdmin?: boolean, isOwner?: boolean }) => {
  const { updateOrderStatus, users, assignOrder } = useStore();
  const admins = users.filter(u => u.role === 'ADMIN');

  return (
    <Card className="overflow-hidden border border-dark-800">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-zinc-400">
          <thead className="bg-dark-900 text-zinc-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Items</th>
              <th className="px-6 py-4">Total</th>
              <th className="px-6 py-4">Status</th>
              {isOwner && <th className="px-6 py-4">Assigned To</th>}
              {isAdmin && <th className="px-6 py-4">Action</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-dark-800">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-dark-800/50 transition-colors">
                <td className="px-6 py-4 font-mono text-zinc-500">#{order.id.slice(-6)}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    {order.items.map((item: any, idx: number) => (
                      <span key={idx} className="text-white">
                        {item.quantity}x {item.name} <span className="text-xs text-zinc-500">({item.size})</span>
                        {item.note && <span className="block text-xs text-orange-400 italic">Note: {item.note}</span>}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-primary font-bold">${(order.finalAmount || order.totalAmount).toFixed(2)}</span>
                    {order.discountAmount > 0 && (
                      <span className="text-xs text-green-500 line-through">${order.totalAmount.toFixed(2)}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>
                
                {isOwner && (
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-2">
                       <User size={14} className="text-zinc-500" />
                       <select
                         className="bg-dark-900 border border-dark-700 rounded px-2 py-1 text-xs text-white focus:border-primary outline-none"
                         value={order.assignedAdminId || ''}
                         onChange={(e) => assignOrder(order.id, e.target.value)}
                       >
                         <option value="">Unassigned</option>
                         {admins.map(admin => (
                           <option key={admin.id} value={admin.id}>{admin.name}</option>
                         ))}
                       </select>
                     </div>
                  </td>
                )}

                {isAdmin && (
                  <td className="px-6 py-4">
                    <select 
                      className="bg-dark-900 border border-dark-700 rounded px-2 py-1 text-xs text-white focus:border-primary outline-none"
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    >
                      <option value="PENDING">Pending</option>
                      <option value="PREPARING">Preparing</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles: any = {
    PENDING: "bg-yellow-900/50 text-yellow-500 border-yellow-900/50",
    PREPARING: "bg-blue-900/50 text-blue-500 border-blue-900/50",
    DELIVERED: "bg-emerald-900/50 text-emerald-500 border-emerald-900/50",
    CANCELLED: "bg-red-900/50 text-red-500 border-red-900/50",
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[status] || styles.PENDING}`}>
      {status}
    </span>
  );
};