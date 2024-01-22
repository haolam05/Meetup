import { useModal } from "../../context/Modal";
import { useDispatch } from "react-redux";
import * as eventActions from "../../store/event";
// import "./DeleteGroup.css";

function DeleteEvent({ groupId, eventId }) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const deleteEvent = async e => {
    e.preventDefault();
    await dispatch(eventActions.deleteEvent(eventId));
    window.location.href = `/groups/${groupId}`;
  }

  return (
    <div id="delete-group">
      <h2 className="subheading">Confirm Delete</h2>
      <p>Are you sure you wnat to remove this event?</p>
      <div>
        <button
          className="btn-primary delete"
          onClick={deleteEvent}
        >
          <span>Yes</span>
          <span className="sub-text">(Delete Event)</span>
        </button>
        <button
          className="btn-accent cancel"
          onClick={closeModal}
        >
          <span>No</span>
          <span className="sub-text">(Keep Event)</span>
        </button>
      </div>
    </div>
  );
}

export default DeleteEvent;
