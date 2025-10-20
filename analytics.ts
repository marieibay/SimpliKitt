import { track } from '@vercel/analytics';

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
