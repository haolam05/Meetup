import { useNavigate } from "react-router-dom";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import { getPreviewImageUrl } from "../../utils/images";
import OpenModalButton from "../OpenModalButton";
import DeleteEvent from "../DeleteEvent";
import "./ManageEvent.css";

function ManageEvent({ event, user }) {
  const navigate = useNavigate();

  const handleToEventDetailsPage = e => {
    if (!e.target.classList.contains("btn-accent")) {
      navigate(`/events/${event.id}`, { replace: true });
    }
  }

  return (
    <div id="manage-event" onClick={handleToEventDetailsPage}>
      <div id="event">
        <div id="event-image">
          <img src={getPreviewImageUrl(event)} alt="preview-image" />
        </div>
        <div id="event-text">
          <div id="event-time">
            <span id="event-start-date">{formattedDate(event.startDate)}</span>
            <span id="event-dot">.</span>
            <span id="event-start-time">{formattedTime(event.startDate)}</span>
          </div>
          <h2 id="event-title" className="subheading">{event.name}</h2>
          <div id="event-location">{event.Venue ? `${event.Venue?.city}, ${event.Venue?.state}` : 'Online'}</div>
          <div id="event-description">{event.description.slice(0, 50) + '...'}</div>
          {user && user.id === event.hostId ? (
            <>
              <div id="event-btns">
                <button
                  className="btn-accent"
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                >
                  Update
                </button>
                <OpenModalButton
                  modalComponent={<DeleteEvent groupId={event.Group.id} eventId={event.id} />}
                  buttonText="Delete"
                />
              </div>
            </>
          ) : (
            <button
              id="group-join-btn"
              className="btn-accent"
              onClick={() => alert("Feature coming soon")}
            >
              Join this group
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageEvent;
