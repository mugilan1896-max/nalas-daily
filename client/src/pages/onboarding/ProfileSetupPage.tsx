import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import API from '../../services/api';

export const ProfileSetupPage: React.FC = () => {
  const { refreshUserData } = useAuth();
  const navigate = useNavigate();

  const [petName, setPetName] = useState<string>('Nala');
  const [petType, setPetType] = useState<string>('dog');
  const [breed, setBreed] = useState<string>('Golden Retriever');
  const [ageYears, setAgeYears] = useState<number>(3);
  const [weightKg, setWeightKg] = useState<number>(24);
  const [selectedDiets, setSelectedDiets] = useState<string[]>(['Grain-Free', 'High Protein']);
  const [saving, setSaving] = useState<boolean>(false);

  const toggleDiet = (diet: string) => {
    if (selectedDiets.includes(diet)) {
      setSelectedDiets(selectedDiets.filter(d => d !== diet));
    } else {
      setSelectedDiets([...selectedDiets, diet]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/users/profile', {
        petName,
        petType,
        breed,
        ageYears: Number(ageYears),
        weightKg: Number(weightKg),
        dietaryPreferences: selectedDiets
      });
      await refreshUserData();
      navigate('/onboarding/address');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to save onboarding profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-8 bg-white p-8 rounded-3xl border border-surface-variant shadow-2xl space-y-6">
      <div className="space-y-2 border-b border-surface-variant pb-4">
        <span className="bg-primary/10 text-primary font-label text-xs font-bold px-3 py-1 rounded-full uppercase">
          Step 1 of 2
        </span>
        <h2 className="font-display font-bold text-2xl text-primary">Onboarding: Profile & Dietary Setup</h2>
        <p className="font-body text-sm text-on-surface-variant">
          Tell us about yourself or your pet so we can tailor fresh meals to your exact health goals.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">
              Member / Pet Name
            </label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
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
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
            >
              <option value="dog">Dog Companion</option>
              <option value="cat">Cat Companion</option>
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
              className="w-full px-4 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">Age (Years)</label>
              <input
                type="number"
                value={ageYears}
                onChange={(e) => setAgeYears(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
              />
            </div>
            <div>
              <label className="block font-label text-xs text-on-surface-variant font-bold mb-1">Weight (Kg)</label>
              <input
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(Number(e.target.value))}
                className="w-full px-3 py-3 rounded-xl border border-outline-variant focus:border-primary focus:outline-none font-body text-sm"
              />
            </div>
          </div>
        </div>

        {/* Dietary preferences pills */}
        <div>
          <label className="block font-label text-xs text-on-surface-variant font-bold mb-2">
            Dietary Preferences & Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {['Grain-Free', 'High Protein', 'Organic', 'Vegetarian', 'Low Calorie', 'Heart Healthy'].map((diet) => {
              const active = selectedDiets.includes(diet);
              return (
                <button
                  type="button"
                  key={diet}
                  onClick={() => toggleDiet(diet)}
                  className={`px-4 py-2 rounded-full font-label text-xs font-bold transition-all ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-variant'
                  }`}
                >
                  {diet} {active ? '✓' : '+'}
                </button>
              );
            })}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-accent hover:opacity-90 text-white font-label text-sm py-3.5 rounded-full font-bold shadow-ambient transition-all"
        >
          {saving ? 'Saving...' : 'Continue to Delivery Address &rarr;'}
        </button>
      </form>
    </div>
  );
};
