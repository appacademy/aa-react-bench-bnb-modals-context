import { useEffect, useRef, useState } from 'react';
import { Wrapper } from '@googlemaps/react-wrapper';
import './BenchMap.css';

function BenchMap({ 
  benches, 
  highlightedBench,
  mapOptions = {}, 
  mapEventHandlers = {}, 
  markerEventHandlers = {}
}) {
  const [map, setMap] = useState(null);
  const mapRef = useRef(null);
  const markers = useRef({});

  // Create the map
  useEffect(() => {
    if (!map) {
      setMap(new window.google.maps.Map(mapRef.current, {
        center: {
          lat: 37.773972,
          lng: -122.431297
        }, // San Francisco coordinates
        zoom: 13,
        clickableIcons: false,
        ...mapOptions,
      }));
    }
  }, [mapRef, map, mapOptions]);

  // Add event handlers to map
  useEffect(() => {
    if (map) {
      const listeners = Object.entries(mapEventHandlers).map(([event, handler]) => 
        window.google.maps.event.addListener(
          map, 
          event, 
          (...args) => handler(...args, map)
        )
      );

      return () => listeners.forEach(window.google.maps.event.removeListener);
    }
  }, [map, mapEventHandlers]);

  // Update map markers whenever `benches` changes
  useEffect(() => {
    if (map) {
      // Add markers for new benches
      benches.forEach((bench) => {
        if (markers.current[bench.id]) return;

        const marker = new window.google.maps.Marker({ 
          map, 
          position: new window.google.maps.LatLng(bench.lat, bench.lng), 
          label: { 
            text: `$${bench.price.toString()}`, 
            fontWeight: 'bold',
            color: 'black'
          }, 
          icon: {
            path: `
              M 1,0 
              L 2,0 
              A 1 1 0 0 1 3,1
              A 1 1 0 0 1 2,2
              L 1,2 
              A 1 1 0 0 1 0,1
              A 1 1 0 0 1 1,0
              z
            `,
            fillOpacity: 1,
            fillColor: 'white',
            strokeColor: 'black',
            strokeWeight: 1,
            scale: 15,
            labelOrigin: new window.google.maps.Point(1.5, 1),
            anchor: new window.google.maps.Point(1.5, 1)
          }, 
        });

        Object.entries(markerEventHandlers).forEach(([event, handler]) => {
          marker.addListener(event, () => handler(bench));
        });
        markers.current[bench.id] = marker;
      });

      // Remove markers for old benches
      Object.entries(markers.current).forEach(([benchId, marker]) => {
        if (benches.some(bench => bench.id.toString() === benchId)) return;

        marker.setMap(null);
        delete markers.current[benchId];
      });
    }
  }, [benches, map, markerEventHandlers]);

  // Change the style for bench marker on hover
  useEffect(() => {
    Object.entries(markers.current).forEach(([benchId, marker]) => {
      const label = marker.getLabel();
      const icon = marker.getIcon();

      if (parseInt(benchId) === highlightedBench) {
        marker.setLabel({ ...label, color: 'white' });
        marker.setIcon({ ...icon, fillColor: 'black' });
      } else {
        marker.setLabel({ ...label, color: 'black' });
        marker.setIcon({ ...icon, fillColor: 'white' });
      }
    });
  }, [markers, highlightedBench]);

  return (
    <div ref={mapRef} className="map">
      Map
    </div>
  );
}

function BenchMapWrapper(props) {
  return (
    <Wrapper apiKey={import.meta.env.VITE_MAPS_API_KEY}>
      <BenchMap {...props} />
    </Wrapper>
  );
}

export default BenchMapWrapper;
