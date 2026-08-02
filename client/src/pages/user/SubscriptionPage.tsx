import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import type { SubscriptionPlan } from '../../types/subscription';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const SubscriptionPage: React.FC = () => {
  const { refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [selectedMeals, _setSelectedMeals] = useState<string[]>(['breakfast', 'dinner']);
  const [loading, setLoading] = useState(true);

  const loadSubscriptionData = async () => {
    try {
      const [plansRes, currentRes] = await Promise.all([
        API.get('/subscriptions/plans'),
        API.get('/subscriptions/current')
      ]);
      setPlans(plansRes.data.plans || []);
      setCurrentSub(currentRes.data.subscription);
      if (plansRes.data.plans?.length > 0) {
        setSelectedPlan(plansRes.data.plans[0]);
      }
    } catch (err) {
      console.error('Failed to load subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptionData();
  }, []);

  const handleSubscribe = async () => {
    if (!selectedPlan) return;
    try {
      await API.post('/subscriptions/subscribe', {
        planId: selectedPlan.id,
        mealTypes: selectedMeals
      });
      alert(`Successfully subscribed to ${selectedPlan.name}!`);
      await refreshUserData();
      await loadSubscriptionData();
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to complete subscription purchase');
    }
  };

  const handlePauseResume = async () => {
    try {
      if (currentSub?.status === 'active') {
        await API.post('/subscriptions/pause');
        alert('Subscription paused.');
      } else {
        await API.post('/subscriptions/resume');
        alert('Subscription resumed!');
      }
      await loadSubscriptionData();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Action failed');
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-label text-on-surface-variant">Loading Subscription...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-ambient">
        <h2 className="font-display font-bold text-2xl text-primary">Subscription Plans & Purchase</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Choose a flexible daily meal subscription plan tailored to your nutritional preferences.
        </p>
      </div>

      {/* Current Active Subscription Overview (if any) */}
      {currentSub && (
        <div className="bg-white rounded-xl border border-primary/20 p-6 shadow-ambient">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-surface-variant pb-4 mb-4">
            <div>
              <span className="bg-primary/10 text-primary font-label text-xs font-bold px-3 py-1 rounded-full uppercase">
                Active Subscription
              </span>
              <h3 className="font-display font-bold text-xl text-primary mt-2">
                {currentSub.planDetails?.name || 'Nala Daily Subscription'}
              </h3>
            </div>
            <button
              onClick={handlePauseResume}
              className={`font-label text-sm px-5 py-2 rounded-full font-bold transition-all ${
                currentSub.status === 'active'
                  ? 'border border-secondary text-secondary hover:bg-secondary/10'
                  : 'bg-primary text-white hover:bg-primary-container'
              }`}
            >
              {currentSub.status === 'active' ? 'Pause Subscription' : 'Resume Subscription'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-label">
            <div>
              <span className="text-on-surface-variant block text-xs">Start Date</span>
              <span className="font-bold text-primary">{currentSub.start_date}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-xs">End Date</span>
              <span className="font-bold text-primary">{currentSub.end_date}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-xs">Meal Coverage</span>
              <span className="font-bold text-accent capitalize">{currentSub.mealTypes.join(', ')}</span>
            </div>
            <div>
              <span className="text-on-surface-variant block text-xs">Credits Included</span>
              <span className="font-bold text-secondary">{currentSub.userCredits || 4} Credits</span>
            </div>
          </div>
        </div>
      )}

      {/* Plans Picker Grid */}
      <div className="space-y-4">
        <h3 className="font-display font-bold text-xl text-primary">Select Subscription Tier</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isSelected = selectedPlan?.id === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan)}
                className={`cursor-pointer rounded-2xl p-6 transition-all flex flex-col justify-between border ${
                  isSelected
                    ? 'border-2 border-primary bg-primary-container/10 shadow-lg scale-105'
                    : 'border-surface-variant bg-white hover:border-primary/50 shadow-ambient'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-display font-bold text-lg text-primary">{plan.name}</h4>
                    {plan.code === 'MONTHLY_PRO' && (
                      <span className="bg-accent text-white font-label text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        Best Value
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-on-surface-variant mb-4">{plan.description}</p>

                  <div className="mb-4">
                    <span className="font-display text-3xl font-bold text-primary">₹{plan.price_per_day}</span>
                    <span className="font-label text-xs text-on-surface-variant"> / day</span>
                  </div>

                  <ul className="space-y-2 text-xs font-label text-on-surface-variant mb-6">
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">check</span>
                      <span>{plan.meals_per_day} Meals Per Day</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">check</span>
                      <span>{plan.duration_days} Days Plan Validity</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-sm">check</span>
                      <span>{plan.credits_included} Free Rollover Credits</span>
                    </li>
                  </ul>
                </div>

                <div className={`text-center py-2.5 rounded-full font-label text-sm font-bold transition-all ${
                  isSelected ? 'bg-primary text-white shadow-md' : 'bg-surface-container-low text-primary'
                }`}>
                  {isSelected ? 'Selected Plan' : 'Choose Plan'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Summary Box */}
      {selectedPlan && (
        <div className="bg-white rounded-2xl border border-surface-variant p-6 shadow-ambient max-w-xl mx-auto space-y-4">
          <h3 className="font-display font-bold text-lg text-primary border-b border-surface-variant pb-3">
            Subscription Summary
          </h3>

          <div className="space-y-2 font-label text-sm">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Plan Tier:</span>
              <span className="font-bold text-primary">{selectedPlan.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Billing Cycle:</span>
              <span>{selectedPlan.duration_days} Days</span>
            </div>
            <div className="flex justify-between border-t border-surface-variant pt-2 text-base font-bold text-primary">
              <span>Total Price:</span>
              <span className="text-accent text-xl">₹{selectedPlan.price_per_day * selectedPlan.duration_days}</span>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            className="w-full bg-accent hover:opacity-90 text-white font-label text-sm py-3 rounded-full font-bold shadow-ambient transition-all mt-4"
          >
            Confirm & Pay ₹{selectedPlan.price_per_day * selectedPlan.duration_days}
          </button>
        </div>
      )}
    </div>
  );
};
