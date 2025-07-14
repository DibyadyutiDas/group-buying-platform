import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import OTPInput from '../components/forms/OTPInput';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const { forgotPassword, verifyResetOTP, resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<'email' | 'verify' | 'reset'>('email');
  const [resetToken, setResetToken] = useState('');
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      await forgotPassword(email);
      setStep('verify');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      setError(null);
      const result = await verifyResetOTP(email, otp);
      setResetToken(result.resetToken);
      setStep('reset');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleResendOTP = async () => {
    try {
      setError(null);
      await forgotPassword(email);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      if (newPassword !== confirmPassword) {
        throw new Error('Passwords do not match');
      }
      
      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      await resetPassword(email, resetToken, newPassword);
      
      // Redirect to login with success message
      navigate('/login', { 
        state: { message: 'Password reset successfully! Please log in with your new password.' }
      });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setError(null);
  };

  const handleBackToVerify = () => {
    setStep('verify');
    setError(null);
  };

  if (step === 'verify') {
    return (
      <OTPInput
        email={email}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onBack={handleBackToEmail}
        title="Verify Reset Code"
        description="We've sent a 6-digit reset code to your email address."
        loading={loading}
        error={error}
      />
    );
  }

  if (step === 'reset') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <KeyRound className="h-12 w-12 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
            Enter your new password below
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300">
                <p>{error}</p>
              </div>
            )}
            
            <form className="space-y-6" onSubmit={handlePasswordReset}>
              <Input
                label="New password"
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
                required
                fullWidth
              />
              
              <Input
                label="Confirm new password"
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
                fullWidth
              />
              
              <div className="space-y-4">
                <Button
                  type="submit"
                  fullWidth
                  isLoading={loading}
                  leftIcon={<KeyRound size={18} />}
                >
                  Reset Password
                </Button>

                <button
                  type="button"
                  onClick={handleBackToVerify}
                  className="w-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to verification
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Mail className="h-12 w-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          Forgot your password?
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          Enter your email address and we'll send you a reset code
        </p>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleEmailSubmit}>
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
            
            <div className="space-y-4">
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                leftIcon={<Mail size={18} />}
              >
                Send Reset Code
              </Button>

              <Link
                to="/login"
                className="w-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
