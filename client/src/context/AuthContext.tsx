import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import type { User } from '../types/auth';
import type { Profile, Address } from '../types/user';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  address: Address | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasProfile: boolean;
  hasAddress: boolean;
  hasActiveSubscription: boolean;
  sendOtp: (phoneNumber: string) => Promise<{ otpCode: string }>;
  verifyOtp: (phoneNumber: string, otpCode: string) => Promise<void>;
  registerEmail: (data: any) => Promise<void>;
  loginEmail: (data: any) => Promise<void>;
  logout: () => void;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('nalas_daily_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false);

  const refreshUserData = async () => {
    try {
      if (!localStorage.getItem('nalas_daily_token')) {
        setIsLoading(false);
        return;
      }
      const res = await API.get('/auth/me');
      setUser(res.data.user);
      setProfile(res.data.profile);
      setAddress(res.data.address);
      setHasActiveSubscription(res.data.hasActiveSubscription);
    } catch (err) {
      console.error('Failed to fetch user context:', err);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserData();
  }, []);

  const sendOtp = async (phoneNumber: string) => {
    const res = await API.post('/auth/send-otp', { phoneNumber });
    return { otpCode: res.data.otpCode };
  };

  const verifyOtp = async (phoneNumber: string, otpCode: string) => {
    const res = await API.post('/auth/verify-otp', { phoneNumber, otpCode });
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('nalas_daily_token', newToken);
    setToken(newToken);
    setUser(userData);
    await refreshUserData();
  };

  const registerEmail = async (data: any) => {
    const res = await API.post('/auth/register', data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('nalas_daily_token', newToken);
    setToken(newToken);
    setUser(userData);
    await refreshUserData();
  };

  const loginEmail = async (data: any) => {
    const res = await API.post('/auth/login-email', data);
    const { token: newToken, user: userData } = res.data;
    localStorage.setItem('nalas_daily_token', newToken);
    setToken(newToken);
    setUser(userData);
    await refreshUserData();
  };

  const logout = () => {
    localStorage.removeItem('nalas_daily_token');
    setToken(null);
    setUser(null);
    setProfile(null);
    setAddress(null);
    setHasActiveSubscription(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        address,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        hasProfile: !!profile,
        hasAddress: !!address,
        hasActiveSubscription,
        sendOtp,
        verifyOtp,
        registerEmail,
        loginEmail,
        logout,
        refreshUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
