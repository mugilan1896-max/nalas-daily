import React from 'react';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../constants/businessInfo';

export const AboutPage: React.FC = () => {
  return (
    <>
      <SEOHead title={`About Us | ${BUSINESS_INFO.name}`} description="Learn about our story, our kitchen, and our commitment to providing homely, hygienic meals." path="/about" />
      <div className="px-margin-mobile md:px-margin-desktop py-xl mx-auto max-w-4xl">
        <h1 className="font-display-lg text-display-lg text-primary mb-8 text-center">About {BUSINESS_INFO.name}</h1>
        
        <div className="space-y-6 font-body-lg text-on-surface-variant leading-relaxed">
          <p>
            Welcome to {BUSINESS_INFO.name}, where traditional home-cooked flavors meet modern convenience. We started with a simple mission: to provide wholesome, hygienic, and affordable daily meals to those who miss the comfort of home food.
          </p>
          
          <h2 className="font-headline-md text-primary mt-8">Our Kitchen</h2>
          <p>
            Our meals are prepared in pristine, sanitized kitchens by experienced cooks who understand the nuances of authentic regional cuisine. We use only fresh, locally sourced ingredients and avoid artificial preservatives or colors. Every meal is a testament to our commitment to your health and satisfaction.
          </p>

          <h2 className="font-headline-md text-primary mt-8">Our Promise</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>100% Hygienic:</strong> Strict cleanliness protocols in our kitchens.</li>
            <li><strong>Nutritious & Balanced:</strong> Meals designed to give you the right energy for your day.</li>
            <li><strong>Affordable:</strong> Premium quality food at prices that make daily subscription easy.</li>
            <li><strong>Reliable Delivery:</strong> Timely delivery so you never have to wait for your meal.</li>
          </ul>

          <p className="pt-6">
            Join the {BUSINESS_INFO.name} family today and experience the joy of a good, home-cooked meal without the hassle of cooking!
          </p>
        </div>
      </div>
    </>
  );
};
