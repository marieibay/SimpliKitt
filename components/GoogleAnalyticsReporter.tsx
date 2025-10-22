import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics Measurement ID
const GA_MEASUREMENT_ID = 'G-9MW3HR2Q5T';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

const GoogleAnalyticsReporter: React.FC = () => {
  const location = useLocation();
  const isInitialPageLoad = useRef(true);

  useEffect(() => {
    // The initial page_view is sent automatically by the gtag('config', ...)
    // command in index.html. This hook is for tracking subsequent SPA navigations.
    if (isInitialPageLoad.current) {
      isInitialPageLoad.current = false;
      return;
    }
    
    if (typeof window.gtag !== 'function') {
      console.warn("Google Analytics gtag function not found.");
      return;
    }

    // For HashRouter, the path is in location.hash. We need to extract it.
    // location.hash will be like "#/tool/image-resizer", we want "/tool/image-resizer"
    const path = location.hash.substring(1) || '/';

    // For SPA navigations, the recommended approach is to send a 'config'
    // command with the updated page_path. This automatically triggers a page_view.
    window.gtag('event', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: document.title,
    });

    console.log(`[GA] SPA Page view tracked for: ${path}`);
    
  }, [location]);

  return null; // This component renders nothing
};

export default GoogleAnalyticsReporter;