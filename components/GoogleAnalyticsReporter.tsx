import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// PLEASE REPLACE THIS WITH YOUR OWN GOOGLE ANALYTICS MEASUREMENT ID
const GA_MEASUREMENT_ID = 'G-9Mm3HM2Q5T';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

const GoogleAnalyticsReporter: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // 1. Safety Check: Ensure gtag is available (it's loaded from index.html)
    if (typeof window.gtag !== 'function') {
      console.warn("Google Analytics gtag function not found.");
      return;
    }

    // 2. CORRECTION: Use 'event' to track subsequent virtual page views
    // The 'page_view' event is what GA4 expects for these route changes.
    window.gtag('event', 'page_view', {
      
      // Use 'send_to' to specify the target property
      send_to: GA_MEASUREMENT_ID, 
      
      // The page_path changes with every route navigation (e.g., /tools/resizer)
      page_path: location.pathname + location.search,
      
      // It's also good practice to send the dynamic page title
      page_title: document.title, 
    });

    console.log(`[GA] Page view tracked for: ${location.pathname + location.search}`);
    
  }, [location]); // useEffect runs every time the location object changes

  return null; // This component is for logic only, it renders nothing
};

export default GoogleAnalyticsReporter;