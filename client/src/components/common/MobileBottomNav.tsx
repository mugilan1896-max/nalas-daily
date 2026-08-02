import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: 'home' },
    { name: 'Menu', path: '/menu', icon: 'restaurant_menu' },
    { name: 'Planner', path: '/planner', icon: 'calendar_month' },
    { name: 'Orders', path: '/orders', icon: 'shopping_bag' },
    { name: 'Account', path: '/account', icon: 'person' },
  ];

  return (
    <nav className="bg-white/90 dark:bg-on-surface/90 backdrop-blur-xl shadow-[0px_-4px_20px_rgba(40,89,67,0.08)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-2 rounded-t-xl lg:hidden border-t border-outline-variant">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
              isActive
                ? 'bg-primary-container text-on-primary px-4 py-1'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className={`material-symbols-outlined text-xl ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
            <span className="font-label text-[11px] mt-0.5">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};
