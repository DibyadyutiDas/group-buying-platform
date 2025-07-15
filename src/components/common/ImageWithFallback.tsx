import React, { useState, useRef } from 'react';
import { ImageIcon, ZoomIn } from 'lucide-react';
import { sanitizeAltText } from '../../utils/helpers';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  enableZoom?: boolean;
  lazy?: boolean;
  category?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackSrc,
  enableZoom = false,
  lazy = true,
  category,
}) => {
  // Generate category-specific fallback images
  const getCategoryFallback = (category?: string) => {
    const fallbacks = {
      electronics: 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      clothing: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      books: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      home: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      sports: 'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
      other: 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    };
    
    return fallbacks[category as keyof typeof fallbacks] || fallbacks.other;
  };

  const defaultFallback = fallbackSrc || getCategoryFallback(category);
  const [imgSrc, setImgSrc] = useState(src || defaultFallback);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleError = () => {
    if (imgSrc !== defaultFallback) {
      setImgSrc(defaultFallback);
    } else {
      setIsError(true);
    }
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setIsError(false);
  };

  const handleMouseEnter = () => {
    if (enableZoom) setIsZoomed(true);
  };

  const handleMouseLeave = () => {
    if (enableZoom) setIsZoomed(false);
  };

  if (isError) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 dark:bg-gray-700 ${className}`}>
        <div className="text-center text-gray-500 dark:text-gray-400">
          <ImageIcon className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">Image not available</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className} ${enableZoom ? 'cursor-zoom-in' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
          <div className="text-gray-400 dark:text-gray-500">
            <ImageIcon className="h-8 w-8" />
          </div>
        </div>
      )}
      
      <img
        ref={imgRef}
        src={imgSrc}
        alt={sanitizeAltText(alt)}
        className={`w-full h-full object-cover transition-transform duration-300 ${
          isZoomed ? 'scale-110' : 'scale-100'
        } ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={handleError}
        onLoad={handleLoad}
        loading={lazy ? 'lazy' : 'eager'}
      />
      
      {enableZoom && !isLoading && (
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="h-4 w-4" />
        </div>
      )}
    </div>
  );
};

export default ImageWithFallback;