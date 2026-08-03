import React from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/common/SEOHead';

export const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead title="Page Not Found | Nala's Daily" description="The page you are looking for does not exist." path="/404" />
      <div className="py-24 px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h1 className="font-headline-lg text-primary mb-4 text-6xl font-bold">404</h1>
        <h2 className="font-headline-md text-on-surface mb-6 text-2xl">Oops! Page not found.</h2>
        <p className="font-body-md text-on-surface-variant max-w-md mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link 
          to="/" 
          className="bg-primary text-white font-label-md px-8 py-3 rounded-full hover:bg-opacity-90 transition-all shadow-sm"
        >
          Return to Home
        </Link>
      </div>
    </>
  );
};
