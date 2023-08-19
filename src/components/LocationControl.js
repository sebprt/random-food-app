import { Marker, Popup, Rectangle, useMap, useMapEvent } from 'react-leaflet';
import { useCallback, useMemo, useState } from 'react';
import { useEventHandlers } from '@react-leaflet/core'
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import { IconButton } from '@mui/material';
import L from 'leaflet';

const POSITION_CLASSES = {
  bottomleft: 'leaflet-bottom leaflet-left',
  bottomright: 'leaflet-bottom leaflet-right',
  topleft: 'leaflet-top leaflet-left',
  topright: 'leaflet-top leaflet-right',
}

const BOUNDS_STYLE = { weight: 1 }
function MinimapBounds({ parentMap, zoom }) {
  const minimap = useMap()

  // Clicking a point on the minimap sets the parent's map center
  const onClick = useCallback(
    (e) => {
      parentMap.setView(e.latlng, parentMap.getZoom())
    },
    [parentMap],
  )
  useMapEvent('click', onClick)

  // Keep track of bounds in state to trigger renders
  const [bounds, setBounds] = useState(parentMap.getBounds())
  const onChange = useCallback(() => {
    setBounds(parentMap.getBounds())
    // Update the minimap's view to match the parent map's center and zoom
    minimap.setView(parentMap.getCenter(), zoom)
  }, [minimap, parentMap, zoom])

  // Listen to events on the parent map
  const handlers = useMemo(() => ({ move: onChange, zoom: onChange }), [])
  useEventHandlers({ instance: parentMap }, handlers)

  return <Rectangle bounds={bounds} pathOptions={BOUNDS_STYLE} />
}

const LocationControl = ({ position, zoom, setPosition }) => {
  const [bbox, setBbox] = useState([]);

  const map = useMap()

  const positionClass =
    (position && POSITION_CLASSES[position]) || POSITION_CLASSES.topright

  const enableLocation = () => {
    map.locate().on("locationfound", function (e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
      const radius = e.accuracy;
      const circle = L.circle(e.latlng, radius);
      circle.addTo(map);
      L.marker(e.latlng).addTo(map)
      setBbox(e.bounds.toBBoxString().split(","));
    });
  }

  return (
    <div className={positionClass}>
      <div className="leaflet-control leaflet-bar">
        <a href="#"
           title="Locate"
           role="button"
           aria-label="Locate"
           aria-disabled="false"
           style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          onClick={enableLocation}
        >
          <GpsFixedIcon sx={{ p:0, m: 0}} />
        </a>
      </div>
    </div>
  )
}

export default LocationControl;
