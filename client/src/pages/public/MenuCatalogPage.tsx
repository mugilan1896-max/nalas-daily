import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import type { Meal } from '../../types/meal';
import { BUSINESS_INFO } from '../../constants/businessInfo';
import { SEOHead } from '../../components/common/SEOHead';

export const MenuCatalogPage: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [animating, setAnimating] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await API.get('/meals');
        setMeals(res.data.meals || []);
      } catch (err) {
        console.error('Failed to fetch menu:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []);

  const handleCategoryChange = (cat: string) => {
    if (cat === selectedCategory) return;
    setAnimating(true);
    setTimeout(() => {
      setSelectedCategory(cat);
      setAnimating(false);
    }, 250);
  };

  const filteredMeals = selectedCategory === 'all'
    ? meals
    : meals.filter((m) => m.category.toLowerCase() === selectedCategory);

  return (
    <>
      <SEOHead title={`Menu | ${BUSINESS_INFO.name}`} description="Explore our fresh, home-cooked daily menu." path="/menu" />
      <section className="relative pt-20 pb-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-display-lg text-display-lg text-primary mb-6">Our Daily Menu</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            A rotating selection of wholesome, home-cooked meals. Fresh ingredients, crafted with love every single day.
          </p>
        </div>
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </section>

      <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full">
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-surface-container-high rounded-full p-1 shadow-inner relative overflow-x-auto max-w-full">
            {['all', 'breakfast', 'lunch', 'dinner'].map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`relative z-10 px-6 py-3 font-label-md text-label-md rounded-full transition-all duration-300 focus:outline-none capitalize whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-primary text-white shadow-md scale-105 font-bold'
                    : 'text-on-surface-variant hover:text-primary hover:bg-primary/5'
                }`}
              >
                {cat === 'all' ? 'All' : cat === 'breakfast' ? 'Breakfast' : cat === 'lunch' ? 'Lunch' : 'Dinner'}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-4">Loading Menu...</p>
          </div>
        )}

        {!loading && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg auto-rows-[280px]"
            style={{ opacity: animating ? 0 : 1, transform: animating ? 'translateY(12px)' : 'translateY(0)', transition: 'opacity 0.25s ease, transform 0.25s ease' }}
          >
            {filteredMeals.map((meal, index) => {
              const tagsArray = meal.tags || [];
              return (
                <div
                  key={meal.id}
                  className="rounded-2xl overflow-hidden relative group shadow-ambient cursor-pointer bg-surface-container-low h-full"
                  style={{ animation: 'menuFadeIn 0.4s ease both', animationDelay: `${index * 50}ms` }}
                >
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={meal.title} src={meal.image_url} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent"></div>

                  <div className="absolute top-md left-md flex flex-wrap gap-2 pr-md">
                    <span className="bg-surface text-primary border border-primary px-3 py-1 rounded-full font-label-sm text-label-sm capitalize">{meal.category}</span>
                    {tagsArray.slice(0, 1).map((tag, i) => (
                      <span key={i} className="bg-surface/90 text-on-surface border border-outline-variant px-3 py-1 rounded-full font-label-sm text-label-sm">{tag}</span>
                    ))}
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                    <h3 className="font-headline-md text-white text-xl line-clamp-2 leading-tight">{meal.title}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && filteredMeals.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-outline-variant">restaurant_menu</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">No meals available for this category yet.</p>
          </div>
        )}

        <style>{`
          @keyframes menuFadeIn {
            from { opacity: 0; transform: translateY(16px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </section>
    </>
  );
};
