export interface User {
  id: string;
  phoneNumber: string;
  fullName?: string;
  email?: string;
  role: 'user' | 'admin';
  credits: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  hasAddress: boolean;
  hasActiveSubscription: boolean;
}
