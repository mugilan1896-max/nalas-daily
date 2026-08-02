import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export const AddressSetupPage: React.FC = () => {
  const { refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [addressLine1, setAddressLine1] = useState<string>('Flat 402, Green Acres Residency');
  const [addressLine2, setAddressLine2] = useState<string>('Indiranagar 10th Main');
  const [city, setCity] = useState<string>('Bengaluru');
  const [pincode, setPincode] = useState<string>('560038');
  const [instructions, setInstructions] = useState<string>('Leave package on porch table if un-answered.');
  const [saving, setSaving] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/users/addresses', {
        addressLine1,
        addressLine2,
        city,
        pincode,
        deliveryInstructions: instructions,
        isDefault: true
      });
      await refreshUserData();
      navigate('/dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white p-8 rounded-3xl border border-surface-variant shadow-2xl space-y-6">
      <div className="space-y-2 border-b border-surface-variant pb-4">
        <span className="bg-accent text-white font-label text-xs font-bold px-3 py-1 rounded-full uppercase">
          Step 2 of 2
        </span>
        <h2 className="font-display font-bold text-2xl text-primary">Delivery Address & Instructions</h2>
        <p className="font-body text-sm text-on-surface-variant">
          Where should our delivery partners drop off your fresh meal packages every morning?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
            Flat / Building / House No & Street
          </label>
          <input
            type="text"
            value={addressLine1}
            onChange={(e) => setAddressLine1(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
            required
          />
        </div>

        <div>
          <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
            Area / Landmark (Optional)
          </label>
          <input
            type="text"
            value={addressLine2}
            onChange={(e) => setAddressLine2(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">Pincode</label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
            Special Delivery Instructions
          </label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-primary hover:bg-primary-container text-white font-label text-sm py-3.5 rounded-full font-bold shadow-ambient transition-all"
        >
          {saving ? 'Saving...' : 'Complete Setup & Go to Dashboard &rarr;'}
        </button>
      </form>
    </div>
  );
};
