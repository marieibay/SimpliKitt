export const loadScript = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true') {
        resolve();
      } else {
        const loadListener = () => {
          resolve();
          existingScript.removeEventListener('load', loadListener);
          existingScript.removeEventListener('error', errorListener);
        };
        const errorListener = (e: Event) => {
          reject(e);
          existingScript.removeEventListener('load', loadListener);
          existingScript.removeEventListener('error', errorListener);
        };
        existingScript.addEventListener('load', loadListener);
        existingScript.addEventListener('error', errorListener);
      }
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      script.dataset.loaded = 'true';
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.body.appendChild(script);
  });
};
