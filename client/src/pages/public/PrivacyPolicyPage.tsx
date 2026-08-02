import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../constants/businessInfo';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <>
      <SEOHead title={`Privacy Policy | ${BUSINESS_INFO.name}`} description={`Privacy Policy for ${BUSINESS_INFO.name}.`} path="/privacy" />
      <div className="px-margin-mobile md:px-margin-desktop py-xl mx-auto max-w-4xl">
        <h1 className="font-display-lg text-display-lg text-primary mb-8 text-center">Privacy Policy</h1>
        
        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-headline-md text-primary mt-6">1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, such as when you create an account, subscribe to our meal plans, or contact us for support. This may include your name, email address, phone number, and delivery address.</p>

          <h2 className="font-headline-md text-primary mt-6">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to process your orders, and to communicate with you regarding your subscription and deliveries.</p>

          <h2 className="font-headline-md text-primary mt-6">3. Information Sharing</h2>
          <p>We do not share your personal information with third parties except as necessary to provide our services (e.g., delivery partners) or when required by law.</p>

          <h2 className="font-headline-md text-primary mt-6">4. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at {BUSINESS_INFO.email}.</p>
        </div>
      </div>
    </>
  );
};
