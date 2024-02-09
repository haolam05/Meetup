import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { getAverageLocation } from '../../utils/maps';
import React, { useEffect, useRef, useState } from 'react';
import Locations from '../Locations';
import "./Maps.css";

const customMarker = {
  path: "M13.0167 35C12.7836 35 12.7171 34.9346 12.3176 33.725C11.9848 32.6789 11.4854 31.0769 10.1873 29.1154C8.92233 27.1866 7.59085 25.6173 6.32594 24.1135C3.36339 20.5174 1 17.7057 1 12.6385C1.03329 6.19808 6.39251 1 13.0167 1C19.6408 1 25 6.23078 25 12.6385C25 17.7057 22.6699 20.55 19.6741 24.1462C18.4425 25.65 17.1443 27.2193 15.8793 29.1154C14.6144 31.0442 14.0818 32.6135 13.749 33.6596C13.3495 34.9346 13.2497 35 13.0167 35Z M13 18C15.7614 18 18 15.7614 18 13C18 10.2386 15.7614 8 13 8C10.2386 8 8 10.2386 8 13C8 15.7614 10.2386 18 13 18Z",
  fillColor: "yellow",
  fillOpacity: 2,
  strokeWeight: 1,
  rotation: 0,
  scale: 1,
};

const containerStyle = {
  width: '900px',
  height: '400px',
};

const Maps = ({ apiKey, locations }) => {
  const [center, setCenter] = useState(null);
  const [zoom, setZoom] = useState(3);
  const refs = useRef(locations);

  useEffect(() => {
    const modalContent = document.querySelector('#modal-content');
    const cb = e => {
      if (e.target.id === "modal-content" || e.target.classList.contains("maps-container") || e.target.classList.contains("locations")) {
        document.querySelectorAll(".location-btns").forEach(el => el.classList.add("hidden"));
      }
    }
    modalContent.addEventListener('click', cb);
    return () => modalContent.removeEventListener('click', cb);
  }, []);

  const centerLocation = ({ latLng }) => {  // domEvent, latLng
    setCenter({ lat: parseFloat(latLng.lat()), lng: parseFloat(latLng.lng()) })
    setZoom(5);
  }

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey,
  });

  return isLoaded && <div className="maps-container">
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center || getAverageLocation(locations)}
      zoom={zoom}
    >
      {locations.map((location, i) => <Marker
        key={location.id}
        position={{ lat: parseFloat(location.lat), lng: parseFloat(location.lng) }}
        label={{ text: `${i + 1}`, color: 'white', className: 'marker-label' }}
        icon={customMarker}
        onClick={centerLocation}
      />)}
    </GoogleMap>
    <Locations refs={refs} setCenter={setCenter} setZoom={setZoom} locations={locations} />
  </div>;
};

export default React.memo(Maps);
