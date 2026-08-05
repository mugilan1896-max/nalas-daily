import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SEOHead } from '../../components/common/SEOHead';
import { BUSINESS_INFO } from '../../constants/businessInfo';

export const HomePage: React.FC = () => {
  const [activePlan, setActivePlan] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

      {/* Daily Add-ons Section */}
      <section className="px-margin-mobile md:px-margin-desktop py-24 mx-auto max-w-[1440px]">
        <div className="text-center mb-16">
          <h2 className="font-headline-lg text-headline-lg text-primary relative inline-block">
            Daily Add-ons
            <span className="absolute -bottom-4 left-1/4 w-1/2 h-1 bg-accent rounded-full"></span>
          </h2>
          <p className="font-body-lg text-lg text-on-surface-variant mt-8 max-w-2xl mx-auto">
            Craving a little extra? Add any of these delicious sides to your daily or weekly subscription meals. 
            Perfect for when you want a special treat alongside your regular plan!
          </p>
        </div>

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Egg Card */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 h-[350px]">
            <img className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" alt="Boiled Egg" src="/addons/addon_egg_1785909496766.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">High Protein</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-sm text-2xl text-white mb-2 font-bold leading-tight">Boiled Egg</h3>
                <p className="font-body-md text-white/80 mb-4 line-clamp-1">Perfectly boiled, sprinkled with pepper.</p>
              </div>
            </div>
          </div>

          {/* Egg Dosa Card */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 h-[350px]">
            <img className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" alt="Egg Dosa" src="/addons/addon_egg_dosa_1785909516878.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">Non-Veg</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-sm text-2xl text-white mb-2 font-bold leading-tight">Egg Dosa</h3>
                <p className="font-body-md text-white/80 mb-4 line-clamp-1">Crispy dosa with a delicious egg spread.</p>
              </div>
            </div>
          </div>

          {/* Medhu Vada Card */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 h-[350px]">
            <img className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" alt="Medhu Vada" src="/addons/addon_medhu_vada_1785909535213.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">Snack</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-sm text-2xl text-white mb-2 font-bold leading-tight">Medhu Vada (2 Nos)</h3>
                <p className="font-body-md text-white/80 mb-4 line-clamp-1">Crispy, fluffy golden lentil donuts.</p>
              </div>
            </div>
          </div>

          {/* Masal Vada Card */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 h-[350px]">
            <img className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" alt="Masal Vada" src="/addons/addon_masal_vada_1785909556364.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">Snack</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-sm text-2xl text-white mb-2 font-bold leading-tight">Masal Vada (2 Nos)</h3>
                <p className="font-body-md text-white/80 mb-4 line-clamp-1">Spiced and crunchy chana dal fritters.</p>
              </div>
            </div>
          </div>

          {/* Masal Dosa Card */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 h-[350px]">
            <img className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" alt="Masal Dosa" src="/addons/addon_masal_dosa_1785909574454.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">Vegetarian</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-sm text-2xl text-white mb-2 font-bold leading-tight">Masal Dosa</h3>
                <p className="font-body-md text-white/80 mb-4 line-clamp-1">Classic crispy dosa stuffed with potato masala.</p>
              </div>
            </div>
          </div>

          {/* Sweet Pongal Card */}
          <div className="group rounded-[32px] overflow-hidden relative shadow-lg bg-surface hover:shadow-2xl transition-all duration-500 h-[350px]">
            <img className="w-full h-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110" alt="Sweet Pongal" src="/menu/menu_pongal.png" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
            <div className="absolute top-6 left-6 flex gap-2">
              <span className="bg-white/20 backdrop-blur-md text-white border border-white/30 px-4 py-1.5 rounded-full font-label-md text-sm font-semibold tracking-wide">Vegetarian</span>
            </div>
            <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end h-full">
              <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <h3 className="font-display-sm text-2xl text-white mb-2 font-bold leading-tight">Sweet Pongal</h3>
                <p className="font-body-md text-white/80 mb-4 line-clamp-1">Traditional jaggery sweet rice with ghee-roasted nuts.</p>
              </div>
            </div>
          </div>

        </div>
        
        <div className="mt-12 text-center">
          <p className="text-on-surface-variant italic mb-4">* All add-ons can be ordered via WhatsApp along with your daily subscription meal.</p>
          <a href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=Hello%20Nala's%20Daily,%20I%20would%20like%20to%20know%20more%20about%20adding%20extras%20to%20my%20subscription!`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] text-white font-label-md text-lg font-bold py-3 px-8 rounded-full hover:bg-opacity-90 transition-colors shadow-md">
            Enquire on WhatsApp <span className="material-symbols-outlined">chat</span>
          </a>
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
              {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActivePlan(tab)}
                  className={`px-6 py-2 rounded-full font-label-md text-label-md transition-all duration-300
                    ${activePlan === tab
                      ? 'bg-primary text-white shadow-md scale-105'
                      : 'text-on-surface-variant hover:bg-surface-variant'
                    }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Plan Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg w-full max-w-5xl mt-8">
            {(activePlan === 'daily' ? [
              { name: 'Daily Lunch', desc: 'One fresh home-cooked veg lunch.', price: '₹110', period: '/day', features: ['1 Meal (Lunch)', 'Veg Menu', 'Same-day order'], popular: false },
              { name: 'Daily Lunch (Non-Veg)', desc: 'One fresh home-cooked non-veg lunch.', price: '₹150', period: '/day', features: ['1 Meal (Lunch)', 'Non-Veg Menu', 'Same-day order'], popular: false },
              { name: 'Daily Breakfast & Dinner', desc: 'Perfect for busy mornings and relaxed evenings.', price: '₹100', period: '/day', features: ['2 Meals in a day', 'Breakfast & Dinner', 'Priority Delivery'], popular: true },
              { name: 'Daily All (Veg)', desc: 'Breakfast + Lunch + Dinner — all in one.', price: '₹210', period: '/day', features: ['3 Veg Meals in a day', 'Balanced Nutrition', 'Priority Delivery'], popular: false },
              { name: 'Daily All (Non-Veg)', desc: 'Complete nutritional coverage including non-veg.', price: '₹250', period: '/day', features: ['3 Meals in a day (Non-Veg)', 'Balanced Nutrition', 'Priority Delivery'], popular: false },
            ] : activePlan === 'weekly' ? [
              { name: 'Weekly Lunch', desc: 'Perfect for trying out our meals.', price: '₹660', period: '/week', features: ['1 Meal/day (Mon-Sat)', 'Veg Lunch', 'Standard Delivery included'], popular: false },
              { name: 'Weekly Lunch (Non-Veg)', desc: 'Perfect for non-veg lovers.', price: '₹700', period: '/week', features: ['1 Meal/day (Mon-Sat)', 'Non-Veg Lunch', 'Standard Delivery included'], popular: false },
              { name: 'Weekly Breakfast & Dinner', desc: 'The ideal balance for working professionals.', price: '₹600', period: '/week', features: ['2 Meals/day (Mon-Fri)', 'Breakfast & Dinner', 'Priority Delivery'], popular: true },
              { name: 'Weekly All (Veg)', desc: 'Complete nutritional coverage.', price: '₹1260', period: '/week', features: ['3 Meals/day (Mon-Sun)', 'Veg Breakfast, Lunch & Dinner', 'Priority Delivery'], popular: false },
              { name: 'Weekly All (Non-Veg)', desc: 'Complete coverage with non-veg.', price: '₹1300', period: '/week', features: ['3 Meals/day (Mon-Sun)', 'Non-Veg Breakfast, Lunch & Dinner', 'Priority Delivery'], popular: false },
            ] : [
              { name: 'Monthly Lunch', desc: 'Light subscription for individuals.', price: '₹2860', period: '/month', features: ['1 Meal/day (26 days)', 'Veg Lunch', 'Standard Delivery'], popular: false },
              { name: 'Monthly Lunch (Non-Veg)', desc: 'Light subscription with non-veg meals.', price: '₹3020', period: '/month', features: ['1 Meal/day (26 days)', 'Non-Veg Lunch', 'Standard Delivery'], popular: false },
              { name: 'Monthly Breakfast & Dinner', desc: 'Best for hostel students & bachelors.', price: '₹2600', period: '/month', features: ['2 Meals/day (26 days)', 'Breakfast & Dinner', 'Priority Delivery'], popular: true },
              { name: 'Monthly All (Veg)', desc: 'Complete family or professional coverage.', price: '₹5460', period: '/month', features: ['3 Meals/day (26 days)', 'Veg Breakfast, Lunch & Dinner', 'Priority Delivery'], popular: false },
              { name: 'Monthly All (Non-Veg)', desc: 'Complete coverage with non-veg meals.', price: '₹5620', period: '/month', features: ['3 Meals/day (26 days)', 'Non-Veg Breakfast, Lunch & Dinner', 'Priority Delivery'], popular: false },
            ]).map((plan, i) => {
              // Green highlight travels: hovered card wins, otherwise popular card
              const isHighlighted = hoveredCard !== null ? hoveredCard === i : plan.popular;
              return (
              <div
                key={`${activePlan}-${i}`}
                className={`rounded-2xl p-lg flex flex-col relative overflow-hidden cursor-pointer transition-all duration-500 ease-out border
                  ${isHighlighted 
                    ? 'bg-primary text-white shadow-2xl md:-translate-y-4 md:scale-105 border-transparent' 
                    : 'bg-surface border-outline-variant hover:shadow-md md:translate-y-0 md:scale-100 text-on-surface'
                  }`}
                style={{ animation: 'fadeSlideIn 0.4s ease both', animationDelay: `${i * 80}ms` }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-accent text-white font-label-sm text-label-sm font-bold px-4 py-1 rounded-bl-lg z-10 shadow-sm">MOST POPULAR</div>
                )}
                <div className={`mb-6 ${plan.popular ? 'mt-2' : ''}`}>
                  <h3 className={`font-headline-md text-headline-md mb-2 transition-colors duration-500 ${isHighlighted ? 'text-secondary-fixed' : 'text-primary'}`}>
                    {plan.name}
                  </h3>
                  <p className={`font-body-md text-body-md transition-colors duration-500 ${isHighlighted ? 'text-white/90' : 'text-on-surface-variant'}`}>
                    {plan.desc}
                  </p>
                </div>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className={`font-display-lg text-display-lg transition-colors duration-500 ${isHighlighted ? 'text-white' : 'text-primary'}`}>
                    {plan.price}
                  </span>
                  <span className={`font-body-md text-body-md transition-colors duration-500 ${isHighlighted ? 'text-white/90' : 'text-on-surface-variant'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="flex flex-col gap-3 mb-8 flex-grow">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-center gap-3 font-body-md text-body-md">
                      <span className={`material-symbols-outlined text-[20px] transition-colors duration-500 ${isHighlighted ? 'text-secondary-fixed' : 'text-primary-container'}`}>
                        check_circle
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => window.open(`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(`Hi! I'm interested in the ${plan.name} plan.`)}`, '_blank')}
                  className={`w-full font-label-md text-label-md font-bold py-3 rounded-full transition-all duration-500 border-2
                    ${isHighlighted
                      ? 'bg-accent text-white border-transparent hover:bg-accent/90 shadow-sm'
                      : 'bg-transparent text-primary-container border-primary-container hover:bg-primary-container hover:text-white'
                    }`}
                >
                  Select Plan
                </button>
              </div>
              );
            })}
          </div>
        </div>
        <style>{`
          @keyframes fadeSlideIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </section>
    </>
  );
};
