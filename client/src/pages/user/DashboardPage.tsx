import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import API from '../../services/api';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [subData, setSubData] = useState<any>(null);
  const [_todayDeliveries, setTodayDeliveries] = useState<any[]>([]);
  const [plannerSummary, setPlannerSummary] = useState<{ selectedCount: number }>({ selectedCount: 14 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, todayRes, planRes] = await Promise.all([
          API.get('/subscriptions/current'),
          API.get('/orders/today'),
          API.get('/planner')
        ]);
        setSubData(subRes.data.subscription);
        setTodayDeliveries(todayRes.data.deliveries || []);
        if (planRes.data.summary) {
          setPlannerSummary(planRes.data.summary);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOrderExtra = async () => {
    navigate('/menu');
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });

  if (loading) {
    return <div className="p-8 text-center font-label text-on-surface-variant">Loading Dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display font-semibold text-2xl lg:text-3xl text-primary">
            Welcome back, {profile?.petName || user?.fullName || 'Foodie'}
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="material-symbols-outlined text-accent text-lg">workspace_premium</span>
            <span className="font-label text-sm text-on-surface-variant font-medium">
              Premium Member &bull; Home-Grown Nutrition
            </span>
          </div>
        </div>
        <div className="hidden md:block text-right">
          <p className="font-label text-xs text-on-surface-variant uppercase tracking-wider">Today's Date</p>
          <p className="font-body text-base text-primary font-medium">{formattedDate}</p>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Status Overview Cards (Spans 8 cols) */}
        <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Active Plan Card */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient border border-surface-variant flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary-container/20 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">restaurant</span>
              </div>
              <span className="bg-secondary-container/20 text-secondary border border-secondary-container rounded-full px-3 py-0.5 font-label text-xs font-semibold">
                {subData?.status === 'active' ? 'Active Plan' : 'Standard Sub'}
              </span>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-primary mb-1">
                {subData?.planDetails?.name || 'Breakfast & Dinner Duo'}
              </h3>
              <p className="font-body text-sm text-on-surface-variant mb-4">
                26 Days Remaining in Cycle
              </p>
              <div className="flex justify-between items-center border-t border-surface-variant pt-3 text-xs">
                <span className="text-on-surface-variant">Active till Nov 20</span>
                <span className="text-error font-medium">Renewal in 12 days</span>
              </div>
            </div>
          </div>

          {/* Delivery & Credits Card */}
          <div className="bg-surface-container-lowest rounded-xl p-5 shadow-ambient border border-surface-variant flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-primary-container/20 p-2 rounded-lg text-primary">
                <span className="material-symbols-outlined">local_shipping</span>
              </div>
              <div className="flex items-center gap-1 text-accent font-label text-xs font-semibold">
                <span className="material-symbols-outlined text-sm">stars</span>
                <span>{user?.credits || 4} Credits Available</span>
              </div>
            </div>
            <div>
              <h3 className="font-display font-semibold text-xl text-primary mb-1">Next Delivery</h3>
              <p className="font-body text-sm text-on-surface-variant mb-4">
                Tomorrow, 8:00 AM &bull; Fresh & Warm
              </p>
              <div className="flex items-center gap-2 pt-3 border-t border-surface-variant">
                <Link to="/planner" className="font-label text-xs text-primary font-bold hover:underline">
                  Manage Schedule &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Progress Card (Spans 4 cols) */}
        <div className="md:col-span-12 lg:col-span-4 bg-primary-container text-on-primary-container rounded-xl p-5 shadow-ambient flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="font-display font-semibold text-xl mb-1 text-white">Planning Progress</h3>
            <p className="font-body text-sm opacity-90 mb-4">Week of Oct 21 - Oct 27</p>

            <div className="mb-2 flex justify-between items-end">
              <span className="font-display text-3xl font-bold text-white tracking-tight">
                {plannerSummary.selectedCount}<span className="text-xl text-white/70 font-normal">/21</span>
              </span>
              <span className="font-label text-xs text-white/80">meals selected</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-black/20 rounded-full h-2 mb-4 overflow-hidden">
              <div
                className="bg-accent h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (plannerSummary.selectedCount / 21) * 100)}%` }}
              ></div>
            </div>

            <button
              onClick={() => navigate('/planner')}
              className="w-full bg-white text-primary font-label text-sm py-2.5 px-4 rounded-full hover:bg-surface-variant transition-colors font-bold shadow-sm"
            >
              Plan Next Week
            </button>
          </div>
        </div>

        {/* Today's Menu Feature Card (Spans Full Width) */}
        <div className="md:col-span-12 rounded-xl overflow-hidden shadow-ambient bg-surface-container-lowest border border-surface-variant flex flex-col md:flex-row">
          {/* Image Area */}
          <div className="w-full md:w-2/5 min-h-[220px] relative bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80')` }}>
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6">
              <div>
                <span className="bg-accent text-white font-label text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Daily Fresh Feature
                </span>
                <h3 className="font-display text-2xl text-white font-bold drop-shadow-md mt-1">
                  Today's Gourmet Menu
                </h3>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-3/5 p-6 bg-white flex flex-col justify-center gap-4">
            {/* Breakfast */}
            <div className="flex items-start gap-3 border-b border-surface-variant pb-3">
              <div className="bg-primary/10 p-2 rounded-full text-primary mt-0.5">
                <span className="material-symbols-outlined text-lg">wb_twilight</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">Breakfast</span>
                  <span className="bg-surface-variant text-on-surface-variant rounded-full px-2 py-0.5 font-label text-[10px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">check_circle</span> Delivered
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-primary">Classic Masala Dosa</h4>
              </div>
            </div>

            {/* Lunch */}
            <div className="flex items-start gap-3 border-b border-surface-variant pb-3 opacity-70">
              <div className="bg-surface-variant p-2 rounded-full text-on-surface-variant mt-0.5">
                <span className="material-symbols-outlined text-lg">light_mode</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">Lunch</span>
                  <span className="text-on-surface-variant rounded-full px-2 py-0.5 font-label text-[10px] border border-outline">
                    Not Scheduled
                  </span>
                </div>
                <h4 className="font-display text-base text-on-surface-variant italic">No meal selected</h4>
              </div>
            </div>

            {/* Dinner */}
            <div className="flex items-start gap-3">
              <div className="bg-accent/10 p-2 rounded-full text-accent mt-0.5">
                <span className="material-symbols-outlined text-lg">dark_mode</span>
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">Dinner</span>
                  <span className="bg-accent/20 text-tertiary rounded-full px-2 py-0.5 font-label text-[10px] font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">schedule</span> Upcoming (8:00 PM)
                  </span>
                </div>
                <h4 className="font-display text-base font-bold text-primary">Grilled Paneer Salad</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="md:col-span-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <h3 className="font-display font-semibold text-lg text-primary mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/subscriptions')}
                className="flex flex-col items-center justify-center p-3 bg-white border border-surface-variant rounded-xl hover:bg-surface-container-low transition-colors shadow-sm gap-2 h-24"
              >
                <span className="material-symbols-outlined text-primary text-2xl">pause_circle</span>
                <span className="font-label text-xs text-on-surface text-center font-medium">Pause Meals</span>
              </button>

              <button
                onClick={handleOrderExtra}
                className="flex flex-col items-center justify-center p-3 bg-white border border-surface-variant rounded-xl hover:bg-surface-container-low transition-colors shadow-sm gap-2 h-24"
              >
                <span className="material-symbols-outlined text-primary text-2xl">add_shopping_cart</span>
                <span className="font-label text-xs text-on-surface text-center font-medium leading-tight">Order Extra Meal</span>
              </button>

              <button
                onClick={() => navigate('/account')}
                className="flex flex-col items-center justify-center p-3 bg-white border border-surface-variant rounded-xl hover:bg-surface-container-low transition-colors shadow-sm gap-2 h-24"
              >
                <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                <span className="font-label text-xs text-on-surface text-center font-medium">Change Address</span>
              </button>

              <button
                onClick={() => navigate('/plans')}
                className="flex flex-col items-center justify-center p-3 bg-white border border-surface-variant rounded-xl hover:bg-surface-container-low transition-colors shadow-sm gap-2 h-24"
              >
                <span className="material-symbols-outlined text-primary text-2xl">autorenew</span>
                <span className="font-label text-xs text-on-surface text-center font-medium">Renew Plan</span>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-display font-semibold text-lg text-primary">Recent Activity</h3>
              <Link to="/orders" className="font-label text-xs text-primary font-bold hover:underline">
                View All Orders
              </Link>
            </div>

            <div className="bg-white rounded-xl shadow-ambient border border-surface-variant overflow-hidden">
              <ul className="divide-y divide-surface-variant">
                <li className="p-4 flex items-start gap-3 hover:bg-surface-container-lowest transition-colors">
                  <div className="bg-surface-variant p-2 rounded-full text-on-surface-variant">
                    <span className="material-symbols-outlined text-lg">check_circle</span>
                  </div>
                  <div>
                    <p className="font-body text-sm text-on-surface font-medium">Breakfast delivered successfully.</p>
                    <p className="font-label text-xs text-on-surface-variant mt-0.5">Today, 8:12 AM</p>
                  </div>
                </li>

                <li className="p-4 flex items-start gap-3 hover:bg-surface-container-lowest transition-colors">
                  <div className="bg-primary-container/20 p-2 rounded-full text-primary">
                    <span className="material-symbols-outlined text-lg">edit_calendar</span>
                  </div>
                  <div>
                    <p className="font-body text-sm text-on-surface font-medium">Weekly meal preferences saved.</p>
                    <p className="font-label text-xs text-on-surface-variant mt-0.5">Yesterday, 4:30 PM</p>
                  </div>
                </li>

                <li className="p-4 flex items-start gap-3 hover:bg-surface-container-lowest transition-colors">
                  <div className="bg-secondary-container/20 p-2 rounded-full text-secondary">
                    <span className="material-symbols-outlined text-lg">notifications_active</span>
                  </div>
                  <div className="flex-grow flex justify-between items-center">
                    <div>
                      <p className="font-body text-sm text-on-surface font-medium">Plan renews in 12 days</p>
                      <p className="font-label text-xs text-on-surface-variant mt-0.5">4 Credits added to wallet</p>
                    </div>
                    <Link to="/plans" className="font-label text-xs text-accent font-bold hover:underline">
                      Review
                    </Link>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
