import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, LogIn, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import OTPInput from '../components/forms/OTPInput';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, verifyEmail, resendVerificationOTP } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{email?: string; password?: string}>({});
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [verificationEmail, setVerificationEmail] = useState('');
  
  // Get redirect path from location state or default to dashboard
  const from = location.state?.from?.pathname || '/dashboard';
  
  // Get success message from state (from password reset)
  const successMessage = location.state?.message;
  
  const validateForm = () => {
    const errors: {email?: string; password?: string} = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      await login(email, password);
      
      // Redirect to the page they tried to visit or dashboard
      navigate(from, { replace: true });
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'requiresVerification' in err) {
        const errorWithVerification = err as { requiresVerification: boolean; email?: string };
        setVerificationEmail(errorWithVerification.email || email);
        setStep('verify');
      } else {
        const errorMessage = (err instanceof Error) ? err.message : 'Login failed';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      setError(null);
      await verifyEmail(verificationEmail, otp);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError(null);
      await resendVerificationOTP(verificationEmail);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setError(null);
  };

  if (step === 'verify') {
    return (
      <OTPInput
        email={verificationEmail}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onBack={handleBackToLogin}
        title="Verify Your Email"
        description="Please verify your email before logging in."
        loading={loading}
        error={error}
      />
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <ShoppingBag className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Sign in to BulkBuy
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Or{' '}
          <Link to="/register" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
            create a new account
          </Link>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {successMessage && (
            <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 dark:border-green-400 text-green-700 dark:text-green-300">
              <p>{successMessage}</p>
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (validationErrors.email) {
                  setValidationErrors(prev => ({...prev, email: undefined}));
                }
              }}
              autoComplete="email"
              required
              fullWidth
              error={validationErrors.email}
            />
            
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (validationErrors.password) {
                    setValidationErrors(prev => ({...prev, password: undefined}));
                  }
                }}
                autoComplete="current-password"
                required
                fullWidth
                error={validationErrors.password}
              />
              <button
                type="button"
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link 
                  to="/forgot-password" 
                  className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                leftIcon={<LogIn size={18} />}
              >
                Sign in
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  For demo purposes
                </span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-1 gap-3">
              <button
                type="button"
                onClick={() => {
                  setEmail('john@example.com');
                  setPassword('password');
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Use demo account: John
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setEmail('jane@example.com');
                  setPassword('password');
                }}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Use demo account: Jane
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;