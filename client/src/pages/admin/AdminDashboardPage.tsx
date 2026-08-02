import React, { useEffect, useState } from 'react';
import API from '../../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/stats');
        setStats(res.data.stats);
      } catch (err) {
        console.error('Failed to load admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center font-label text-on-surface-variant">Loading Admin Dashboard...</div>;
  }
  return (
    <div className="space-y-6">
      <div className="bg-primary text-white p-6 rounded-2xl shadow-ambient">
        <span className="bg-accent text-white font-label text-[10px] font-bold px-3 py-1 rounded-full uppercase">
          Administrator Control Panel
        </span>
        <h2 className="font-display font-bold text-2xl mt-2">Nala's Daily Business Overview</h2>
        <p className="font-body text-xs text-white/80 mt-1">
          Real-time subscriber metrics, delivery dispatch counts, and catalog status.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-surface-variant shadow-ambient-sm">
          <span className="font-label text-xs text-on-surface-variant font-bold uppercase">Total Registered Users</span>
          <p className="font-display text-3xl font-bold text-primary mt-2">{stats?.totalUsers || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-variant shadow-ambient-sm">
          <span className="font-label text-xs text-on-surface-variant font-bold uppercase">Active Subscriptions</span>
          <p className="font-display text-3xl font-bold text-accent mt-2">{stats?.activeSubscriptions || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-variant shadow-ambient-sm">
          <span className="font-label text-xs text-on-surface-variant font-bold uppercase">Today's Orders</span>
          <p className="font-display text-3xl font-bold text-secondary mt-2">{stats?.todayOrders || 0}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-surface-variant shadow-ambient-sm">
          <span className="font-label text-xs text-on-surface-variant font-bold uppercase">Meals in Catalog</span>
          <p className="font-display text-3xl font-bold text-primary mt-2">{stats?.totalMealsInCatalog || 0}</p>
        </div>
      </div>
    </div>
  );
};
