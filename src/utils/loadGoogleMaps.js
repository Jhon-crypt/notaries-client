// Utility to dynamically load Google Maps API
let googleMapsPromise = null;

export const loadGoogleMaps = () => {
  // Return existing promise if already loading
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  // Create new promise
  googleMapsPromise = new Promise((resolve, reject) => {
    // Check if already loaded
    if (window.google && window.google.maps) {
      resolve(window.google.maps);
      return;
    }

    // Get API key from environment
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found. Set VITE_GOOGLE_MAPS_API_KEY in your .env file');
      reject(new Error('Google Maps API key not configured'));
      return;
    }

    // Create script element
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,places`;
    script.async = true;
    script.defer = true;

    // Handle load
    script.onload = () => {
      if (window.google && window.google.maps) {
        resolve(window.google.maps);
      } else {
        reject(new Error('Google Maps failed to load'));
      }
    };

    // Handle error
    script.onerror = () => {
      reject(new Error('Failed to load Google Maps script'));
    };

    // Append to document
    document.head.appendChild(script);
  });

  return googleMapsPromise;
};

// Load Google Maps on app initialization
export const initGoogleMaps = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (apiKey) {
    loadGoogleMaps().catch(error => {
      console.error('Error loading Google Maps:', error);
    });
  }
};

