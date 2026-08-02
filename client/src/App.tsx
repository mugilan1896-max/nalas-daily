import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppLayout } from './components/common/AppLayout';
import { PublicLayout } from './components/common/PublicLayout';

import { HomePage } from './pages/public/HomePage';
import { MenuCatalogPage } from './pages/public/MenuCatalogPage';
import { PlansInfoPage } from './pages/public/PlansInfoPage';
import { LoginPage } from './pages/public/LoginPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactLocationPage } from './pages/public/ContactLocationPage';
import { FAQPage } from './pages/public/FAQPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/public/TermsConditionsPage';

import { ProfileSetupPage } from './pages/onboarding/ProfileSetupPage';
import { AddressSetupPage } from './pages/onboarding/AddressSetupPage';

import { DashboardPage } from './pages/user/DashboardPage';
import { WeeklyPlannerPage } from './pages/user/WeeklyPlannerPage';
import { SubscriptionPage } from './pages/user/SubscriptionPage';
import { OrdersHistoryPage } from './pages/user/OrdersHistoryPage';
import { AccountPage } from './pages/user/AccountPage';

import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminMealsPage } from './pages/admin/AdminMealsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';

// Protected Route Wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 text-center font-label">Loading Nala's Daily...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// Admin Route Wrapper
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="p-8 text-center font-label">Loading Nala's Daily...</div>;
  if (!isAuthenticated || user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout><HomePage /></PublicLayout>} path="/" />
      <Route element={<PublicLayout><MenuCatalogPage /></PublicLayout>} path="/menu" />
      <Route element={<PublicLayout><PlansInfoPage /></PublicLayout>} path="/plans" />
      <Route element={<PublicLayout><AboutPage /></PublicLayout>} path="/about" />
      <Route element={<PublicLayout><ContactLocationPage /></PublicLayout>} path="/contact" />
      <Route element={<PublicLayout><FAQPage /></PublicLayout>} path="/faq" />
      <Route element={<PublicLayout><PrivacyPolicyPage /></PublicLayout>} path="/privacy" />
      <Route element={<PublicLayout><TermsConditionsPage /></PublicLayout>} path="/terms" />
      <Route element={<PublicLayout><LoginPage /></PublicLayout>} path="/login" />

      {/* Onboarding Flow */}
      <Route element={<ProtectedRoute><ProfileSetupPage /></ProtectedRoute>} path="/onboarding/profile" />
      <Route element={<ProtectedRoute><AddressSetupPage /></ProtectedRoute>} path="/onboarding/address" />

      {/* User App Dashboard & Features */}
      <Route element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} path="/dashboard" />
      <Route element={<ProtectedRoute><AppLayout><WeeklyPlannerPage /></AppLayout></ProtectedRoute>} path="/planner" />
      <Route element={<ProtectedRoute><AppLayout><SubscriptionPage /></AppLayout></ProtectedRoute>} path="/subscriptions" />
      <Route element={<ProtectedRoute><AppLayout><OrdersHistoryPage /></AppLayout></ProtectedRoute>} path="/orders" />
      <Route element={<ProtectedRoute><AppLayout><AccountPage /></AppLayout></ProtectedRoute>} path="/account" />

      {/* Admin Panel */}
      <Route element={<AdminRoute><AppLayout><AdminDashboardPage /></AppLayout></AdminRoute>} path="/admin" />
      <Route element={<AdminRoute><AppLayout><AdminMealsPage /></AppLayout></AdminRoute>} path="/admin/meals" />
      <Route element={<AdminRoute><AppLayout><AdminOrdersPage /></AppLayout></AdminRoute>} path="/admin/orders" />

      {/* Catch-all fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
