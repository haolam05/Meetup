import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { getProfileImageUrl } from '../../utils/images';
import Loading from '../Loading';
import Event from '../Event';
import BackButton from '../BackButton';
import AttendanceStatus from '../AttendanceStatus';
import * as sessionActions from '../../store/session';
import * as eventActions from '../../store/event';
import './EventDetails.css';

function EventDetails() {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const userEvents = useSelector(eventActions.getCurrentUserEvents);
  const event = useSelector(eventActions.getEventById(eventId));
  const user = useSelector(sessionActions.sessionUser);

  useEffect(() => {
    const loadEventDetails = async () => {
      await dispatch(eventActions.loadCurrentUserEvents());
      await dispatch(eventActions.loadEventDetails(eventId));
      await dispatch(sessionActions.restoreSession());
      setIsLoaded(true);
    }
    loadEventDetails();
  }, [dispatch, eventId]);

  if (!isLoaded) return <Loading />;
  if (!event) return;

  const isPublic = !event.Group.private;
  const isHost = event.Group.organizerId === user.id;
  const isCohost = event.Group.members.find(m => m.id === user.id && m.Membership.status === 'co-host');
  const isAttendee = event.attendees.find(attendee => attendee.id === user.id);

  return (
    <div id="lists-container">
      <div id="lists">
        <BackButton url="/events" />
        <div id="event-header">
          <h1 className="heading">{event.name} {<AttendanceStatus user={user} event={event} />}</h1>
          <div className="event-avatar-container">
            <span>Hosted by {event.Group.Organizer.firstName} {event.Group.Organizer.lastName}</span>
            <div className="event-host-avatar"><img src={getProfileImageUrl(event.Group.Organizer.profileImageUrl)} alt="avatar" /></div>
          </div>
        </div>
        <Event
          event={event}
          user={user}
          details={true}
          userEvents={userEvents}
          // only show event images if group is public, or user is host/co-host, or user is an attendee (not pending or waitlist)
          showSlider={isPublic || (user && (isHost || isCohost || isAttendee))}
          allowedPost={user && (isHost || isCohost || isAttendee)}
          allowedDelete={user && (isHost || isCohost)}
        />
        <div id="event-details-wrapper">
          <h2 className="subheading">Details</h2>
          <p>{event.description}</p>
        </div>
      </div>
    </div >
  );
}

export default EventDetails;
