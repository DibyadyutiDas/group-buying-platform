import React, { useState, useRef, useEffect } from 'react';
import { Mail, ArrowLeft, RotateCcw } from 'lucide-react';
import Button from '../common/Button';

interface OTPInputProps {
  email: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onBack: () => void;
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string | null;
}

const OTPInput: React.FC<OTPInputProps> = ({
  email,
  onVerify,
  onResend,
  onBack,
  title = "Verify Your Email",
  description = "We've sent a 6-digit verification code to your email address.",
  loading = false,
  error = null
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Auto-focus first input
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtp(newOtp);
      
      // Focus last filled input or next empty
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (!/^\d*$/.test(value)) return; // Only allow digits

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
      await onVerify(otpString);
    }
  };

  const handleResend = async () => {
    try {
      setResendLoading(true);
      await onResend();
      setResendTimer(60); // 60 second cooldown
    } catch (error) {
      console.error('Resend failed:', error);
    } finally {
      setResendLoading(false);
    }
  };

  const otpString = otp.join('');
  const isComplete = otpString.length === 6;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
          {description}
        </p>
        <p className="mt-1 text-center text-sm font-medium text-blue-600 dark:text-blue-400">
          {email}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-400 text-red-700 dark:text-red-300">
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Enter verification code
              </label>
              <div className="flex space-x-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 dark:border-gray-600 rounded-lg
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400
                             transition-colors duration-200"
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                disabled={!isComplete}
              >
                Verify Code
              </Button>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={onBack}
                  className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  disabled={loading}
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendTimer > 0 || resendLoading || loading}
                  className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 
                           disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  <RotateCcw className={`w-4 h-4 mr-1 ${resendLoading ? 'animate-spin' : ''}`} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                </button>
              </div>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Didn't receive the code? Check your spam folder or try resending.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPInput;
