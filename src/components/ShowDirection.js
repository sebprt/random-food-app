import { Button } from '@mui/material';
import DirectionsIcon from '@mui/icons-material/Directions';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const apiKey = process.env.REACT_APP_API_KEY;

const ShowDirection = ({ position, setRouteCoordinates, selectedRestaurant }) => {
  const notify = () => toast.error('Vous devez partager votre position afin de pouvoir établir un itinéraire.', {
    position: 'top-center',
    hideProgressBar: true
  });

  const handleDirectionsButtonClick = () => {
    if (!position) {
      notify();

      return;
    }

    axios.get(`https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}a&start=${position.lng},${position.lat}&end=${selectedRestaurant.longitude},${selectedRestaurant.latitude}`)
      .then(response => {
        const coordinates = response.data.features[0].geometry.coordinates;
        setRouteCoordinates(coordinates);
      })
      .catch(error => {
        console.error('Something wrong happened.', error);
      });
  };

  return (
    <>
      <Button variant='contained' startIcon={<DirectionsIcon />} onClick={handleDirectionsButtonClick}>
        Y aller
      </Button>
    </>
  );
};

export default ShowDirection;