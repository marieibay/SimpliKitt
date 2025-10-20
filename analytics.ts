/**
 * A simple analytics service for demonstration purposes.
 * In a real application, this could be replaced with a call to a third-party analytics provider.
 * This approach keeps analytics logic separate and easy to manage.
 */

/**
 * Tracks a custom event. All events are logged to the browser's console.
 *
 * @param eventName The name of the event to track (e.g., 'tool_used', 'file_downloaded').
 * @param properties An object of key-value pairs for additional event data (e.g., { toolName: 'JSON Formatter' }).
 */
export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  // In a real-world scenario, you would integrate with an analytics service here.
  // For example: window.analytics.track(eventName, properties);
  console.log(`[ANALYTICS] Event: "${eventName}"`, properties);
};
