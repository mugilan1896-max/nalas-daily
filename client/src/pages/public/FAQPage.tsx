import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../constants/businessInfo';

export const FAQPage: React.FC = () => {
  const faqs = [
    {
      question: "How does the subscription work?",
      answer: "You can choose a daily, weekly, or monthly plan. Once subscribed, we deliver fresh, home-cooked meals to your doorstep at your preferred time slot."
    },
    {
      question: "Can I pause my subscription?",
      answer: "Yes! You can pause your subscription if you are traveling or unavailable. Just let us know a day in advance on WhatsApp."
    },
    {
      question: "Do you deliver to my area?",
      answer: `We currently serve ${BUSINESS_INFO.serviceArea}. Please contact us if you are unsure whether your exact location is covered.`
    },
    {
      question: "Are the meals vegetarian?",
      answer: "We offer both vegetarian and non-vegetarian plans. All meals are prepared in hygienic conditions following traditional recipes."
    }
  ];

  return (
    <>
      <SEOHead title={`FAQ | ${BUSINESS_INFO.name}`} description={`Frequently asked questions about ${BUSINESS_INFO.name} meal subscriptions.`} path="/faq" />
      <div className="px-margin-mobile md:px-margin-desktop py-xl mx-auto max-w-4xl min-h-[60vh]">
        <h1 className="font-display-lg text-display-lg text-primary mb-12 text-center">Frequently Asked Questions</h1>
        
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h3 className="font-headline-md text-primary mb-2">{faq.question}</h3>
              <p className="font-body-md text-on-surface-variant">{faq.answer}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="font-body-md text-on-surface-variant mb-4">Still have questions?</p>
          <a 
            href={`https://wa.me/${BUSINESS_INFO.whatsapp}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-accent text-white font-label-md font-bold py-3 px-8 rounded-full hover:bg-accent/90 transition-colors shadow-sm"
          >
            Ask us on WhatsApp
          </a>
        </div>
      </div>
    </>
  );
};
