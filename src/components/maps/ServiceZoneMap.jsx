import { useState, useRef, useEffect, useCallback } from 'react';
import { loadGoogleMaps } from '../../utils/loadGoogleMaps';

const ServiceZoneMap = ({ onChange, initialZones }) => {
  const [drawnZones, setDrawnZones] = useState([]);
  const [initialZonesLoaded, setInitialZonesLoaded] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const drawingManagerRef = useRef(null);

  const updateZonesData = useCallback((zones) => {
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
  }, [onChange]);

  const addDeleteButton = useCallback((overlay) => {
    // Add click listener to delete zone
    window.google.maps.event.addListener(overlay, 'rightclick', () => {
      if (window.confirm('¿Eliminar esta zona de servicio? / Delete this service zone?')) {
        overlay.setMap(null);
        setDrawnZones(prev => {
          const updated = prev.filter(z => z.overlay !== overlay);
          updateZonesData(updated);
          return updated;
        });
      }
    });
  }, [updateZonesData]);

  const initializeMap = useCallback(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    if (!window.google || !window.google.maps) return;

    // Default location: Lima, Peru (as per client requirement - Peruvian context)
    const defaultLocation = { lat: -12.0464, lng: -77.0428 }; // Lima, Peru
    
    // Initialize map centered on Lima, Peru
    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultLocation,
      zoom: 12,
      mapTypeControl: true,
      streetViewControl: false,
      fullscreenControl: true,
    });

    mapInstanceRef.current = map;
    
    // Add default pin/marker at notary's address
    new window.google.maps.Marker({
      position: defaultLocation,
      map: map,
      title: "Ubicación de Notaría",
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#3B82F6",
        fillOpacity: 1,
        strokeColor: "#1E40AF",
        strokeWeight: 2,
      },
    });

    // Initialize Drawing Manager for service zones
    const drawingManager = new window.google.maps.drawing.DrawingManager({
      drawingMode: window.google.maps.drawing.OverlayType.POLYGON, // Start with polygon mode active
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
        fillOpacity: 0.35,
        strokeWeight: 3,
        strokeColor: '#16a34a',
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
      },
      circleOptions: {
        fillColor: '#3B82F6',
        fillOpacity: 0.35,
        strokeWeight: 3,
        strokeColor: '#1E40AF',
        clickable: true,
        editable: true,
        draggable: true,
        zIndex: 1,
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
      
      setDrawnZones(prev => {
        const updated = [...prev, newZone];
        updateZonesData(updated);
        return updated;
      });
      
      // Add delete button to overlay
      addDeleteButton(event.overlay);
    });
  }, [addDeleteButton, updateZonesData]);

  // Check if Google Maps API is loaded, and load it if not
  useEffect(() => {
    if (!mapRef.current) return;

    if (window.google && window.google.maps) {
      // Google Maps already loaded, initialize map
      setTimeout(() => {
        if (mapRef.current && !mapInstanceRef.current) {
          initializeMap();
        }
      }, 100);
    } else {
      // Try to load Google Maps
      loadGoogleMaps()
        .then(() => {
          // Google Maps loaded, wait for mapRef to be ready
          const checkAndInit = () => {
            if (mapRef.current && !mapInstanceRef.current && window.google && window.google.maps) {
              initializeMap();
            } else if (mapRef.current) {
              // Retry after a short delay
              setTimeout(checkAndInit, 100);
            }
          };
          checkAndInit();
        })
        .catch((error) => {
          console.warn('Google Maps API not loaded:', error);
          // Placeholder will be shown by the component's render logic
        });
    }
  }, [initializeMap]);

  useEffect(() => {
    if (!mapInstanceRef.current || initialZonesLoaded) return;
    if (!initialZones) {
      setInitialZonesLoaded(true);
      return;
    }

    try {
      const parsed =
        typeof initialZones === 'string'
          ? JSON.parse(initialZones || '[]')
          : Array.isArray(initialZones)
            ? initialZones
            : [];

      if (!parsed.length) {
        setInitialZonesLoaded(true);
        return;
      }

      const overlays = parsed
        .map((zone) => {
          if (zone.type === 'polygon' && zone.paths?.length) {
            const polygon = new window.google.maps.Polygon({
              paths: zone.paths,
              fillColor: '#22c55e',
              fillOpacity: 0.35,
              strokeWeight: 3,
              strokeColor: '#16a34a',
              editable: true,
              draggable: true,
              zIndex: 1,
            });
            polygon.setMap(mapInstanceRef.current);
            addDeleteButton(polygon);
            return { type: 'polygon', overlay: polygon };
          }

          if (zone.type === 'circle' && zone.center && zone.radius) {
            const circle = new window.google.maps.Circle({
              center: zone.center,
              radius: zone.radius,
              fillColor: '#3B82F6',
              fillOpacity: 0.35,
              strokeWeight: 3,
              strokeColor: '#1E40AF',
              editable: true,
              draggable: true,
              zIndex: 1,
            });
            circle.setMap(mapInstanceRef.current);
            addDeleteButton(circle);
            return { type: 'circle', overlay: circle };
          }

          return null;
        })
        .filter(Boolean);

      if (overlays.length) {
        setDrawnZones(overlays);
        updateZonesData(overlays);
      }
    } catch (error) {
      console.warn('Unable to load existing service zones', error);
    } finally {
      setInitialZonesLoaded(true);
    }
  }, [initialZones, initialZonesLoaded, addDeleteButton, updateZonesData]);

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
        <p className="text-sm font-semibold text-gray-900">
          Defina su zona de servicio en el mapa con el polígono o círculo
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
            <p className="font-semibold mb-1">Cómo usar / How to use:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>El pin azul marca la ubicación de la notaría / Blue pin marks notary location</li>
              <li>Haz clic en herramienta polígono o círculo / Click polygon or circle tool at top</li>
              <li>Dibuja tu área de servicio / Draw your service area on the map</li>
              <li>Puedes dibujar múltiples zonas / You can draw multiple zones</li>
              <li>Clic derecho para eliminar / Right-click on a zone to delete it</li>
              <li>Arrastra zonas para reposicionar / Drag zones to reposition them</li>
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

