import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './components/common/PublicLayout';

import { HomePage } from './pages/public/HomePage';
import { MenuCatalogPage } from './pages/public/MenuCatalogPage';
import { PlansInfoPage } from './pages/public/PlansInfoPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactLocationPage } from './pages/public/ContactLocationPage';
import { FAQPage } from './pages/public/FAQPage';
import { PrivacyPolicyPage } from './pages/public/PrivacyPolicyPage';
import { TermsConditionsPage } from './pages/public/TermsConditionsPage';

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
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
