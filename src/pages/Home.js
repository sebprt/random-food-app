import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import './Home.css';
import data from '../data/restaurants.json';
import { useState } from 'react';
import { Box, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import axios from 'axios';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const apiKey = process.env.REACT_APP_API_KEY;

const Home = () => {
  const [location, setLocation] = useState(Location | null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [showDirectionsButton, setShowDirectionsButton] = useState(false);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const selectedIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png'
  });

  const defaultIcon = new L.Icon.Default();

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
        },
        function() {
          console.log('Unable to retrieve your location');
        }
      );
    } else {
      console.log('Geolocation not supported');
    }
  }

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

  const handleDirectionsButtonClick = () => {
    axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}a&start=${location.longitude},${location.latitude}&end=${selectedRestaurant.longitude},${selectedRestaurant.latitude}`)
      .then(response => {
        console.log(response.data);
        const coordinates = response.data.features[0].geometry.coordinates;
        setRouteCoordinates(coordinates);
        console.log(coordinates);
      })
      .catch(error => {
        console.error('Something wrong happened.', error);
      });
  };

  return (
    <div>
      {!location ? (
        <button onClick={handleLocationClick}>Get Location</button>
      ) : null}
      {location ? (
        <>
          <MapContainer
            className='full-height-map'
            center={[location.latitude, location.longitude]}
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
              <Button variant='contained' startIcon={<SearchIcon />} onClick={handleHighlightMarkers}
                      disabled={isHighlighting}>Lancer</Button>
              {showDirectionsButton && (
                <Button variant='contained' startIcon={<DirectionsIcon />} onClick={handleDirectionsButtonClick}>Y
                  aller</Button>
              )}
            </Box>
          </MapContainer>
        </>
      ) : null}
    </div>
  );
};

export default Home;
