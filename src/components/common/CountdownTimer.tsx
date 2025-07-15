import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CountdownTimerProps {
  targetDate: string | Date;
  onExpire?: () => void;
  showDays?: boolean;
  showHours?: boolean;
  showMinutes?: boolean;
  showSeconds?: boolean;
  variant?: 'default' | 'warning' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onExpire,
  showDays = true,
  showHours = true,
  showMinutes = true,
  showSeconds = true,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    total: 0,
  });

  const [hasExpired, setHasExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({
          days,
          hours,
          minutes,
          seconds,
          total: difference,
        });
        setHasExpired(false);
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          total: 0,
        });
        if (!hasExpired) {
          setHasExpired(true);
          onExpire?.();
        }
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate, onExpire, hasExpired]);

  const getVariantClasses = () => {
    if (hasExpired) {
      return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
    }

    // Auto-determine variant based on time left
    const daysLeft = timeLeft.days;
    if (daysLeft <= 1) {
      return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
    } else if (daysLeft <= 3) {
      return 'text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20';
    }

    switch (variant) {
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20';
      case 'danger':
        return 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20';
      case 'success':
        return 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20';
      default:
        return 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-1';
      case 'lg':
        return 'text-lg px-4 py-3';
      default:
        return 'text-sm px-3 py-2';
    }
  };

  const getNumberSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm';
      case 'lg':
        return 'text-2xl';
      default:
        return 'text-lg';
    }
  };

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  const timeUnits = [
    { value: timeLeft.days, label: 'days', show: showDays },
    { value: timeLeft.hours, label: 'hours', show: showHours },
    { value: timeLeft.minutes, label: 'minutes', show: showMinutes },
    { value: timeLeft.seconds, label: 'seconds', show: showSeconds },
  ].filter(unit => unit.show);

  if (hasExpired) {
    return (
      <div className={`inline-flex items-center rounded-md border ${getVariantClasses()} ${getSizeClasses()} ${className}`}>
        <AlertTriangle className="h-4 w-4 mr-2" />
        <span className="font-medium">Expired</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center rounded-md border ${getVariantClasses()} ${getSizeClasses()} ${className}`}>
      <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
      <div className="flex items-center space-x-1">
        {timeUnits.map((unit, index) => (
          <React.Fragment key={unit.label}>
            <div className="text-center">
              <div className={`font-bold ${getNumberSizeClasses()}`}>
                {formatNumber(unit.value)}
              </div>
              <div className="text-xs opacity-75">
                {unit.label}
              </div>
            </div>
            {index < timeUnits.length - 1 && (
              <div className={`font-bold ${getNumberSizeClasses()} opacity-50`}>:</div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
