import { cn } from '../../utils/helpers';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  animate?: boolean;
}

const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  width,
  height,
  animate = true,
}) => {
  const baseClasses = cn(
    'bg-gray-200 dark:bg-gray-700',
    animate && 'animate-pulse',
    variant === 'circular' && 'rounded-full',
    variant === 'rounded' && 'rounded',
    variant === 'rectangular' && 'rounded-sm',
    variant === 'text' && 'rounded-md h-4',
    className
  );

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return <div className={baseClasses} style={style} />;
};

export default Skeleton;
