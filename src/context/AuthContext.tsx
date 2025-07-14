import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getCurrentUser, loginUser, logoutUser, registerUser } from '../utils/storage';
import { apiCall, API_ENDPOINTS, checkBackendHealth } from '../utils/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<{ requiresVerification?: boolean; userId?: string; email?: string }>;
  verifyEmail: (email: string, otp: string) => Promise<void>;
  resendVerificationOTP: (email: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  verifyResetOTP: (email: string, otp: string) => Promise<{ resetToken: string }>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  isBackendAvailable: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBackendAvailable, setIsBackendAvailable] = useState(false);
  const { success, error: showError } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if backend is available with timeout
        const backendHealth = await Promise.race([
          checkBackendHealth(),
          new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 5000))
        ]);
        
        setIsBackendAvailable(backendHealth);
        
        if (backendHealth) {
          // Try to get user from backend if token exists
          const token = localStorage.getItem('token');
          if (token) {
            try {
              const userData = await apiCall(API_ENDPOINTS.AUTH.PROFILE);
              setUser(userData.user);
              console.log('User authenticated from backend');
            } catch {
              console.warn('Failed to get user from backend, falling back to local storage');
              localStorage.removeItem('token');
              const storedUser = getCurrentUser();
              if (storedUser) {
                setUser(storedUser);
                console.log('User loaded from local storage');
              }
            }
          }
        } else {
          // Fall back to local storage
          console.log('Backend not available, using local storage');
          const storedUser = getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
            console.log('User loaded from local storage (offline mode)');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Fall back to local storage
        const storedUser = getCurrentUser();
        if (storedUser) {
          setUser(storedUser);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isBackendAvailable) {
        try {
          const response = await apiCall(API_ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          });
          
          localStorage.setItem('token', response.token);
          setUser(response.user);
          success('Login successful', 'Welcome back!');
          return;
        } catch (err) {
          console.warn('Backend login failed, trying local storage');
          if (err instanceof Error && !err.message.includes('NETWORK_ERROR')) {
            throw err; // Re-throw non-network errors
          }
        }
      }
      
      // Fall back to local storage
      const user = loginUser(email, password);
      setUser(user);
      success('Login successful', 'Welcome back! (Offline mode)');
      
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Login failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      if (isBackendAvailable) {
        try {
          const response = await apiCall(API_ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
          });
          
          // If registration requires verification, return the status
          if (response.requiresVerification) {
            return {
              requiresVerification: true,
              userId: response.userId,
              email: response.email
            };
          }
          
          // If registration is complete, set token and user
          if (response.token) {
            localStorage.setItem('token', response.token);
            setUser(response.user);
            success('Registration successful', 'Welcome to BulkBuy!');
          }
          
          return { requiresVerification: false };
        } catch (err: unknown) {
          // If it's a verification required error, throw it with the data
          if (err && typeof err === 'object' && 'requiresVerification' in err) {
            throw err;
          }
          console.warn('Backend registration failed, trying local storage');
          if (err instanceof Error && !err.message.includes('NETWORK_ERROR')) {
            throw err; // Re-throw non-network errors
          }
        }
      }
      
      // Fall back to local storage
      const user = registerUser(name, email, password);
      setUser(user);
      success('Registration successful', 'Welcome to BulkBuy! (Offline mode)');
      return { requiresVerification: false };
      
    } catch (err) {
      const errorMessage = (err instanceof Error) ? err.message : 'Registration failed';
      setError(errorMessage);
      showError('Registration failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyEmail = async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(API_ENDPOINTS.AUTH.VERIFY_EMAIL, {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      
      localStorage.setItem('token', response.token);
      setUser(response.user);
      success('Email verified', 'Your account is now active!');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Verification failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationOTP = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiCall(API_ENDPOINTS.AUTH.RESEND_VERIFICATION_OTP, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      success('Code sent', 'A new verification code has been sent to your email');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Failed to send code', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiCall(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      
      success('Reset code sent', 'Check your email for the password reset code');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Failed to send reset code', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyResetOTP = async (email: string, otp: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(API_ENDPOINTS.AUTH.VERIFY_RESET_OTP, {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      
      return { resetToken: response.resetToken };
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Invalid code', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string, otp: string, newPassword: string) => {
    try {
      setLoading(true);
      setError(null);
      
      await apiCall(API_ENDPOINTS.AUTH.RESET_PASSWORD, {
        method: 'POST',
        body: JSON.stringify({ email, otp, newPassword }),
      });
      
      success('Password reset', 'Your password has been successfully reset');
    } catch (err) {
      const errorMessage = (err as Error).message;
      setError(errorMessage);
      showError('Reset failed', errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    try {
      // Call logout API to set user offline
      apiCall(API_ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST'
      }).catch(err => {
        console.error('Error calling logout API:', err);
      });
      
      logoutUser();
      setUser(null);
      setError(null);
      success('Logged out successfully');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      verifyEmail,
      resendVerificationOTP,
      forgotPassword,
      verifyResetOTP,
      resetPassword,
      logout, 
      error,
      isBackendAvailable 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};