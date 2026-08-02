export interface Profile {
  id: string;
  userId: string;
  petName: string;
  petType: string;
  breed?: string;
  ageYears?: number;
  weightKg?: number;
  dietaryPreferences: string[];
  allergies: string[];
}

export interface Address {
  id: string;
  userId: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  pincode: string;
  delivery_instructions?: string;
  is_default: number;
}
