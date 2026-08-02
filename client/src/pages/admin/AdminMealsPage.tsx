import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import type { Meal } from '../../types/meal';

export const AdminMealsPage: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('breakfast');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [calories, setCalories] = useState(400);
  const [proteinG, setProteinG] = useState(18);
  const [price, setPrice] = useState(199);

  const fetchMeals = async () => {
    try {
      const res = await API.get('/admin/meals');
      setMeals(res.data.meals || []);
    } catch (err) {
      console.error('Failed to fetch admin meals:', err);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, []);

  const handleAddMeal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await API.post('/admin/meals', {
        title,
        category,
        description,
        imageUrl,
        calories: Number(calories),
        proteinG: Number(proteinG),
        price: Number(price),
        tags: ['Chef Choice', 'Fresh']
      });
      setShowAddModal(false);
      setTitle('');
      setDescription('');
      fetchMeals();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to add meal');
    }
  };

  const handleDeleteMeal = async (id: string) => {
    if (!confirm('Are you sure you want to delete this meal?')) return;
    try {
      await API.delete(`/admin/meals/${id}`);
      fetchMeals();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to delete meal');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-surface-variant shadow-ambient">
        <div>
          <h2 className="font-display font-bold text-2xl text-primary">Meal Catalog Management</h2>
          <p className="font-body text-xs text-on-surface-variant mt-1">Add, update, or remove gourmet meals from the daily customer menu.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accent text-white font-label text-sm px-5 py-2.5 rounded-full font-bold shadow-ambient hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          <span>Add New Meal</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-surface-variant overflow-hidden shadow-ambient">
        <table className="w-full text-left font-label text-sm border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-surface-variant text-on-surface-variant font-bold text-xs uppercase">
              <th className="p-4">Meal Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Calories</th>
              <th className="p-4">Protein</th>
              <th className="p-4">Price</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-variant">
            {meals.map((meal) => (
              <tr key={meal.id} className="hover:bg-surface-container-lowest transition-colors">
                <td className="p-4 flex items-center gap-3">
                  <img src={meal.image_url} alt={meal.title} className="w-10 h-10 rounded-lg object-cover" />
                  <span className="font-bold text-primary">{meal.title}</span>
                </td>
                <td className="p-4 capitalize">{meal.category}</td>
                <td className="p-4">{meal.calories} kcal</td>
                <td className="p-4">{meal.protein_g}g</td>
                <td className="p-4 font-bold text-primary">₹{meal.price}</td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    className="text-error font-bold hover:underline text-xs"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-display font-bold text-xl text-primary border-b border-surface-variant pb-3">Add New Meal to Catalog</h3>
            <form onSubmit={handleAddMeal} className="space-y-3">
              <input
                type="text"
                placeholder="Meal Title (e.g. Organic Quinoa Bowl)"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:outline-none font-body text-sm"
                required
              />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:outline-none font-body text-sm"
              >
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
              <textarea
                placeholder="Meal Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:outline-none font-body text-sm"
                rows={2}
              />
              <input
                type="url"
                placeholder="Image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-outline-variant focus:outline-none font-body text-sm"
              />
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="number"
                  placeholder="Calories"
                  value={calories}
                  onChange={(e) => setCalories(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none font-body text-sm"
                />
                <input
                  type="number"
                  placeholder="Protein (g)"
                  value={proteinG}
                  onChange={(e) => setProteinG(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none font-body text-sm"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-outline-variant focus:outline-none font-body text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-2.5 rounded-full font-label text-sm text-on-surface-variant border border-outline-variant"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full font-label text-sm bg-primary text-white font-bold"
                >
                  Save Meal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
