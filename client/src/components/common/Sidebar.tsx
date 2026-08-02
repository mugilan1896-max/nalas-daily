import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC<{ onRenewClick?: () => void }> = ({ onRenewClick }) => {
  const { user, profile } = useAuth();
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: 'dashboard' },
    { name: 'Subscription', path: '/subscriptions', icon: 'calendar_today' },
    { name: 'Weekly Planner', path: '/planner', icon: 'event_note' },
    { name: 'Orders', path: '/orders', icon: 'receipt_long' },
    { name: 'Account & Profile', path: '/account', icon: 'person' },
  ];

  if (user?.role === 'admin') {
    navItems.push(
      { name: 'Admin Dashboard', path: '/admin', icon: 'admin_panel_settings' },
      { name: 'Manage Meals', path: '/admin/meals', icon: 'restaurant' },
      { name: 'Manage Orders', path: '/admin/orders', icon: 'local_shipping' }
    );
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-background border-r border-outline-variant fixed h-full left-0 top-0 p-4 z-40">
      {/* Brand Header */}
      <div className="mb-6 px-2 pt-2 flex items-center gap-3">
        <span className="material-symbols-outlined text-3xl text-primary">restaurant_menu</span>
        <h1 className="font-display font-bold text-xl text-primary">Nala's Daily</h1>
      </div>

      {/* User Welcome Card */}
      <div className="flex items-center gap-3 px-3 py-3 mb-6 bg-surface-container-low rounded-xl border border-outline-variant/50">
        <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center font-bold text-base">
          {profile?.petName ? profile.petName.charAt(0) : user?.fullName ? user.fullName.charAt(0) : 'N'}
        </div>
        <div className="overflow-hidden">
          <p className="font-label text-sm font-semibold text-on-surface truncate">
            {profile?.petName ? profile.petName : user?.fullName || 'Foodie'}
          </p>
          <p className="font-label text-xs text-on-surface-variant">
            {user?.credits || 0} Credits Available
          </p>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-col gap-1 flex-grow">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-label text-sm transition-colors ${
                isActive
                  ? 'bg-primary-container/15 text-primary font-bold border-r-4 border-primary'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>{item.icon}</span>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Renew Plan CTA Button at bottom */}
      <div className="mt-auto pt-4">
        <button
          onClick={onRenewClick}
          className="w-full bg-accent hover:opacity-90 text-white font-label text-sm py-3 px-4 rounded-full transition-all shadow-ambient font-bold flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">autorenew</span>
          <span>Renew Plan</span>
        </button>
      </div>
    </aside>
  );
};
