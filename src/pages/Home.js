import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import './Home.css';
import data from '../data/restaurants.json';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MinimapControl from '../components/MinimapControl';
import ShowDirection from '../components/ShowDirection';
import LocationControl from '../components/LocationControl';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const Home = () => {
  const [position, setPosition] = useState(false);
  const [showDirectionsButton, setShowDirectionsButton] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
  });

  const defaultIcon = new L.Icon.Default();

  const handleHighlightMarkers = async () => {
    setIsHighlighting(true);

    for (const marker of data) {
      setSelectedRestaurant(marker);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSelectedRestaurant(null);
    }

    setIsHighlighting(false);

    const randomIndex = Math.floor(Math.random() * data.length);
    setSelectedRestaurant(data[randomIndex]);
    data[randomIndex].ref.openPopup();
    setShowDirectionsButton(true);
  };

  return (
    <MapContainer
      className='full-height-map'
      center={[45.042768, 3.882936]}
      zoom={17}
      minZoom={3}
      maxZoom={19}
      scrollWheelZoom={true}
      trackResize={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />
      <MinimapControl position='topright' />
      <LocationControl position='bottomleft' setPosition={setPosition} />
      {data.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.latitude, marker.longitude]}
          icon={selectedRestaurant === marker ? selectedIcon : defaultIcon}
          ref={(ref) => data[index].ref = ref}
        >
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
      {routeCoordinates.length > 0 && (
        <Polyline
          pathOptions={{ color: 'blue' }}
          positions={routeCoordinates.map(coord => [coord[1], coord[0]])}
        />
      )}
      <Box sx={{ display: 'flex', gap: 2 }} className='button'>
        <Button
          variant='contained'
          startIcon={<SearchIcon />}
          onClick={handleHighlightMarkers}
          disabled={isHighlighting}>Lancer</Button>
        {showDirectionsButton && (
          <ShowDirection setRouteCoordinates={setRouteCoordinates} selectedRestaurant={selectedRestaurant} />
        )}
      </Box>
    </MapContainer>
  );
};

export default Home;
