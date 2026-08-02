import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC<{ onPausePlan?: () => void }> = ({ onPausePlan }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Plans', path: '/plans' },
    ...(isAuthenticated ? [{ name: 'Dashboard', path: '/dashboard' }] : []),
  ];

  return (
    <header className="bg-white/80 dark:bg-surface-container-lowest/80 backdrop-blur-md sticky top-0 w-full z-50 border-b border-outline-variant shadow-sm flex justify-between items-center px-margin-mobile lg:px-margin-desktop h-20">
      {/* Brand Logo */}
      <Link to="/" className="font-headline font-bold text-2xl text-primary flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl text-primary">restaurant_menu</span>
        <span className="tracking-tight">Nala's Daily</span>
      </Link>

      {/* Navigation Links */}
      <nav className="hidden lg:flex items-center space-x-6 font-label text-sm">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 rounded-md transition-all ${
                isActive
                  ? 'text-primary font-bold border-b-2 border-primary'
                  : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Action Buttons */}
      <div className="flex items-center space-x-4">
        {isAuthenticated && onPausePlan && (
          <button
            onClick={onPausePlan}
            className="hidden sm:flex items-center space-x-2 text-secondary border border-secondary hover:bg-secondary/10 transition-colors font-label text-sm px-4 py-2 rounded-full"
          >
            <span className="material-symbols-outlined text-base">pause_circle</span>
            <span>Pause Plan</span>
          </button>
        )}

        {isAuthenticated ? (
          <div className="flex items-center space-x-3">
            <Link to="/account" className="flex items-center space-x-2 p-1 rounded-full hover:bg-surface-container-low transition-colors">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm">
                {user?.fullName ? user.fullName.charAt(0) : 'N'}
              </div>
            </Link>
          </div>
        ) : (
          <Link
            to="/login"
            className="bg-accent hover:opacity-90 text-white font-label text-sm px-5 py-2.5 rounded-full shadow-ambient transition-all"
          >
            Sign In / Register
          </Link>
        )}
      </div>
    </header>
  );
};
