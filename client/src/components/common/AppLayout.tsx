import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { MobileBottomNav } from './MobileBottomNav';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handlePausePlan = async () => {
    try {
      await API.post('/subscriptions/pause');
      setToastMessage('Your subscription has been paused.');
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to pause subscription');
    }
  };

  const handleRenewClick = () => {
    navigate('/plans');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-white font-label text-sm px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <span className="material-symbols-outlined">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Desktop Sidebar */}
      <Sidebar onRenewClick={handleRenewClick} />

      {/* Top Bar for Desktop and Mobile Header */}
      <div className="lg:ml-64 flex-grow flex flex-col">
        <Navbar onPausePlan={handlePausePlan} />

        {/* Main Content Area */}
        <main className="flex-grow px-4 lg:px-8 py-6 max-w-[1440px] w-full mx-auto pb-24 lg:pb-12">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};
