import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import type { Order } from '../../types/order';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminOrders = async () => {
    try {
      const res = await API.get('/admin/orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status });
      fetchAdminOrders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to update order status');
    }
  };

  if (loading) {
    return <div className="p-8 text-center font-label text-on-surface-variant">Loading Admin Orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-surface-variant shadow-ambient">
        <h2 className="font-display font-bold text-2xl text-primary">Orders & Fulfillment Dispatch</h2>
        <p className="font-body text-xs text-on-surface-variant mt-1">
          Monitor kitchen prep, order status, and update live delivery dispatches.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-surface-variant overflow-hidden shadow-ambient">
        <table className="w-full text-left font-label text-sm border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant font-bold text-xs uppercase">
              <th className="p-4">Order #</th>
              <th className="p-4">Customer</th>
              <th className="p-4">Delivery Slot</th>
              <th className="p-4">Address</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Update Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-4 font-bold text-primary">#{order.order_number}</td>
                <td className="p-4">
                  <div className="font-bold text-on-surface">{order.user_name || 'Customer'}</div>
                  <div className="text-xs text-on-surface-variant">{order.phone_number}</div>
                </td>
                <td className="p-4">{order.delivery_date} ({order.delivery_time_slot})</td>
                <td className="p-4 text-xs max-w-xs truncate">{order.address_line1}, {order.city}</td>
                <td className="p-4">
                  <span className={`font-label text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    order.status === 'delivered'
                      ? 'bg-primary/10 text-primary'
                      : order.status === 'out_for_delivery'
                      ? 'bg-accent/20 text-tertiary'
                      : 'bg-surface-variant text-on-surface-variant'
                  }`}>
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="px-3 py-1 rounded-lg border border-outline-variant text-xs font-bold focus:outline-none"
                  >
                    <option value="pending font-body">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
