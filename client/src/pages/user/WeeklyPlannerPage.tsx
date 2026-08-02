import React, { useEffect, useState } from 'react';
import API from '../../services/api';
import type { Meal } from '../../types/meal';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

type MealTypeKey = 'breakfast' | 'lunch' | 'dinner';

interface Selection {
  id: string;
  day_of_week: string;
  meal_type: string;
  meal_id: string | null;
  status: string;
  meal_title?: string;
  meal_category?: string;
  meal_image_url?: string;
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  meal_price?: number;
}

interface WeeklyData {
  weekStartDate: string;
  hasSubscription: boolean;
  activeSubMealTypes: string[];
  summary: {
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFat: number;
    selectedCount: number;
  };
  selections: Selection[];
}

export const WeeklyPlannerPage: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('monday');
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
  const [availableMeals, setAvailableMeals] = useState<Meal[]>([]);
  const [activeMealTypeModal, setActiveMealTypeModal] = useState<MealTypeKey | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchPlanAndMeals = async () => {
    try {
      const [planRes, mealsRes] = await Promise.all([
        API.get('/planner'),
        API.get('/meals')
      ]);
      setWeeklyData(planRes.data);
      setAvailableMeals(mealsRes.data.meals || []);
    } catch (err) {
      console.error('Failed to load planner:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanAndMeals();
  }, []);

  const allowedMealTypes: MealTypeKey[] = (weeklyData?.activeSubMealTypes || ['breakfast', 'lunch', 'dinner']) as MealTypeKey[];

  const handleSelectMeal = async (mealId: string) => {
    if (!activeMealTypeModal) return;
    setActionLoading(`select-${mealId}`);
    try {
      await API.post('/planner/select', {
        dayOfWeek: selectedDay,
        mealType: activeMealTypeModal,
        mealId
      });
      setActiveMealTypeModal(null);
      await fetchPlanAndMeals();
      showToast('Meal saved as draft');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to select meal', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSkipMeal = async (mealType: MealTypeKey) => {
    setActionLoading(`skip-${selectedDay}-${mealType}`);
    try {
      await API.post('/planner/skip', {
        dayOfWeek: selectedDay,
        mealType
      });
      await fetchPlanAndMeals();
      showToast(`${mealType} skipped for ${selectedDay}`);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to skip meal', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePauseDay = async () => {
    setActionLoading(`pause-${selectedDay}`);
    try {
      await API.post('/planner/pause-day', {
        dayOfWeek: selectedDay
      });
      await fetchPlanAndMeals();
      showToast(`${selectedDay} paused — no deliveries`);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to pause day', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAutoFill = async () => {
    setActionLoading('auto-fill');
    try {
      await API.post('/planner/auto-fill', {});
      await fetchPlanAndMeals();
      showToast('Plan auto-filled!');
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to auto-fill plan', 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmWeek = async () => {
    setConfirmLoading(true);
    try {
      const res = await API.post('/planner/confirm', {});
      await fetchPlanAndMeals();
      showToast(`Week confirmed! ${res.data.confirmedCount} meals scheduled.`);
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to confirm week', 'error');
    } finally {
      setConfirmLoading(false);
    }
  };

  const daySelections = weeklyData?.selections?.filter(
    (s) => s.day_of_week.toLowerCase() === selectedDay
  ) || [];

  const getMealForType = (type: string): Selection | undefined => {
    return daySelections.find((s) => s.meal_type.toLowerCase() === type);
  };

  // Check if any day is fully paused
  const isDayPaused = allowedMealTypes.every(type => {
    const sel = getMealForType(type);
    return sel?.status === 'paused';
  });

  // Count drafts across the whole week
  const draftCount = weeklyData?.selections?.filter(s => s.status === 'draft').length || 0;

  // Count total filled (not empty) slots
  const filledSlots = weeklyData?.selections?.length || 0;
  const totalSlots = DAYS.length * allowedMealTypes.length;

  const getMealTypeIcon = (type: string) => {
    switch (type) {
      case 'breakfast': return 'wb_sunny';
      case 'lunch': return 'light_mode';
      case 'dinner': return 'dark_mode';
      default: return 'restaurant';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'draft':
        return { label: 'Draft', bg: 'bg-amber-100', text: 'text-amber-700', icon: 'edit_note' };
      case 'scheduled':
        return { label: 'Confirmed', bg: 'bg-green-100', text: 'text-green-700', icon: 'check_circle' };
      case 'skipped':
        return { label: 'Skipped', bg: 'bg-slate-100', text: 'text-slate-500', icon: 'block' };
      case 'paused':
        return { label: 'Paused', bg: 'bg-orange-100', text: 'text-orange-600', icon: 'pause_circle' };
      default:
        return { label: status, bg: 'bg-slate-100', text: 'text-slate-500', icon: 'info' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
          <p className="font-body text-sm text-on-surface-variant mt-4">Loading your meal planner...</p>
        </div>
      </div>
    );
  }

  if (!weeklyData?.hasSubscription) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center max-w-md mx-auto">
          <span className="material-symbols-outlined text-6xl text-outline-variant">no_meals</span>
          <h2 className="font-display font-bold text-xl text-primary mt-4">No Active Subscription</h2>
          <p className="font-body text-sm text-on-surface-variant mt-2">
            You need an active meal plan to use the weekly planner. Subscribe to a plan to get started!
          </p>
          <a href="/plans" className="inline-block mt-6 bg-primary text-white font-label text-sm px-6 py-3 rounded-full hover:bg-primary/90 transition-colors">
            Browse Plans
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-[slideIn_0.3s_ease-out] ${
          toast.type === 'success' ? 'bg-green-600 text-white' :
          toast.type === 'error' ? 'bg-red-600 text-white' :
          'bg-primary text-white'
        }`}>
          <span className="material-symbols-outlined text-lg">
            {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
          </span>
          <span className="font-label text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-br from-primary/5 via-surface-container-lowest to-accent/5 p-6 rounded-2xl border border-surface-variant shadow-ambient">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-accent">calendar_month</span>
              Weekly Meal Planner
            </h2>
            <p className="font-body text-sm text-on-surface-variant mt-1">
              Plan your {allowedMealTypes.join(', ')} for the week. Freshly prepared and delivered on time.
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleAutoFill}
              disabled={actionLoading === 'auto-fill'}
              className="bg-white text-primary border border-primary font-label text-sm px-4 py-2.5 rounded-full hover:bg-primary/5 transition-colors shadow-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span>{actionLoading === 'auto-fill' ? 'Filling...' : 'Auto-Fill'}</span>
            </button>
            {draftCount > 0 && (
              <button
                onClick={handleConfirmWeek}
                disabled={confirmLoading}
                className="bg-accent text-white font-label text-sm px-5 py-2.5 rounded-full hover:bg-accent/90 transition-colors shadow-md font-bold flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-sm">
                  {confirmLoading ? 'progress_activity' : 'check_circle'}
                </span>
                <span>{confirmLoading ? 'Confirming...' : `Confirm Week (${draftCount})`}</span>
              </button>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-label text-xs text-on-surface-variant font-semibold">Week Progress</span>
            <span className="font-label text-xs text-primary font-bold">{filledSlots} / {totalSlots} slots filled</span>
          </div>
          <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500"
              style={{ width: `${totalSlots > 0 ? (filledSlots / totalSlots) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Nutrient Summary */}
      {weeklyData?.summary && weeklyData.summary.selectedCount > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-xl border border-surface-variant shadow-ambient-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-base">local_fire_department</span>
              <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">Calories</span>
            </div>
            <p className="font-display text-xl font-bold text-primary">{weeklyData.summary.totalCalories} <span className="text-sm font-normal text-on-surface-variant">kcal</span></p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-surface-variant shadow-ambient-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-accent text-base">fitness_center</span>
              <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">Protein</span>
            </div>
            <p className="font-display text-xl font-bold text-accent">{weeklyData.summary.totalProtein.toFixed(1)} <span className="text-sm font-normal text-on-surface-variant">g</span></p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-surface-variant shadow-ambient-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-secondary text-base">grain</span>
              <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">Carbs</span>
            </div>
            <p className="font-display text-xl font-bold text-secondary">{weeklyData.summary.totalCarbs.toFixed(1)} <span className="text-sm font-normal text-on-surface-variant">g</span></p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-surface-variant shadow-ambient-sm">
            <div className="flex items-center gap-2 mb-1">
              <span className="material-symbols-outlined text-primary text-base">water_drop</span>
              <span className="font-label text-xs text-on-surface-variant uppercase font-semibold">Fats</span>
            </div>
            <p className="font-display text-xl font-bold text-primary">{weeklyData.summary.totalFat.toFixed(1)} <span className="text-sm font-normal text-on-surface-variant">g</span></p>
          </div>
        </div>
      )}

      {/* Day Selector Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {DAYS.map((day) => {
          const isSelected = selectedDay === day;
          const daySlots = weeklyData?.selections?.filter(s => s.day_of_week.toLowerCase() === day) || [];
          const dayFilled = daySlots.filter(s => s.meal_id).length;
          const dayPaused = daySlots.every(s => s.status === 'paused') && daySlots.length > 0;

          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`relative capitalize px-5 py-3 rounded-xl font-label text-sm font-semibold transition-all whitespace-nowrap flex flex-col items-center gap-1 min-w-[90px] ${
                isSelected
                  ? 'bg-primary text-white shadow-ambient'
                  : dayPaused
                  ? 'bg-orange-50 text-orange-400 border border-orange-200'
                  : 'bg-white text-on-surface-variant border border-surface-variant hover:bg-surface-container-low'
              }`}
            >
              <span>{day.slice(0, 3)}</span>
              <span className={`text-[10px] font-normal ${isSelected ? 'text-white/70' : 'text-on-surface-variant'}`}>
                {dayPaused ? 'Paused' : `${dayFilled}/${allowedMealTypes.length}`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Day Header with Pause Button */}
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-lg text-primary capitalize flex items-center gap-2">
          <span className="material-symbols-outlined text-accent">today</span>
          {selectedDay}'s Meals
        </h3>
        <button
          onClick={handlePauseDay}
          disabled={isDayPaused || actionLoading === `pause-${selectedDay}`}
          className={`font-label text-xs px-4 py-2 rounded-full font-bold flex items-center gap-1.5 transition-colors ${
            isDayPaused
              ? 'bg-orange-100 text-orange-500 cursor-not-allowed'
              : 'bg-white text-orange-600 border border-orange-300 hover:bg-orange-50'
          } disabled:opacity-60`}
        >
          <span className="material-symbols-outlined text-sm">pause_circle</span>
          {isDayPaused ? 'Day Paused' : actionLoading === `pause-${selectedDay}` ? 'Pausing...' : 'Pause Day'}
        </button>
      </div>

      {/* Meal Slots for Selected Day */}
      <div className={`grid grid-cols-1 ${allowedMealTypes.length >= 3 ? 'md:grid-cols-3' : allowedMealTypes.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-1 max-w-md'} gap-6`}>
        {allowedMealTypes.map((mealType) => {
          const selection = getMealForType(mealType);
          const status = selection?.status;
          const isSkipped = status === 'skipped';
          const isPaused = status === 'paused';
          const hasMeal = selection && selection.meal_id && !isSkipped && !isPaused;
          const statusBadge = status ? getStatusBadge(status) : null;

          return (
            <div
              key={mealType}
              className={`rounded-2xl border p-5 flex flex-col justify-between h-full transition-all ${
                isPaused ? 'bg-orange-50/50 border-orange-200' :
                isSkipped ? 'bg-slate-50/50 border-slate-200' :
                hasMeal && status === 'draft' ? 'bg-amber-50/30 border-amber-200 shadow-ambient' :
                hasMeal && status === 'scheduled' ? 'bg-green-50/30 border-green-200 shadow-ambient' :
                'bg-white border-surface-variant shadow-ambient'
              }`}
            >
              <div>
                {/* Meal Type Header */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      mealType === 'breakfast' ? 'bg-amber-100 text-amber-600' :
                      mealType === 'lunch' ? 'bg-blue-100 text-blue-600' :
                      'bg-indigo-100 text-indigo-600'
                    }`}>
                      <span className="material-symbols-outlined text-lg">{getMealTypeIcon(mealType)}</span>
                    </div>
                    <span className="font-label text-sm uppercase font-bold tracking-wider text-on-surface capitalize">
                      {mealType}
                    </span>
                  </div>
                  {statusBadge && (
                    <span className={`${statusBadge.bg} ${statusBadge.text} font-label text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1`}>
                      <span className="material-symbols-outlined text-xs">{statusBadge.icon}</span>
                      {statusBadge.label}
                    </span>
                  )}
                </div>

                {/* Content Area */}
                {hasMeal ? (
                  <div className="space-y-3">
                    <div className="relative rounded-xl overflow-hidden">
                      <img
                        src={selection.meal_image_url}
                        alt={selection.meal_title}
                        className="w-full h-40 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    <h3 className="font-display text-lg font-bold text-primary">{selection.meal_title}</h3>
                    <div className="flex items-center gap-3 text-xs font-label text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-accent">local_fire_department</span>
                        {selection.calories} kcal
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-xs text-primary">fitness_center</span>
                        {selection.protein_g}g Protein
                      </span>
                    </div>
                  </div>
                ) : isSkipped ? (
                  <div className="h-44 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center p-4 text-center gap-2 bg-slate-50">
                    <span className="material-symbols-outlined text-3xl text-slate-400">block</span>
                    <p className="font-label text-sm text-slate-500 font-semibold">Meal Skipped</p>
                    <p className="font-body text-xs text-slate-400">No delivery for this slot</p>
                  </div>
                ) : isPaused ? (
                  <div className="h-44 border-2 border-dashed border-orange-200 rounded-xl flex flex-col items-center justify-center p-4 text-center gap-2 bg-orange-50">
                    <span className="material-symbols-outlined text-3xl text-orange-400">pause_circle</span>
                    <p className="font-label text-sm text-orange-500 font-semibold">Day Paused</p>
                    <p className="font-body text-xs text-orange-400">Resume to select meals</p>
                  </div>
                ) : (
                  <div className="h-44 border-2 border-dashed border-outline-variant rounded-xl flex flex-col items-center justify-center p-4 text-center gap-2">
                    <span className="material-symbols-outlined text-3xl text-on-surface-variant">restaurant_menu</span>
                    <p className="font-label text-sm text-on-surface-variant">Choose your {mealType}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5 flex gap-2">
                <button
                  onClick={() => setActiveMealTypeModal(mealType)}
                  className="flex-1 border border-primary text-primary hover:bg-primary hover:text-white font-label text-sm py-2.5 rounded-full transition-all font-bold flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">{hasMeal ? 'swap_horiz' : 'add'}</span>
                  {hasMeal ? 'Change' : 'Choose'}
                </button>
                {!isSkipped && (
                  <button
                    onClick={() => handleSkipMeal(mealType)}
                    disabled={actionLoading === `skip-${selectedDay}-${mealType}`}
                    className="px-4 py-2.5 rounded-full border border-slate-300 text-slate-500 hover:bg-slate-100 font-label text-sm font-bold transition-all flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">block</span>
                    Skip
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Meal Selection Modal */}
      {activeMealTypeModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setActiveMealTypeModal(null)}>
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center border-b border-surface-variant pb-4">
              <div>
                <h3 className="font-display text-xl font-bold text-primary capitalize">
                  Select {activeMealTypeModal}
                </h3>
                <p className="font-body text-xs text-on-surface-variant mt-1 capitalize">for {selectedDay}</p>
              </div>
              <button
                onClick={() => setActiveMealTypeModal(null)}
                className="text-on-surface-variant hover:text-primary p-2 rounded-full hover:bg-surface-container-low transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableMeals
                .filter((m) => m.category === activeMealTypeModal)
                .map((meal) => (
                  <div
                    key={meal.id}
                    className="border border-surface-variant rounded-xl overflow-hidden hover:border-primary transition-all flex flex-col justify-between bg-white group hover:shadow-lg"
                  >
                    <div className="relative">
                      <img
                        src={meal.image_url}
                        alt={meal.title}
                        className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                    <div className="p-3">
                      <h4 className="font-display font-bold text-base text-primary">{meal.title}</h4>
                      <p className="font-body text-xs text-on-surface-variant line-clamp-2 mt-1">
                        {meal.description}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs font-label text-primary font-semibold">
                        <span>{meal.calories} kcal</span>
                        <span>•</span>
                        <span>{meal.protein_g}g Protein</span>
                      </div>
                    </div>

                    <div className="px-3 pb-3">
                      <button
                        onClick={() => handleSelectMeal(meal.id)}
                        disabled={actionLoading === `select-${meal.id}`}
                        className="w-full bg-accent hover:bg-accent/90 text-white font-label text-xs py-2.5 rounded-lg font-bold transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-1.5"
                      >
                        {actionLoading === `select-${meal.id}` ? (
                          <>
                            <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                            Selecting...
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-sm">check</span>
                            Select This Meal
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {availableMeals.filter((m) => m.category === activeMealTypeModal).length === 0 && (
              <div className="text-center py-8">
                <span className="material-symbols-outlined text-4xl text-outline-variant">no_food</span>
                <p className="font-body text-sm text-on-surface-variant mt-2">No meals available for {activeMealTypeModal}.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
