export interface SubscriptionPlan {
  id: string;
  name: string;
  code: string;
  description: string;
  price_per_day: number;
  meals_per_day: number;
  duration_days: number;
  credits_included: number;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  plan_id: string;
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  start_date: string;
  end_date: string;
  renewal_date?: string;
  mealTypes: string[];
  planDetails?: SubscriptionPlan;
  userCredits?: number;
}

export interface WeeklySelection {
  id: string;
  user_id: string;
  subscription_id: string;
  week_start_date: string;
  day_of_week: string;
  meal_type: string;
  meal_id: string;
  meal_title: string;
  meal_category: string;
  meal_image_url: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  meal_price: number;
  status: 'scheduled' | 'delivered' | 'skipped';
}
