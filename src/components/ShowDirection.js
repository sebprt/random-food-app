import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import axios from 'axios';
import { useMap } from 'react-leaflet';

const apiKey = process.env.REACT_APP_API_KEY;

const ShowDirection = ({ setRouteCoordinates, selectedRestaurant }) => {
  const [position, setPosition] = useState(null);
  const map = useMap();

  const handleDirectionsButtonClick = () => {
    axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}a&start=${position.lng},${position.lat}&end=${selectedRestaurant.longitude},${selectedRestaurant.latitude}`)
      .then(response => {
        const coordinates = response.data.features[0].geometry.coordinates;
        setRouteCoordinates(coordinates);
      })
      .catch(error => {
        console.error('Something wrong happened.', error);
      });
  };

  useEffect(() => {
    map.locate().on('locationfound', function(e) {
      setPosition(e.latlng);
    });
  }, [map]);

  return (
    <Button variant='contained' startIcon={<DirectionsIcon />} onClick={handleDirectionsButtonClick}>
      Y aller
    </Button>
  );
};

export default ShowDirection;