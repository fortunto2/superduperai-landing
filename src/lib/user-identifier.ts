'use client';

/**
 * Utility for managing user identifiers across analytics services
 * Prevents duplicating user IDs in Google Analytics and Microsoft Clarity
 */

// UUID generation function - RFC4122 version 4 compliant
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Storage keys
const USER_ID_KEY = 'superduperai_uid';
const USER_ID_COOKIE = 'superduperai_uid';

/**
 * Gets or creates a unique user identifier
 * Priority:
 * 1. Check cookies
 * 2. Check localStorage
 * 3. Generate a new UUID if neither exists
 */
export function getUserId(): string {
  // Try to get ID from cookie first
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split('; ');
    const uidCookie = cookies.find((cookie) => cookie.startsWith(`${USER_ID_COOKIE}=`));
    if (uidCookie) {
      return uidCookie.split('=')[1];
    }
  }

  // Next, try to get from localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedId = localStorage.getItem(USER_ID_KEY);
    if (storedId) {
      // If found in localStorage but not in cookie, set the cookie
      setUserIdCookie(storedId);
      return storedId;
    }
  }

  // If no user ID found, generate a new one
  const newUserId = generateUUID();
  saveUserId(newUserId);
  return newUserId;
}

/**
 * Saves user ID to localStorage and sets a cookie
 */
function saveUserId(userId: string): void {
  // Save to localStorage
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem(USER_ID_KEY, userId);
  }

  // Set cookie
  setUserIdCookie(userId);
}

/**
 * Sets the user ID cookie with a 2-year expiration
 */
function setUserIdCookie(userId: string): void {
  if (typeof document !== 'undefined') {
    // Set cookie to expire in 2 years
    const twoYearsFromNow = new Date();
    twoYearsFromNow.setFullYear(twoYearsFromNow.getFullYear() + 2);
    
    // Set cookie across the entire domain (root path)
    document.cookie = `${USER_ID_COOKIE}=${userId};expires=${twoYearsFromNow.toUTCString()};path=/;SameSite=Strict`;
    
    // If this is a subdomain and we want to share the ID with other subdomains
    // Get the main domain (example.com from subdomain.example.com)
    const domain = window.location.hostname.split('.').slice(-2).join('.');
    if (domain.includes('.')) {
      document.cookie = `${USER_ID_COOKIE}=${userId};expires=${twoYearsFromNow.toUTCString()};path=/;domain=.${domain};SameSite=Strict`;
    }
  }
}

/**
 * Takes a user ID from an authenticated session and syncs it with the anonymous ID
 * Call this function when a user logs in
 */
export function syncAuthenticatedUserId(authenticatedId: string): void {
  saveUserId(authenticatedId);
}

/**
 * Get user ID with additional data that can be used for analytics
 */
export function getUserData() {
  const userId = getUserId();
  
  // Determine if this is likely a returning user
  const isReturningUser = typeof window !== 'undefined' && window.localStorage && localStorage.getItem('superduperai_returning') === 'true';
  
  if (!isReturningUser && typeof window !== 'undefined' && window.localStorage) {
    localStorage.setItem('superduperai_returning', 'true');
  }
  
  return {
    userId,
    isReturningUser,
    // Add any additional non-PII data that might be useful for analytics
    // For example: referrer, initial landing page, etc.
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    initialPath: typeof window !== 'undefined' ? window.location.pathname : '',
  };
} 