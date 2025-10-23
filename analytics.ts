import { track } from '@vercel/analytics';

// FIX: Add a global declaration for window.gtag to fix TypeScript errors.
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: Record<string, any>) => void;
  }
}

/**
 * An analytics service that sends events to Vercel Analytics.
 * This approach keeps analytics logic separate and easy to manage.
 */

/**
 * Tracks a custom event using Vercel Analytics.
 *
 * @param eventName The name of the event to track (e.g., 'tool_used', 'file_downloaded').
 * @param properties An object of key-value pairs for additional event data (e.g., { toolName: 'JSON Formatter' }).
 */
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  track(eventName, properties);
  // We can keep logging to console for development/debugging purposes.
  console.log(`[ANALYTICS] Event: "${eventName}"`, properties);
};

/**
 * Tracks a custom event using Google Analytics (gtag).
 * This allows for detailed tracking of specific tool usage and user actions.
 *
 * @param eventName The name of the event to track.
 * @param properties An object of key-value pairs for the event data.
 */
export const trackGtagEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, properties);
    console.log(`[GA] Event: "${eventName}"`, properties);
  } else {
    console.warn(`[GA] gtag not found. Event "${eventName}" not tracked.`);
  }
};
