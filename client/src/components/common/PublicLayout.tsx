import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BUSINESS_INFO, WHATSAPP_MESSAGES } from '../../constants/businessInfo';

export const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/menu', label: 'Menu' },
    { path: '/plans', label: 'Plans' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
    { path: '/faq', label: 'FAQ' },
  ];

  return (
    <div className="bg-background text-on-background font-body-md antialiased overflow-x-hidden min-h-screen flex flex-col">
      {/* TopNavBar */}
      <nav className="sticky top-0 w-full z-50 bg-white/80 dark:bg-on-surface/80 backdrop-blur-md shadow-sm border-b border-outline-variant dark:border-outline">
        <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 w-full mx-auto max-w-[1440px] py-2">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed hover:opacity-80 transition-opacity">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsKKJXavIiW0iIeUSj2tID8RCEtbR2YAU4LK9DNvknI87b-Ck7jM4JBf50WF8CbpDI4I4MRBY9SK4GBef1ZJ3AI9dX-lXpjAEBheKYkcbTuWCruKJLKynoYnGWIcIbtKSR_4yKG-Jwy_pQUFS_jBtJT4E_EhxwQjmfV2iObfNehC_2vGZZTpB6dTIoWriORhE1vJtT7icNPk9DkkYe79k0xLrKOGW8yu46360Qm8Yo2TJDR8o84Vx0DVidslFNyCnrPA" alt="Nala's Daily Logo" className="h-12 w-auto object-contain" />
            <span className="font-headline-md">Nala's Daily</span>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex space-x-lg font-label-md text-label-md">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link 
                  key={link.path}
                  to={link.path} 
                  className={`relative py-1 transition-colors ${
                    isActive 
                      ? 'text-primary font-bold' 
                      : 'text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-1.5 left-0 w-full h-[3px] bg-accent rounded-full animate-[slideIn_0.2s_ease-out]"></span>
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-md">
            <Link to="/plans" className="hidden md:block font-label-md text-label-md text-primary font-semibold hover:text-primary/80 transition-colors">
              Plans & Pricing
            </Link>
            <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.generalEnquiry)}`} target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white font-label-md text-label-md font-bold py-[12px] px-[24px] rounded-full hover:bg-opacity-90 transition-colors shadow-sm inline-flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">chat</span>
              WhatsApp
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content Canvas */}
      <main className="flex-grow flex flex-col w-full mx-auto max-w-[1440px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary dark:bg-on-primary-fixed text-on-primary w-full py-xl mt-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-lg px-margin-mobile md:px-margin-desktop mx-auto max-w-[1440px]">
          {/* Brand Column */}
          <div className="flex flex-col">
            <div className="font-headline-lg text-headline-lg text-on-primary mb-4 font-bold tracking-tight">Nala's Daily</div>
            <p className="font-body-md text-body-md text-on-primary/80 mb-6 max-w-xs">
              Delivering affordable, hygienic, and reliable home-cooked meals straight to your door.
            </p>
            <div className="text-on-primary/60 font-body-sm text-sm">
              © 2024 Nala's Daily. Home-Grown Premium Nutrition.
            </div>
          </div>
          {/* Links Column 1 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-label-md text-label-md font-bold text-secondary-fixed">Brand Story</h4>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/about">About Us</Link>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/about">Hygiene Promise</Link>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/about">Sourcing</Link>
          </div>
          {/* Links Column 2 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-label-md text-label-md font-bold text-secondary-fixed">Quick Links</h4>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/menu">Menu & Pricing</Link>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/plans">Subscription Plans</Link>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/faq">FAQs</Link>
          </div>
          {/* Links Column 3 */}
          <div className="flex flex-col gap-4">
            <h4 className="font-label-md text-label-md font-bold text-secondary-fixed">Support & Legal</h4>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/contact">Contact Us</Link>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/privacy">Privacy Policy</Link>
            <Link className="font-body-md text-body-md text-on-primary/80 hover:text-on-primary hover:underline decoration-secondary-fixed transition-all" to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
