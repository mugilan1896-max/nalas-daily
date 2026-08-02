import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../constants/businessInfo';

export const TermsConditionsPage: React.FC = () => {
  return (
    <>
      <SEOHead title={`Terms & Conditions | ${BUSINESS_INFO.name}`} description={`Terms and Conditions for ${BUSINESS_INFO.name}.`} path="/terms" />
      <div className="px-margin-mobile md:px-margin-desktop py-xl mx-auto max-w-4xl">
        <h1 className="font-display-lg text-display-lg text-primary mb-8 text-center">Terms & Conditions</h1>
        
        <div className="space-y-6 font-body-md text-on-surface-variant leading-relaxed">
          <p>Last updated: {new Date().toLocaleDateString()}</p>
          
          <h2 className="font-headline-md text-primary mt-6">1. Agreement to Terms</h2>
          <p>By accessing our website and using our services, you agree to be bound by these Terms and Conditions.</p>

          <h2 className="font-headline-md text-primary mt-6">2. Subscriptions & Payments</h2>
          <p>All subscription plans are prepaid. Cancellations or pauses to your subscription must be communicated at least 24 hours in advance.</p>

          <h2 className="font-headline-md text-primary mt-6">3. Delivery</h2>
          <p>We strive to deliver meals within the agreed time slots. However, delivery times may occasionally be affected by weather, traffic, or other unforeseen circumstances.</p>

          <h2 className="font-headline-md text-primary mt-6">4. Modifications</h2>
          <p>We reserve the right to modify these terms or our services at any time. Significant changes will be communicated to active subscribers.</p>

          <h2 className="font-headline-md text-primary mt-6">5. Contact Us</h2>
          <p>For any questions regarding these terms, please reach out to {BUSINESS_INFO.email}.</p>
        </div>
      </div>
    </>
  );
};
