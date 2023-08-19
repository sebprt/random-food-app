import { useMap } from 'react-leaflet';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import L from 'leaflet';
import { useState } from 'react';

const LocationControl = ({ position, zoom, setPosition }) => {
  const map = useMap();
  const [hasLocated, setHasLocated] = useState(false);

  const enableLocation = () => {
    if (!hasLocated) {
      map.locate().on('locationfound', function(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        const radius = e.accuracy;
        const circle = L.circle(e.latlng, radius);
        circle.addTo(map);
        L.marker(e.latlng).addTo(map);

        setHasLocated(true);
      });
    } else {
      map.flyTo(position, map.getZoom());
    }
  };

  return (
    <div className='leaflet-bottom leaflet-left'>
      <div className='leaflet-control leaflet-bar'>
        <a href='#'
           title='Locate'
           role='button'
           aria-label='Locate'
           aria-disabled='false'
           style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
           onClick={enableLocation}
        >
          <GpsFixedIcon sx={{ p: 0, m: 0 }} />
        </a>
      </div>
    </div>
  );
};

export default LocationControl;
