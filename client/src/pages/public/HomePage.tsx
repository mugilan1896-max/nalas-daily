import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/common/SEOHead';

export const HomePage: React.FC = () => {
  const [activePlan, setActivePlan] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    '/hero_thali_platter.png',
    '/hero_slide_2.png',
    '/hero_slide_3.png',
    '/hero_slide_4.png',
    '/hero_slide_5.png',
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3000); // Change image every 3 seconds
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <>
      <SEOHead />
      {/* Hero Section */}
      <section className="relative w-full pt-32 pb-16 px-margin-mobile md:px-margin-desktop overflow-hidden bg-gradient-to-b from-surface to-surface-container-low min-h-[90vh] flex flex-col items-center justify-center">
        {/* Background Decorative Blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-fixed/20 rounded-full blur-[120px] -z-10"></div>
        
        <div className="z-10 flex flex-col items-center text-center gap-6 max-w-4xl mx-auto w-full">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-container/30 bg-surface/50 backdrop-blur-sm text-primary font-label-md text-label-md shadow-sm">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
            <span>Premium Home-Cooked Goodness</span>
          </div>
          
          <h1 className="font-display-lg text-[42px] md:text-[72px] text-primary leading-tight font-bold px-4">
            Homely meals that fit your schedule <span className="text-accent italic">perfectly.</span>
          </h1>
          
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <Link
              to="/plans"
              className="bg-accent text-white font-label-md text-[18px] font-bold py-[18px] px-[40px] rounded-full hover:bg-accent/90 transition-transform hover:scale-105 shadow-lg inline-block"
            >
              Explore Weekly Plans
            </Link>
            <Link
              to="/contact"
              className="bg-white text-primary border-2 border-primary/20 font-label-md text-[18px] font-bold py-[16px] px-[40px] rounded-full hover:bg-surface-variant transition-colors shadow-sm inline-block"
            >
              Contact Us to Get Started
            </Link>
          </div>

          <div className="w-full max-w-[900px] mt-16 relative overflow-hidden rounded-3xl group h-[300px] sm:h-[400px] md:h-[500px] shadow-2xl">
             {/* Dynamic Circular Slider */}
             {heroImages.map((src, idx) => {
               let slideDirection = 'translate-x-full opacity-0 z-0'; // Default: moved to the right
               
               if (idx === currentSlide) {
                 slideDirection = 'translate-x-0 opacity-100 z-10'; // Center
               } else if (idx === (currentSlide + 1) % heroImages.length) {
                 slideDirection = '-translate-x-full opacity-0 z-0'; // Next slide waits on the left
               }

               return (
                 <div 
                   key={idx} 
                   className={`absolute inset-0 w-full h-full transition-all duration-[1200ms] ease-out ${slideDirection}`}
                 >
                   <img 
                     src={src} 
                     alt={`Premium Indian Platter ${idx + 1}`} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2000ms]"
                   />
                 </div>
               );
             })}
             
             {/* Slider Indicators */}
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {heroImages.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentSlide(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentSlide === idx ? 'bg-primary w-8' : 'bg-primary/30 hover:bg-primary/60'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
             </div>

            {/* Floating Badge */}
            <div className="absolute top-10 -right-4 md:right-10 bg-white/90 backdrop-blur-md px-6 py-4 rounded-2xl shadow-xl border border-white/40 flex items-center gap-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <div className="w-12 h-12 bg-[#25D366]/20 rounded-full flex items-center justify-center text-[#25D366]">
                 <span className="material-symbols-outlined text-2xl">verified</span>
               </div>
               <div className="text-left">
                 <p className="font-label-md font-bold text-primary leading-tight">100% Fresh</p>
                 <p className="font-body-sm text-on-surface-variant text-sm">Prepared Daily</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features/Benefits Banner */}
      <section className="w-full bg-primary text-white py-xl mt-12 md:mt-24">
        <div className="px-margin-mobile md:px-margin-desktop mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-3 gap-lg">
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-secondary-fixed">verified_user</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md font-bold">100% Hygienic</h4>
              <p className="font-body-md text-body-md text-white/80 text-sm">Prepared in pristine kitchens</p>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-secondary-fixed">event_available</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md font-bold">Flexible Plans</h4>
              <p className="font-body-md text-body-md text-white/80 text-sm">Pause or cancel anytime</p>
            </div>
          </div>
          <div className="flex items-center gap-md">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px] text-secondary-fixed">savings</span>
            </div>
            <div>
              <h4 className="font-label-md text-label-md font-bold">Affordable Daily</h4>
              <p className="font-body-md text-body-md text-white/80 text-sm">Premium quality, student friendly</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Meals Showcase */}
      <section className="w-full px-margin-mobile md:px-margin-desktop py-24 mx-auto bg-surface-container-lowest">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display-lg text-4xl md:text-5xl text-primary font-bold mb-6 relative inline-block">
            Popular on the Menu
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-24 h-1 bg-accent rounded-full"></div>
          </h2>
          <p className="font-body-lg text-lg text-on-surface-variant mt-8">
            Discover our subscribers' favorite home-cooked meals, crafted with love and fresh ingredients daily.
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 min-h-[450px]">
            <img
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              alt="Chicken Chettinad curry with parottas"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAjTFaQHEOdaghmfqTvKy9UCSPuyOFjoA8jeh_TLtUNFYAjpPe5-3qO_sX3VQzKQh7BqXTzRwSgarZ6qZNdA6wr0fuQR-ucDFsVmff4GDIvh9ktxXwnxgViEsDJF8wkYp85sI-Qv2R6MLJrgaW1o48C1HkPP_ck-mtHVIL_nqG3CWWYbeS06drqt_DmoLPJSoLIzcw9qHwiLd97lSSn020cy6LaX0X9oKWcEArisqvq1eoE4A1W1pl4"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">High Protein</span>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-md text-3xl text-white mb-3 font-bold leading-tight">Sunday Special Mutton Biryani</h3>
                <p className="font-body-md text-white/80 mb-6 line-clamp-2">Fragrant seeraga samba rice with tender meat.</p>
                <div className="flex items-center justify-between">
                  <span className="text-accent text-2xl font-bold">₹249</span>
                  <Link to="/menu" className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 min-h-[450px]">
            <img
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              alt="Fresh garden salad bowl"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIZZnb_QQTmxUKk_R-Qf_Ps6CU-rloRZXmgZSukMVTj-X8Y_2OVfsuyOI25Lnus6NzrFbp193lGUIWo0rytcaCi0M59jQm83XATWqUKcPuCWGwHtcEOrCl_XA_4pE_eg9uKzPmHT6KBbt8zDfDATPEwtnLCi7aXtzAiXIODsMrYktICjCbQHEaAVVABrhQHWxfiqTbIyjF-TU7Rbj4L4y-1Kw3488ZmWHZ7Gq_Iwq9snoDQgOQPETk"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">Vegan</span>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-md text-3xl text-white mb-3 font-bold leading-tight">Fresh Garden Salad</h3>
                <p className="font-body-md text-white/80 mb-6 line-clamp-2">Crisp, refreshing mix of seasonal greens.</p>
                <div className="flex items-center justify-between">
                  <span className="text-accent text-2xl font-bold">₹99</span>
                  <Link to="/menu" className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 min-h-[450px] md:col-span-2 lg:col-span-1">
            <img
              className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              alt="Ghee roast dosa with chutneys"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEjLQNd1IuovM_abUmbXukbH3HN5LzLQ1kHZXHMfzBu4rm-PuhnOllXg0m2Rsyb2bMT6KpM8yIoBVvjOEnowOgT7UkKr3XS2lEAYvbkt1nwjgLySarO72xv9ULtPtGBuFohreU619d9lDbB7qIZy1DSb81rBp8myQcQPfbTwntUVCF8XT1xkxdAX1yd631ACp0vdCP_eu836s7yqS3xcePVt9hp3hLyUeQjqa1-ZKF2pC9oPqGn1gw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">Breakfast</span>
            </div>

            <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-md text-3xl text-white mb-3 font-bold leading-tight">Ghee Roast Dosa Set</h3>
                <p className="font-body-md text-white/80 mb-6 line-clamp-2">Crispy perfection with authentic chutneys.</p>
                <div className="flex items-center justify-between">
                  <span className="text-accent text-2xl font-bold">₹120</span>
                  <Link to="/menu" className="w-12 h-12 rounded-full bg-white text-primary flex items-center justify-center hover:bg-accent hover:text-white transition-colors">
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <Link to="/menu" className="inline-flex items-center gap-2 bg-transparent text-primary border-2 border-primary/20 font-label-md text-lg font-bold py-4 px-8 rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm">
            Explore Full Menu <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
        </div>
      </section>

      {/* Subscription Plans Section */}
      <section className="w-full bg-surface-container-low py-24">
        <div className="px-margin-mobile md:px-margin-desktop mx-auto max-w-[1440px] flex flex-col items-center">
          <div className="text-center max-w-2xl mb-xl">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Simple, Transparent Pricing</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mb-8">Choose a plan that fits your lifestyle. Pause or modify anytime.</p>
            {/* Subscription Toggle */}
            <div className="inline-flex bg-surface border border-outline-variant rounded-full p-1 shadow-sm">
              <button
                onClick={() => setActivePlan('daily')}
                className={`px-6 py-2 rounded-full font-label-md text-label-md transition-colors ${activePlan === 'daily' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'}`}
              >
                Daily
              </button>
              <button
                onClick={() => setActivePlan('weekly')}
                className={`px-6 py-2 rounded-full font-label-md text-label-md transition-colors ${activePlan === 'weekly' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'}`}
              >
                Weekly
              </button>
              <button
                onClick={() => setActivePlan('monthly')}
                className={`px-6 py-2 rounded-full font-label-md text-label-md transition-colors ${activePlan === 'monthly' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-on-surface-variant hover:bg-surface-variant'}`}
              >
                Monthly
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg w-full max-w-5xl mt-8">
            {/* Plan Card 1 */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-lg flex flex-col hover:shadow-ambient transition-shadow">
              <div className="mb-6">
                <h3 className="font-headline-md text-headline-md text-primary mb-2">Lite Week</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Perfect for trying out our meals.</p>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-display-lg text-display-lg text-primary">₹660</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/week</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-grow">
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">check_circle</span>
                  1 Meal per day (Mon-Sat)
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md mt-2">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">check_circle</span>
                  Choose Lunch
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">check_circle</span>
                  Standard Delivery included
                </li>
              </ul>
              <button className="w-full bg-transparent text-primary-container border-2 border-primary-container font-label-md text-label-md font-bold py-3 rounded-full hover:bg-primary-container hover:text-white transition-colors">
                Select Plan
              </button>
            </div>
            {/* Plan Card 2 (Premium/Highlighted) */}
            <div className="bg-primary text-white rounded-2xl p-lg flex flex-col shadow-ambient transform md:-translate-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-white font-label-sm text-label-sm font-bold px-4 py-1 rounded-bl-lg">MOST POPULAR</div>
              <div className="mb-6 mt-2">
                <h3 className="font-headline-md text-headline-md text-secondary-fixed mb-2">Standard Week</h3>
                <p className="font-body-md text-body-md text-white/80">The ideal balance for working professionals.</p>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-display-lg text-display-lg text-white">₹600</span>
                <span className="font-body-md text-body-md text-white/80">/week</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-grow">
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
                  2 Meals per day (Mon-Fri)
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
                  Breakfast &amp; Dinner
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
                  Priority Delivery
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-secondary-fixed">check_circle</span>
                  Weekend opt-in available
                </li>
              </ul>
              <button className="w-full bg-accent text-white font-label-md text-label-md font-bold py-3 rounded-full hover:bg-accent/90 transition-colors shadow-sm">
                Select Plan
              </button>
            </div>
            {/* Plan Card 3 */}
            <div className="bg-surface border border-outline-variant rounded-2xl p-lg flex flex-col hover:shadow-ambient transition-shadow">
              <div className="mb-6">
                <h3 className="font-headline-md text-headline-md text-primary mb-2">Full Week</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Complete nutritional coverage.</p>
              </div>
              <div className="mb-6 flex items-baseline gap-1">
                <span className="font-display-lg text-display-lg text-primary">₹1260</span>
                <span className="font-body-md text-body-md text-on-surface-variant">/week</span>
              </div>
              <ul className="flex flex-col gap-3 mb-8 flex-grow">
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">check_circle</span>
                  3 Meals per day (Mon-Sun)
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">check_circle</span>
                  Breakfast, Lunch &amp; Dinner
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">check_circle</span>
                  Priority Delivery
                </li>
                <li className="flex items-center gap-3 font-body-md text-body-md">
                  <span className="material-symbols-outlined text-[20px] text-primary-container">check_circle</span>
                  Free Sunday Special
                </li>
              </ul>
              <button className="w-full bg-transparent text-primary-container border-2 border-primary-container font-label-md text-label-md font-bold py-3 rounded-full hover:bg-primary-container hover:text-white transition-colors">
                Select Plan
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
