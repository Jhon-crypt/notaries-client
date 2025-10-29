import { useState, useRef, useEffect } from 'react';

const ServiceZoneMap = ({ value, onChange }) => {
  const [isMapReady, setIsMapReady] = useState(false);
  const [drawnZones, setDrawnZones] = useState([]);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const drawingManagerRef = useRef(null);

  // Check if Google Maps API is loaded
  useEffect(() => {
    if (window.google && window.google.maps) {
      setIsMapReady(true);
      initializeMap();
    } else {
      // Google Maps not loaded - show placeholder
      console.warn('Google Maps API not loaded. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file');
    }
  }, []);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map centered on default location
    const map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 40.7128, lng: -74.0060 }, // New York City
      zoom: 10,
      mapTypeControl: true,
      streetViewControl: false,
    });

    mapInstanceRef.current = map;

    // Initialize Drawing Manager for service zones
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: null,
      drawingControl: true,
      drawingControlOptions: {
        position: window.google.maps.ControlPosition.TOP_CENTER,
        drawingModes: [
          window.google.maps.drawing.OverlayType.POLYGON,
          window.google.maps.drawing.OverlayType.CIRCLE,
        ],
      },
      polygonOptions: {
        fillColor: '#22c55e',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#16a34a',
        clickable: true,
        editable: true,
        draggable: true,
      },
      circleOptions: {
        fillColor: '#22c55e',
        fillOpacity: 0.3,
        strokeWeight: 2,
        strokeColor: '#16a34a',
        clickable: true,
        editable: true,
        draggable: true,
      },
    });

    drawingManager.setMap(map);
    drawingManagerRef.current = drawingManager;

    // Listen for zone creation
    window.google.maps.event.addListener(drawingManager, 'overlaycomplete', (event) => {
      const newZone = {
        type: event.type,
        overlay: event.overlay,
      };
      
      setDrawnZones(prev => [...prev, newZone]);
      
      // Convert zones to format for backend
      updateZonesData([...drawnZones, newZone]);

      // Add delete button to overlay
      addDeleteButton(event.overlay, newZone);
    });
  };

  const updateZonesData = (zones) => {
    // Convert zones to serializable format for backend
    const zonesData = zones.map(zone => {
      if (zone.type === 'circle') {
        return {
          type: 'circle',
          center: {
            lat: zone.overlay.getCenter().lat(),
            lng: zone.overlay.getCenter().lng(),
          },
          radius: zone.overlay.getRadius(),
        };
      } else if (zone.type === 'polygon') {
        return {
          type: 'polygon',
          paths: zone.overlay.getPath().getArray().map(point => ({
            lat: point.lat(),
            lng: point.lng(),
          })),
        };
      }
      return null;
    }).filter(Boolean);

    onChange(JSON.stringify(zonesData));
  };

  const addDeleteButton = (overlay, zone) => {
    // Add click listener to delete zone
    window.google.maps.event.addListener(overlay, 'rightclick', () => {
      if (window.confirm('Delete this service zone?')) {
        overlay.setMap(null);
        setDrawnZones(prev => {
          const updated = prev.filter(z => z.overlay !== overlay);
          updateZonesData(updated);
          return updated;
        });
      }
    });
  };

  const clearAllZones = () => {
    if (window.confirm('Clear all service zones?')) {
      drawnZones.forEach(zone => {
        zone.overlay.setMap(null);
      });
      setDrawnZones([]);
      onChange('');
    }
  };

  if (!window.google || !window.google.maps) {
    return (
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Service Zone Selector</h3>
        <p className="text-sm text-gray-600 mb-4">
          Draw polygons or circles on the map to define your service areas
        </p>
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-left">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-900 mb-1">Google Maps API Required</p>
              <p className="text-xs text-amber-700 mb-2">
                To enable map-based service zone selection, add your Google Maps API key to the environment configuration.
              </p>
              <p className="text-xs text-amber-700 font-mono bg-amber-100 p-2 rounded">
                VITE_GOOGLE_MAPS_API_KEY=your-api-key
              </p>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4">
          For now, you can use text input as a temporary alternative
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Draw on the map to define your service areas
        </p>
        {drawnZones.length > 0 && (
          <button
            type="button"
            onClick={clearAllZones}
            className="text-xs text-red-600 hover:text-red-700 font-medium"
          >
            Clear All Zones
          </button>
        )}
      </div>
      
      <div 
        ref={mapRef}
        className="w-full h-96 rounded-lg border-2 border-gray-300 overflow-hidden shadow-sm"
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1 text-xs text-blue-700">
            <p className="font-semibold mb-1">How to use:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Click polygon or circle tool in the map toolbar</li>
              <li>Draw your service area on the map</li>
              <li>You can draw multiple zones</li>
              <li>Right-click on a zone to delete it</li>
              <li>Drag zones to reposition them</li>
            </ul>
          </div>
        </div>
      </div>

      {drawnZones.length > 0 && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">{drawnZones.length}</span> service zone{drawnZones.length !== 1 ? 's' : ''} defined
        </div>
      )}
    </div>
  );
};

export default ServiceZoneMap;

