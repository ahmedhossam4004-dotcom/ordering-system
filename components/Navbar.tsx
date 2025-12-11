import React from 'react';
import { ShoppingBag, User as UserIcon, LogOut, LayoutDashboard } from 'lucide-react';
import { useStore } from '../store';

interface NavbarProps {
  onOpenCart: () => void;
  currentView: string;
  onChangeView: (view: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCart, currentView, onChangeView }) => {
  const { currentUser, cart, logout } = useStore();

  return (
    <nav className="sticky top-0 z-40 w-full bg-dark-900/80 backdrop-blur-md border-b border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => onChangeView('HOME')}
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-white hidden sm:block">
              Ordering<span className="text-primary">Sys</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {currentUser && (
              <>
                <button 
                  onClick={() => onChangeView('DASHBOARD')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${currentView === 'DASHBOARD' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  <LayoutDashboard size={18} />
                  <span className="text-sm font-medium hidden sm:block">Dashboard</span>
                </button>

                {currentUser.role === 'USER' && (
                   <button 
                   onClick={onOpenCart}
                   className="relative p-2 text-zinc-400 hover:text-primary transition-colors"
                 >
                   <ShoppingBag size={20} />
                   {cart.length > 0 && (
                     <span className="absolute top-0 right-0 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                       {cart.length}
                     </span>
                   )}
                 </button>
                )}
               
                <div className="h-6 w-px bg-zinc-800 mx-1"></div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-zinc-500 uppercase">{currentUser.role}</p>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </>
            )}
            
            {!currentUser && (
              <span className="text-zinc-500 text-sm">Please Log In</span>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
