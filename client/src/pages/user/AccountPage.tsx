import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';

export const AccountPage: React.FC = () => {
  const { profile, refreshUserData, logout } = useAuth();

  const [petName, setPetName] = useState(profile?.petName || '');
  const [petType, setPetType] = useState(profile?.petType || 'dog');
  const [breed, setBreed] = useState(profile?.breed || '');
  const [ageYears, setAgeYears] = useState(profile?.ageYears || 2);
  const [weightKg, setWeightKg] = useState(profile?.weightKg || 15);
  const [saving, setSaving] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/users/profile', {
        petName,
        petType,
        breed,
        ageYears: Number(ageYears),
        weightKg: Number(weightKg)
      });
      await refreshUserData();
      alert('Profile updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-ambient flex justify-between items-center">
        <div>
          <h2 className="font-display font-bold text-2xl text-primary">Account & Profile Settings</h2>
          <p className="font-body text-sm text-on-surface-variant mt-1">
            Manage your personal credentials, pet profile details, and preferences.
          </p>
        </div>
        <button
          onClick={logout}
          className="bg-error/10 text-error hover:bg-error/20 font-label text-xs px-4 py-2 rounded-full font-bold transition-all"
        >
          Sign Out
        </button>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="bg-white p-6 rounded-xl border border-surface-variant shadow-ambient space-y-4">
        <h3 className="font-display font-bold text-lg text-primary border-b border-surface-variant pb-3">
          Member / Pet Profile Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
              Pet / Member Name
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
              required
            />
          </div>

          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
              Category
            </label>
            <select
              value={petType}
              onChange={(e) => setPetType(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
            >
              <option value="dog font-body">Dog</option>
              <option value="cat">Cat</option>
              <option value="human">Human / Self</option>
            </select>
          </div>

          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
              Breed / Type
            </label>
            <input
              type="text"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
            />
          </div>

          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
              Age (Years)
            </label>
            <input
              type="number"
              value={ageYears}
              onChange={(e) => setAgeYears(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
            />
          </div>

          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-lg border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-accent hover:opacity-90 text-white font-label text-sm px-6 py-2.5 rounded-full font-bold shadow-ambient transition-all"
        >
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </form>
    </div>
  );
};
