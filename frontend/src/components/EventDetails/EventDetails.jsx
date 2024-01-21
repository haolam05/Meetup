import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import Loading from '../Loading';
import Event from '../Event';
import * as sessionActions from '../../store/session';
import * as eventActions from '../../store/event';
import './EventDetails.css';

function EventDetails() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const event = useSelector(eventActions.getEventById(eventId));
  const user = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const loadEventDetails = async () => {
      await dispatch(eventActions.loadEventDetails(eventId));
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadEventDetails();
  }, [dispatch, eventId]);

  const addBackBtnText = () => {
    const span = document.createElement('span');
    span.innerText = 'Events';
    document.querySelector('#back-to-group').appendChild(span);
  }

  const removeBackBtnText = () => {
    document.querySelector('#back-to-group>span').remove();
  }

  if (!isLoaded) return <Loading />;

  return (
    <div id="lists-container">
      <div id="lists">
        <button
          id="back-to-group"
          onMouseOver={addBackBtnText}
          onMouseOut={removeBackBtnText}
          onClick={() => navigate("/events", { replace: true })}
        >
          <i className="fa-sharp fa-solid fa-arrow-left"></i>
        </button>
        <div id="event-header">
          <h1 className="heading">{event.name}</h1>
          <span>Hosted by {event.Group.Organizer.firstName} {event.Group.Organizer.lastName}</span>
        </div>
        <Event event={event} user={user} details={true} />
        <div id="event-details-wrapper">
          <h2 className="subheading">Details</h2>
          <p>{event.description}</p>
        </div>
      </div>
    </div>
  );
}

export default EventDetails;
