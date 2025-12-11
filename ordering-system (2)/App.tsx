import React, { useState } from 'react';
import { StoreProvider, useStore } from './store';
import { Navbar } from './components/Navbar';
import { Modal, Button, Input, Card } from './components/UI';
import { Dashboards } from './pages/Dashboards';
import { MenuItem, Size } from './types';
import { ShoppingCart, Star, Clock, Truck, Plus, Minus, Trash2, ShoppingBag, Tag, AlertCircle, UserCheck } from 'lucide-react';

const AppContent = () => {
  const { 
    currentUser, 
    restaurants, 
    menuItems,
    users,
    login, 
    signup, 
    cart, 
    addToCart, 
    removeFromCart, 
    placeOrder,
    clearCart,
    validatePromoCode
  } = useStore();

  // Navigation State
  const [currentView, setCurrentView] = useState('HOME'); // HOME, RESTAURANT, DASHBOARD
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);

  // UI State
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Form States
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [itemOptions, setItemOptions] = useState<{ size: Size, note: string }>({ size: 'M', note: '' });
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<string>('');

  // Handlers
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    if (authMode === 'LOGIN') {
      const result = login(authForm.email, authForm.password);
      if (result.success) {
        setIsAuthOpen(false);
        setAuthForm({ name: '', email: '', password: '', phone: '' });
      } else {
        setAuthError(result.error || "Login failed");
      }
    } else {
      signup(authForm.name, authForm.email, authForm.password, authForm.phone);
      setIsAuthOpen(false);
    }
  };
  
  const handleRestaurantClick = (id: string) => {
    if (!currentUser) {
      setIsAuthOpen(true);
      return;
    }
    setSelectedRestaurantId(id);
    setCurrentView('RESTAURANT');
  };

  const openItemModal = (item: MenuItem) => {
    setSelectedItem(item);
    setItemOptions({ size: 'M', note: '' });
  };

  const handleAddToCart = () => {
    if (selectedItem) {
      addToCart(selectedItem, itemOptions.size, itemOptions.note);
      setSelectedItem(null);
    }
  };
  
  const handlePlaceOrder = () => {
      if (!selectedAdminId) {
        alert("Please select a delivery agent!");
        return;
      }
      placeOrder(selectedAdminId, appliedDiscount ? promoCode : undefined);
      setIsCartOpen(false);
      setPromoCode('');
      setAppliedDiscount(null);
      setSelectedAdminId('');
      alert("Order Placed Successfully!");
      setCurrentView('DASHBOARD');
  };

  const handleApplyPromo = () => {
    if (!promoCode) return;
    const discount = validatePromoCode(promoCode.toUpperCase());
    if (discount) {
      setAppliedDiscount(discount);
    } else {
      alert("Invalid Code");
      setAppliedDiscount(null);
    }
  };

  // --- Views ---

  const renderHome = () => (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-4xl font-extrabold text-white mb-2">Craving something?</h1>
        <p className="text-zinc-400 text-lg">Order from the best restaurants in town.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {restaurants.map(r => (
          <div 
            key={r.id} 
            onClick={() => handleRestaurantClick(r.id)}
            className="group cursor-pointer bg-dark-900 rounded-2xl overflow-hidden border border-dark-800 hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/10 hover:-translate-y-1"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={r.image} alt={r.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute top-4 right-4 bg-dark-950/90 backdrop-blur px-2 py-1 rounded-lg border border-dark-800 flex items-center gap-1">
                <Star size={14} className="text-yellow-500 fill-yellow-500" />
                <span className="text-white text-xs font-bold">{r.rating}</span>
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-primary transition-colors">{r.name}</h3>
              <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{r.description}</p>
              <div className="flex items-center justify-between text-xs font-medium text-zinc-400">
                <div className="flex items-center gap-1">
                  <Truck size={14} />
                  <span>${r.deliveryFee} Delivery</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  <span>20-30 min</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRestaurant = () => {
    const restaurant = restaurants.find(r => r.id === selectedRestaurantId);
    if (!restaurant) return null;

    const items = menuItems.filter(m => m.restaurantId === restaurant.id && m.available);

    return (
      <div className="animate-in slide-in-from-bottom-4 duration-300">
        {/* Hero */}
        <div className="relative h-64 w-full">
           <img src={restaurant.image} className="w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent"></div>
           <div className="absolute bottom-0 left-0 p-8 max-w-7xl w-full mx-auto">
              <h1 className="text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-4 text-zinc-300">
                <span>⭐ {restaurant.rating}</span>
                <span>•</span>
                <span>${restaurant.deliveryFee} Delivery</span>
              </div>
           </div>
        </div>

        {/* Menu */}
        <div className="max-w-7xl mx-auto px-4 py-8">
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
             {items.map(item => (
               <div key={item.id} onClick={() => openItemModal(item)} className="cursor-pointer bg-dark-900 p-4 rounded-xl border border-dark-800 hover:border-dark-700 flex justify-between items-center transition-all">
                  <div>
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                    <p className="text-zinc-400 text-sm mt-1">{item.description}</p>
                    <p className="text-primary font-bold mt-2">${item.price}</p>
                  </div>
                  <div className="bg-dark-800 p-2 rounded-full text-white">
                    <Plus size={20} />
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    );
  };

  // --- Cart Drawer ---
  const CartDrawer = () => {
    if (!isCartOpen) return null;
    const currentRest = cart.length > 0 ? restaurants.find(r => r.id === cart[0].restaurantId) : null;
    const subtotal = cart.reduce((acc, item) => acc + item.price, 0);
    const delivery = currentRest?.deliveryFee || 0;
    let total = subtotal + delivery;
    let discountAmt = 0;

    if (appliedDiscount) {
      discountAmt = (total * appliedDiscount) / 100;
      total = total - discountAmt;
    }

    const availableAdmins = users.filter(u => u.role === 'ADMIN');

    return (
      <div className="fixed inset-0 z-50 flex justify-end">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
        <div className="relative w-full max-w-md bg-dark-950 h-full shadow-2xl border-l border-dark-800 flex flex-col animate-in slide-in-from-right duration-300">
          <div className="p-4 border-b border-dark-800 flex justify-between items-center bg-dark-900">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShoppingCart size={20} className="text-primary" /> Your Cart
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-zinc-400 hover:text-white"><Plus size={24} className="rotate-45" /></button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-zinc-500">
                <ShoppingBag size={48} className="mb-4 opacity-50" />
                <p>Your cart is empty.</p>
              </div>
            ) : (
              cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start bg-dark-900 p-3 rounded-lg border border-dark-800">
                  <div>
                    <div className="text-white font-medium">
                      {item.quantity}x {item.name} <span className="text-zinc-500 text-xs bg-dark-950 px-1 rounded border border-dark-700">{item.size}</span>
                    </div>
                    {item.note && <div className="text-xs text-zinc-500 italic mt-1">"{item.note}"</div>}
                    <div className="text-primary text-sm font-bold mt-1">${item.price.toFixed(2)}</div>
                  </div>
                  <button onClick={() => removeFromCart(idx)} className="text-zinc-600 hover:text-red-500 transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-dark-900 border-t border-dark-800 space-y-4">
               {/* Admin Selection */}
               <div className="mb-4">
                 <label className="block text-sm font-medium text-zinc-400 mb-2 flex items-center gap-2">
                   <UserCheck size={16} /> Select Delivery Agent
                 </label>
                 <select
                    className="w-full bg-dark-950 border border-dark-700 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                    value={selectedAdminId}
                    onChange={(e) => setSelectedAdminId(e.target.value)}
                 >
                   <option value="">-- Choose Agent --</option>
                   {availableAdmins.map(admin => (
                     <option key={admin.id} value={admin.id}>{admin.name}</option>
                   ))}
                 </select>
               </div>

               {/* Promo Input */}
               <div className="flex gap-2 mb-4">
                 <input 
                   className="flex-1 bg-dark-950 border border-dark-700 rounded-lg px-3 py-2 text-sm text-white focus:border-primary outline-none" 
                   placeholder="Promo Code" 
                   value={promoCode}
                   onChange={e => setPromoCode(e.target.value.toUpperCase())}
                 />
                 <button onClick={handleApplyPromo} className="bg-dark-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-dark-700">Apply</button>
               </div>
               
               {appliedDiscount && (
                 <div className="flex items-center gap-2 text-green-500 text-sm bg-green-900/20 p-2 rounded border border-green-900">
                   <Tag size={14} />
                   <span>Code Applied! {appliedDiscount}% Off</span>
                 </div>
               )}

               <div className="space-y-2 text-sm">
                 <div className="flex justify-between text-zinc-400"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                 <div className="flex justify-between text-zinc-400"><span>Delivery Fee</span><span>${delivery}</span></div>
                 {discountAmt > 0 && (
                   <div className="flex justify-between text-green-500"><span>Discount</span><span>-${discountAmt.toFixed(2)}</span></div>
                 )}
                 <div className="flex justify-between text-white font-bold text-lg pt-2 border-t border-dark-700"><span>Total</span><span>${total.toFixed(2)}</span></div>
               </div>
               <Button onClick={handlePlaceOrder} fullWidth className="py-4 text-lg" disabled={!selectedAdminId}>
                 {selectedAdminId ? 'Checkout' : 'Select Agent to Checkout'}
               </Button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // --- Auth Modal Content ---
  const authContent = (
    <form onSubmit={handleAuth} className="space-y-4 mt-2">
      {authError && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          {authError}
        </div>
      )}

      {authMode === 'SIGNUP' && (
        <>
          <Input 
            label="Full Name" 
            value={authForm.name} 
            onChange={e => setAuthForm({...authForm, name: e.target.value})} 
            required 
          />
          <Input 
            label="Mobile Number" 
            value={authForm.phone} 
            onChange={e => setAuthForm({...authForm, phone: e.target.value})} 
            placeholder="e.g. +1 234 567 890"
            required 
          />
        </>
      )}
      <Input 
        label="Email Address" 
        type="email" 
        value={authForm.email} 
        onChange={e => setAuthForm({...authForm, email: e.target.value})} 
        required 
      />
      <Input 
        label="Password" 
        type="password" 
        value={authForm.password} 
        onChange={e => setAuthForm({...authForm, password: e.target.value})} 
        required 
      />
      
      <Button type="submit" fullWidth className="mt-4">
        {authMode === 'LOGIN' ? 'Log In' : 'Sign Up'}
      </Button>

      <div className="text-center text-sm text-zinc-500 mt-4">
        {authMode === 'LOGIN' ? "Don't have an account? " : "Already have an account? "}
        <span 
          onClick={() => { setAuthMode(authMode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); setAuthError(null); }} 
          className="text-primary cursor-pointer hover:underline"
        >
          {authMode === 'LOGIN' ? 'Sign Up' : 'Log In'}
        </span>
      </div>
    </form>
  );

  // --- Item Selection Modal ---
  const itemModalContent = selectedItem && (
    <div className="space-y-6">
       <div>
         <p className="text-zinc-400">{selectedItem.description}</p>
         <h2 className="text-2xl font-bold text-primary mt-2">${selectedItem.price}</h2>
       </div>

       <div>
         <label className="block text-sm font-medium text-white mb-2">Select Size</label>
         <div className="flex gap-2">
           {(['S', 'M', 'L'] as Size[]).map(s => (
             <button
                key={s}
                onClick={() => setItemOptions({...itemOptions, size: s})}
                className={`flex-1 py-2 rounded-lg border text-sm font-bold transition-all ${
                  itemOptions.size === s 
                  ? 'bg-primary text-white border-primary' 
                  : 'bg-dark-800 text-zinc-400 border-dark-800 hover:border-zinc-500'
                }`}
             >
               {s}
             </button>
           ))}
         </div>
       </div>

       <div>
          <label className="block text-sm font-medium text-white mb-2">Special Instructions</label>
          <textarea 
            className="w-full bg-dark-800 border border-dark-700 rounded-lg p-3 text-white focus:outline-none focus:border-primary resize-none h-24"
            placeholder="No onions, extra sauce..."
            value={itemOptions.note}
            onChange={(e) => setItemOptions({...itemOptions, note: e.target.value})}
          />
       </div>

       <Button onClick={handleAddToCart} fullWidth>Add to Cart - ${(selectedItem.price * (itemOptions.size === 'M' ? 1.2 : itemOptions.size === 'L' ? 1.5 : 1)).toFixed(2)}</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-950 pb-20">
      <Navbar 
        onOpenCart={() => setIsCartOpen(true)} 
        currentView={currentView}
        onChangeView={setCurrentView}
      />
      
      <main>
        {currentView === 'HOME' && renderHome()}
        {currentView === 'RESTAURANT' && renderRestaurant()}
        {currentView === 'DASHBOARD' && <Dashboards />}
      </main>

      {/* Modals & Drawers */}
      <CartDrawer />
      
      <Modal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
        title={authMode === 'LOGIN' ? 'Welcome Back' : 'Create Account'}
      >
        {authContent}
      </Modal>

      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name || ''}
      >
        {itemModalContent}
      </Modal>

      {/* Floating Cart Button (New) */}
      {currentUser && currentUser.role === 'USER' && cart.length > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          className="fixed bottom-6 right-6 bg-primary hover:bg-blue-600 text-white p-4 rounded-full shadow-lg shadow-blue-900/40 animate-in zoom-in duration-300 z-40 flex items-center justify-center gap-2"
        >
          <div className="relative">
            <ShoppingCart size={24} />
            <span className="absolute -top-2 -right-2 bg-white text-primary text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
              {cart.length}
            </span>
          </div>
          <span className="font-bold pr-1">Cart</span>
        </button>
      )}

      {/* Login Prompt when trying to access locked features */}
      {!currentUser && !isAuthOpen && (
        <div className="fixed bottom-0 left-0 w-full bg-primary p-2 text-center text-white font-medium text-sm z-30 cursor-pointer hover:bg-blue-600 transition-colors" onClick={() => setIsAuthOpen(true)}>
          Log in to start ordering food!
        </div>
      )}
    </div>
  );
};

const App = () => (
  <StoreProvider>
    <AppContent />
  </StoreProvider>
);

export default App;
