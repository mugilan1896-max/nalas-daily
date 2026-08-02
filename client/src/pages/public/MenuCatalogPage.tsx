import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import type { Meal } from '../../types/meal';
import { BUSINESS_INFO } from '../../constants/businessInfo';
import { SEOHead } from '../../components/common/SEOHead';
export const MenuCatalogPage: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  const filteredMeals = selectedCategory === 'all'
    ? meals
    : meals.filter((m) => m.category.toLowerCase() === selectedCategory);

  return (
    <>
      <SEOHead title={`Menu | ${BUSINESS_INFO.name}`} description="Explore our fresh, home-cooked daily menu." path="/menu" />
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-margin-mobile md:px-margin-desktop bg-surface-container-low overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="font-display-lg text-display-lg text-primary mb-6">
            Fresh Meals Catalog
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10 max-w-2xl mx-auto">
            Explore our daily rotating selection of wholesome, nutrient-dense breakfast, lunch, and dinner options. Crafted with love and fresh ingredients daily.
          </p>
        </div>
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-fixed/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-secondary-fixed/20 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </section>

      <section className="py-12 px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto w-full">
        {/* Filter Tabs */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex bg-surface-container-high rounded-full p-1 shadow-inner relative overflow-x-auto max-w-full">
            {['all', 'breakfast', 'lunch', 'dinner'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`relative z-10 px-6 py-3 font-label-md text-label-md rounded-full transition-all focus:outline-none capitalize whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'text-primary bg-primary-container/10 font-bold'
                    : 'text-on-surface-variant hover:text-primary'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
            <p className="font-body-md text-body-md text-on-surface-variant mt-4">Loading Menu...</p>
          </div>
        )}

        {/* Meals Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg auto-rows-[300px]">
            {filteredMeals.map((meal) => {
              const tagsArray = meal.tags || [];

              return (
                <div
                  key={meal.id}
                  className="rounded-2xl overflow-hidden relative group shadow-ambient cursor-pointer bg-surface-container-low h-full"
                >
                  <img
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    alt={meal.title}
                    src={meal.image_url}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  
                  {/* Top Badges */}
                  <div className="absolute top-md left-md flex flex-wrap gap-2 pr-md">
                    <span className="bg-surface text-primary border border-primary px-3 py-1 rounded-full font-label-sm text-label-sm capitalize">
                      {meal.category}
                    </span>
                    {tagsArray.slice(0, 1).map((tag, i) => (
                      <span key={i} className="bg-surface/90 text-on-surface border border-outline-variant px-3 py-1 rounded-full font-label-sm text-label-sm">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Bottom Info */}
                  <div className="absolute bottom-0 left-0 w-full p-md flex flex-col justify-end gap-3 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex justify-between items-end">
                      <div className="flex-1 pr-4">
                        <h3 className="font-headline-md text-white text-xl line-clamp-2 leading-tight mb-1">{meal.title}</h3>
                        <div className="flex items-center gap-2 text-white/90 font-label-sm text-[11px] opacity-90">
                          <span>{meal.calories} kcal</span>
                          <span>&bull;</span>
                          <span>{meal.protein_g}g Pro</span>
                        </div>
                      </div>
                      <div className="bg-accent text-white font-bold font-label-md px-4 py-2 rounded-lg whitespace-nowrap">
                        ₹{meal.price}
                      </div>
                    </div>
                    <a 
                      href={`https://wa.me/${BUSINESS_INFO.whatsapp}?text=${encodeURIComponent(`Hello ${BUSINESS_INFO.name}, I would like to order: ${meal.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full text-center bg-[#25D366] text-white font-label-sm font-bold py-2 rounded-full hover:bg-opacity-90 transition-colors shadow-sm mt-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Order on WhatsApp
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMeals.length === 0 && (
          <div className="text-center py-16">
            <span className="material-symbols-outlined text-5xl text-outline-variant">restaurant_menu</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant mt-4">No meals available for this category yet.</p>
          </div>
        )}
      </section>
    </>
  );
};
