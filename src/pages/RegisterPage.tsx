import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import OTPInput from '../components/forms/OTPInput';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, verifyEmail, resendVerificationOTP } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [registrationEmail, setRegistrationEmail] = useState('');
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      // Validate password length
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const result = await register(name, email, password);
      
      if (result.requiresVerification) {
        setRegistrationEmail(result.email || email);
        setStep('verify');
      } else {
        // Redirect to dashboard after successful registration
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'requiresVerification' in err) {
        const errorWithVerification = err as { requiresVerification: boolean; email?: string };
        setRegistrationEmail(errorWithVerification.email || email);
        setStep('verify');
      } else {
        const errorMessage = (err instanceof Error) ? err.message : 'Registration failed';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      setError(null);
      await verifyEmail(registrationEmail, otp);
      navigate('/dashboard');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError(null);
      await resendVerificationOTP(registrationEmail);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleBackToRegister = () => {
    setStep('register');
    setError(null);
  };

  if (step === 'verify') {
    return (
      <OTPInput
        email={registrationEmail}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onBack={handleBackToRegister}
        title="Verify Your Email"
        description="We've sent a 6-digit verification code to your email address."
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
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">
            Sign in
          </Link>
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Full name"
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              fullWidth
            />
            
            <Input
              label="Email address"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              fullWidth
            />
            
            <Input
              label="Password"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
              fullWidth
            />
            
            <Input
              label="Confirm password"
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              required
              fullWidth
            />
            
            <div>
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                leftIcon={<UserPlus size={18} />}
              >
                Create account
              </Button>
            </div>
          </form>
          
          <div className="mt-6">
            <p className="text-center text-xs text-gray-600">
              By creating an account, you agree to the{' '}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;