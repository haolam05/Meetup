import { useNavigate } from "react-router-dom";
import { formattedDate, formattedTime } from "../../utils/dateFormatter";
import { getPreviewImageUrl } from "../../utils/images";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loading from "../Loading";
import OpenModalButton from "../OpenModalButton";
import DeleteEvent from "../DeleteEvent";
import PendingBtn from "../PendingBtn";
import WaitListBtn from "../WaitListBtn";
import * as eventActions from "../../store/event";
import "./ManageEvent.css";
import UnjoinEventBtn from "../UnjoinEventBtn";

function ManageEvent({ event, user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const userEvents = useSelector(eventActions.getCurrentUserEvents);

  useEffect(() => {
    const loadInfo = async () => {
      if (user) await dispatch(eventActions.loadCurrentUserEvents());
      setIsLoaded(true);
    }
    loadInfo();
  }, [dispatch, user])

  const handleToEventDetailsPage = e => {
    if (!e.target.classList.contains("btn-accent")) {
      navigate(`/events/${event.id}`, { replace: true });
    }
  }

  function OwnerButtons() {
    return (
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
    );
  }

  function RegularButtons() {
    const userEvent = userEvents.find(userEvent => userEvent.id === event.id);
    if (userEvent.Attendance.status === "pending") return <PendingBtn />
    if (userEvent.Attendance.status === "waitlist") return <WaitListBtn />
    return <UnjoinEventBtn event={event} user={user} status={userEvent.Attendance.status} />
  }

  if (!isLoaded) return <Loading />;

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
          {user && user.id === event.hostId ? <OwnerButtons /> : <RegularButtons />}
        </div>
      </div>
    </div>
  );
}

export default ManageEvent;
