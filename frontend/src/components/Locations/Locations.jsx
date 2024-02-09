import "./Locations.css";

function Locations({ refs, setCenter, setZoom, locations }) {
  return (
    <div className="locations">
      {locations.map((location, i) => <div
        id={i}
        key={location.id}
        className="location"
        onClick={() => {
          const position = refs.current[i];
          setCenter({ lat: parseFloat(position.lat), lng: parseFloat(position.lng) });
          setZoom(5)
        }}
      >
        <div id="location-wrapper">
          <span id="location-id">{i + 1}</span>
          <span id="location-address">{location.address}</span>
        </div>
      </div>
      )}
    </div>
  );
}

export default Locations;
