import React from 'react';
import { BUSINESS_INFO, WHATSAPP_MESSAGES } from '../../constants/businessInfo';
import { SEOHead } from '../../components/common/SEOHead';

export const LoginPage: React.FC = () => {
  return (
    <>
      <SEOHead title={`Order & Contact | ${BUSINESS_INFO.name}`} description="Place your order directly via WhatsApp" path="/login" />
      <div className="py-16 px-margin-mobile md:px-margin-desktop flex items-center justify-center min-h-[60vh]">
        <div className="bg-surface-container-low p-8 md:p-12 rounded-3xl border border-outline-variant max-w-lg w-full text-center shadow-lg space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#25D366]/10 text-[#25D366] mx-auto">
            <span className="material-symbols-outlined text-4xl">chat</span>
          </div>
          <div>
            <h1 className="font-headline-lg text-primary mb-3">Direct WhatsApp Ordering</h1>
            <p className="font-body-md text-on-surface-variant">
              At {BUSINESS_INFO.name}, all custom meal subscriptions and daily orders are personally coordinated via WhatsApp to ensure maximum freshness and home-cooked hygiene.
            </p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-outline-variant/60 text-left space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-primary">Owners & Orders</div>
            <div className="flex justify-between items-center py-1">
              <div>
                <p className="font-bold text-on-surface text-sm">Mahalakshmi & Devi Sri</p>
                <p className="text-xs text-on-surface-variant">Primary WhatsApp Order Desk</p>
              </div>
              <a 
                href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.generalEnquiry)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs bg-[#25D366] text-white px-3 py-1.5 rounded-full font-bold hover:bg-opacity-90 transition-all flex items-center gap-1 shadow-xs"
              >
                Chat Now
              </a>
            </div>
          </div>

          <a 
            href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.generalEnquiry)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full inline-flex justify-center items-center gap-2 bg-[#25D366] text-white font-label-md py-4 rounded-full font-bold shadow-md hover:shadow-lg transition-all hover:bg-opacity-90 text-base"
          >
            <span className="material-symbols-outlined">chat</span>
            Order / Inquire on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};
