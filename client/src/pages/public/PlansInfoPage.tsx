import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import API from '../../services/api';
// import { useAuth } from '../../context/AuthContext';
import { BUSINESS_INFO } from '../../constants/businessInfo';
import { SEOHead } from '../../components/common/SEOHead';

interface Plan {
  id: string;
  name: string;
  code: string;
  description: string;
  price_per_day: number;
  meals_per_day: number;
  duration_days: number;
  credits_included: number;
  plan_type: string;
  meal_label: string;
  total_price: number;
  is_popular: number;
  badge: string | null;
}

type TabType = 'individual' | 'weekly' | 'monthly';

export const PlansInfoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('weekly');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);

  const handleSubscribe = async (plan: Plan) => {
    const message = `Hello ${BUSINESS_INFO.name}, I am interested in subscribing to the ${plan.name} (${plan.meal_label}).`;
    window.open(`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await API.get('/subscriptions/plans');
        setPlans(res.data.plans);
      } catch (err) {
        console.error('Failed to load plans', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const filteredPlans = plans.filter((p) => p.plan_type === activeTab);

  const formatPrice = (price: number) => {
    return price >= 1000 ? `₹${price.toLocaleString('en-IN')}` : `₹${price}`;
  };

  const getPeriodLabel = (tab: TabType) => {
    switch (tab) {
      case 'individual': return '/ meal';
      case 'weekly': return '/ week';
      case 'monthly': return '/ month';
    }
  };

  return (
    <>
      <SEOHead title={`Subscription Plans | ${BUSINESS_INFO.name}`} description="Explore our daily, weekly and monthly meal subscription plans." path="/plans" />
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-display-lg text-display-lg text-primary mb-6">
            Choose the Meal Option That Fits Your Routine.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Order one meal whenever you need it, subscribe for six days, or choose a flexible 26-day monthly plan.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => setActiveTab('weekly')}
              className="bg-accent text-white font-label-md text-label-md px-8 py-4 rounded-full hover:bg-accent/90 transition-all active:scale-95 shadow-md"
            >
              View Subscription Plans
            </button>
            <button
              onClick={() => setActiveTab('individual')}
              className="border-2 border-primary text-primary font-label-md text-label-md px-8 py-4 rounded-full hover:bg-primary/5 transition-all active:scale-95"
            >
              Order an Individual Meal
            </button>
          </div>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </section>

      {/* Subscription Tabs & Content */}
      <section className="py-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto">
        {/* Tab Selector */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-surface-container-high rounded-full p-1 shadow-inner relative">
            <button
              onClick={() => setActiveTab('individual')}
              className={`relative z-10 px-6 py-3 font-label-md text-label-md rounded-full transition-all focus:outline-none ${activeTab === 'individual' ? 'text-primary bg-primary-container/10' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Individual Orders
            </button>
            <button
              onClick={() => setActiveTab('weekly')}
              className={`relative z-10 px-6 py-3 font-label-md text-label-md rounded-full transition-all focus:outline-none ${activeTab === 'weekly' ? 'text-primary bg-primary-container/10' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Weekly Plans
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`relative z-10 px-6 py-3 font-label-md text-label-md rounded-full transition-all focus:outline-none ${activeTab === 'monthly' ? 'text-primary bg-primary-container/10' : 'text-on-surface-variant hover:text-primary'}`}
            >
              Monthly Plans
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-4">Loading plans...</p>
          </div>
        )}

        {/* Plan Cards */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlans.map((plan) => (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col relative overflow-hidden transition-shadow ${
                  plan.is_popular
                    ? 'bg-surface-container-low shadow-[0px_4px_20px_rgba(40,89,67,0.12)] border border-primary transform md:-translate-y-2 hover:shadow-xl'
                    : 'bg-white shadow-[0px_4px_20px_rgba(40,89,67,0.08)] border border-outline-variant/30 hover:shadow-lg group'
                }`}
              >
                {/* Decorative corner blob for non-popular cards */}
                {!plan.is_popular && (
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-fixed/30 rounded-bl-full -z-10 group-hover:scale-110 transition-transform"></div>
                )}

                {/* Popular badge */}
                {plan.is_popular === 1 && (
                  <div className="absolute top-4 right-4 bg-accent text-white font-label-sm text-label-sm px-3 py-1 rounded-full shadow-sm z-10">
                    Popular
                  </div>
                )}

                {/* Card Content */}
                <div className={`mb-4 ${plan.is_popular ? 'mt-2' : ''}`}>
                  {plan.badge && (
                    <span className={`inline-block px-3 py-1 font-label-sm text-label-sm rounded-full border mb-2 ${
                      plan.is_popular
                        ? 'bg-white text-primary border-primary/20'
                        : 'bg-surface-container text-on-surface-variant border-outline-variant'
                    }`}>
                      {plan.badge}
                    </span>
                  )}
                  <h3 className="font-headline-md text-headline-md text-primary mb-1">{plan.name}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant">{plan.description}</p>
                </div>

                {/* Price + Action */}
                <div className={`mt-auto pt-6 flex items-end justify-between border-t ${
                  plan.is_popular ? 'border-primary/10' : 'border-surface-container-high'
                }`}>
                  <div>
                    <span className="font-display-lg text-display-lg text-accent leading-none">
                      {formatPrice(plan.total_price)}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block mt-1">
                      {getPeriodLabel(activeTab)}
                    </span>
                  </div>
                  {plan.is_popular ? (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      className="bg-primary text-white font-label-md px-6 py-3 rounded-full hover:bg-primary/90 transition-colors active:scale-95 shadow-sm inline-block"
                    >
                      Enquire on WhatsApp
                    </button>
                  ) : (
                    <button
                      onClick={() => handleSubscribe(plan)}
                      className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors active:scale-95 shadow-sm"
                    >
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filteredPlans.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-outline-variant">restaurant</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">No plans available for this category yet.</p>
          </div>
        )}
      </section>
    </>
  );
};
