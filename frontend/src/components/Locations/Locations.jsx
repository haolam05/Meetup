import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import ConfirmDeleteForm from "../ConfirmDeleteForm";
import EditVenue from "../EditVenue";
import * as groupActions from "../../store/group";
import "./Locations.css";

function Locations({ refs, setCenter, setZoom, apiKey, locations, groupId }) {
  const dispatch = useDispatch();
  const { setModalContent, closeModal } = useModal();

  const handleLocationIdOnHover = e => {
    e.target.querySelector('.loc-id')?.classList.add("hidden");
    e.target.querySelector('.fa-gear')?.classList.remove("hidden");
  }

  const handleLocationIdOnLeave = e => {
    e.target.querySelector('.loc-id')?.classList.remove("hidden");
    e.target.querySelector('.fa-gear')?.classList.add("hidden");
  }

  const handleLocationIdOnClick = e => {
    e.stopPropagation();
    e.target.closest("#location-wrapper")?.querySelector(".location-btns").classList.toggle("hidden");
  }

  const handleUpdateLocation = e => {
    e.stopPropagation();
    const locationIdx = +e.target.closest(".location-btns").id;
    const location = locations[locationIdx];
    setModalContent(<EditVenue apiKey={apiKey} venue={location} groupId={groupId} />);
  }

  const deleteVenue = async (e, location) => {
    e.preventDefault();
    const data = await dispatch(groupActions.deleteVenue(location.groupId, location.id));
    if (data.errors) {
      return setModalContent(<h2 className="subheading modal-errors">{data.errors.message}</h2>);
    }
    setModalContent(<h2 className="subheading alert-success">Successfully deleted!</h2>)
    setTimeout(() => window.location.reload(), 1000);
  }

  const handleDeleteLocation = e => {
    e.stopPropagation();
    const locationIdx = +e.target.closest(".location-btns").id;
    const location = locations[locationIdx];
    setModalContent(<ConfirmDeleteForm text="Venue" cancelDeleteCb={closeModal} deleteCb={e => deleteVenue(e, location)} />);
  }

  return (<>
    <div className="locations">
      {locations.map((location, i) => <div
        key={location.id}
        className="location"
        onClick={() => {
          const position = refs.current[i];
          setCenter({ lat: parseFloat(position.lat), lng: parseFloat(position.lng) });
          setZoom(5);
        }}
      >
        <div id="location-wrapper">
          <div id="location-container">
            <span
              id="location-id"
              onMouseEnter={handleLocationIdOnHover}
              onMouseLeave={handleLocationIdOnLeave}
              onClick={handleLocationIdOnClick}
            >
              <span className="loc-id">{i + 1}</span>
              <span><i className="hidden fa-solid fa-gear"></i></span>
            </span>
            <span id="location-address">{location.address}</span>
          </div>
          <div className="location-btns hidden" id={i}>
            <button className="location-btn-update btn-accent" onClick={handleUpdateLocation}>Update</button>
            <button className="location-btn-delete btn-accent" onClick={handleDeleteLocation}>Delete</button>
          </div>
        </div>
      </div>
      )
      }
    </div>
  </>);
}

export default Locations;
