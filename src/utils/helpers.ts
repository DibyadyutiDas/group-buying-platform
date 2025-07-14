export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

// Utility function for conditionally joining classNames
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// Sanitize text content to prevent XSS attacks
export const sanitizeText = (text: string | undefined | null): string => {
  if (!text) return '';
  
  // Remove potentially dangerous characters and HTML tags
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
};

// Sanitize alt text for images specifically
export const sanitizeAltText = (text: string | undefined | null): string => {
  if (!text) return '';
  
  // More restrictive sanitization for alt text
  return text
    .replace(/[<>"'/\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100); // Limit length
};