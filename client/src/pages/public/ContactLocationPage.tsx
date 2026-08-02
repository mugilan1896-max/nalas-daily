import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO, WHATSAPP_MESSAGES } from '../../constants/businessInfo';

export const ContactLocationPage: React.FC = () => {
  return (
    <>
      <SEOHead title={`Contact & Location | ${BUSINESS_INFO.name}`} description={`Find ${BUSINESS_INFO.name} contact details, location, phone number and email.`} path="/contact" />
      <div className="px-margin-mobile md:px-margin-desktop py-xl mx-auto max-w-6xl">
        <h1 className="font-display-lg text-display-lg text-primary mb-12 text-center">Contact & Location</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Details */}
          <div className="space-y-8 bg-surface-container-low p-8 rounded-3xl border border-outline-variant">
            <div>
              <h2 className="font-headline-md text-primary mb-2">Get in Touch</h2>
              <p className="font-body-md text-on-surface-variant mb-6">We'd love to hear from you. Reach out to us for any queries or custom plans.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">badge</span>
                <div>
                  <h3 className="font-label-md font-bold text-on-surface">Owners</h3>
                  <p className="font-body-md text-on-surface-variant font-medium">{BUSINESS_INFO.owners}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">location_on</span>
                <div>
                  <h3 className="font-label-md font-bold text-on-surface">Address</h3>
                  <p className="font-body-md text-on-surface-variant whitespace-pre-line">{BUSINESS_INFO.address}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-primary text-3xl">call</span>
                <div>
                  <h3 className="font-label-md font-bold text-on-surface">Phone Numbers</h3>
                  <div className="flex flex-col gap-2 mt-1">
                    {BUSINESS_INFO.phoneNumbers.map((num, idx) => {
                      const isWhatsApp = idx === 0 || idx === 1;
                      const rawNum = num.replace(/\s/g, '').replace('+', '');
                      return (
                        <div key={idx} className="flex items-center gap-3 flex-wrap">
                          <a 
                            href={`tel:+${rawNum}`} 
                            className="font-body-md text-on-surface-variant hover:text-primary transition-colors font-medium"
                          >
                            {num}
                          </a>
                          {isWhatsApp && (
                            <a
                              href={`https://wa.me/${rawNum}?text=${encodeURIComponent(WHATSAPP_MESSAGES.generalEnquiry)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white transition-all px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1"
                            >
                              <span className="material-symbols-outlined text-[14px]">chat</span>
                              WhatsApp
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 flex flex-wrap gap-4">
              <a 
                href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(WHATSAPP_MESSAGES.generalEnquiry)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-[#25D366] text-white font-label-md font-bold py-3 px-6 rounded-full hover:bg-opacity-90 transition-all shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined">chat</span>
                WhatsApp Us
              </a>
              <a 
                href={`tel:${BUSINESS_INFO.phone.replace(/\s/g, '')}`}
                className="bg-primary text-white font-label-md font-bold py-3 px-6 rounded-full hover:bg-primary/90 transition-all shadow-sm flex items-center gap-2"
              >
                <span className="material-symbols-outlined">call</span>
                Call Now
              </a>
            </div>
          </div>

          {/* Map */}
          <div className="h-[400px] md:h-auto w-full min-h-[400px] rounded-3xl overflow-hidden shadow-ambient border border-outline-variant relative">
            <iframe 
              src={BUSINESS_INFO.mapsEmbedUrl} 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              title={`${BUSINESS_INFO.name} Location`}
            ></iframe>
            
            <a 
              href={BUSINESS_INFO.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-primary font-label-md font-bold py-3 px-6 rounded-full shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
            >
              <span className="material-symbols-outlined">map</span>
              Open in Google Maps
            </a>
          </div>
        </div>
      </div>
    </>
  );
};
