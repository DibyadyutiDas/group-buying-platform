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

export const sanitizeAltText = (text: string | undefined | null): string => {
  if (!text) return '';

  return text
    .replace(/[<>"'/\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 100);
};

export const sanitizeAvatarUrl = (url?: string): string => {
  const DEFAULT_AVATAR = 'https://i.pravatar.cc/150?img=1';
  if (!url || typeof url !== 'string') return DEFAULT_AVATAR;
  url = url.trim();

  try {
    // Parse URL, only allow absolute HTTPS URLs
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:') return DEFAULT_AVATAR;

    // Only allow certain extensions
    const safeImgExts = /\.(jpg|jpeg|png|gif|webp)$/i;
    if (!safeImgExts.test(parsed.pathname)) return DEFAULT_AVATAR;

    // Block suspicious/unusual content in path/query, fragments, etc.
    if (
      /[\0-\x1F\x7F]/.test(parsed.pathname + parsed.search + parsed.hash) || // Control chars
      parsed.pathname.includes('..') ||                                      // Path traversal
      parsed.search.includes('javascript:') || parsed.hash.includes('javascript:')
    ) {
      return DEFAULT_AVATAR;
    }

    // All checks passed, return sanitized url
    return parsed.toString();
  } catch {
    return DEFAULT_AVATAR;
  }
};