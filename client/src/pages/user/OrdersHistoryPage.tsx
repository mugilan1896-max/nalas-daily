import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import type { Order } from '../../types/order';

export const OrdersHistoryPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get('/orders');
        setOrders(res.data.orders || []);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="p-8 text-center font-label text-on-surface-variant">Loading Orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-ambient">
        <h2 className="font-display font-bold text-2xl text-primary">Orders & Delivery History</h2>
        <p className="font-body text-sm text-on-surface-variant mt-1">
          Track upcoming scheduled deliveries and review past meal fulfillment logs.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-surface-variant p-5 shadow-ambient flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="font-display font-bold text-base text-primary">
                  Order #{order.order_number}
                </span>
                <span className={`font-label text-xs font-bold px-3 py-0.5 rounded-full capitalize ${
                  order.status === 'delivered'
                    ? 'bg-primary/10 text-primary'
                    : order.status === 'out_for_delivery'
                    ? 'bg-accent/20 text-tertiary'
                    : 'bg-surface-variant text-on-surface-variant'
                }`}>
                  {order.status.replace(/_/g, ' ')}
                </span>
              </div>
              <p className="font-body text-xs text-on-surface-variant">
                Delivery Date: <strong className="text-primary">{order.delivery_date}</strong> &bull; Slot: {order.delivery_time_slot}
              </p>
              <p className="font-body text-xs text-on-surface-variant mt-1">
                Address: {order.address_line1}, {order.city} ({order.pincode})
              </p>
            </div>

            <div className="text-right flex flex-col md:items-end">
              <span className="font-display text-lg font-bold text-primary">₹{order.total_amount}</span>
              <span className="font-label text-xs text-on-surface-variant">{order.items?.length || 1} Item(s)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
