import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';
import Event from '../Event';
import * as eventActions from '../../store/event';

function Events() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const events = useSelector(eventActions.getEvents);

  useEffect(() => {
    const loadEvents = async () => {
      await dispatch(eventActions.loadEvents());
      setIsLoaded(true);
    }
    loadEvents();
  }, [dispatch]);

  if (!isLoaded) return <Loading />;

  return (
    <li>
      {events.upcomingEvents.map(event => (
        <div key={event.id} onClick={() => navigate(`/events/${event.id}`, { replace: true })}>
          <Event event={event} />
        </div>
      ))}
      {events.pastEvents.map(event => (
        <div key={event.id} onClick={() => navigate(`/events/${event.id}`, { replace: true })}>
          <Event event={event} />
        </div>
      ))}
    </li>
  );
}

export default Events;
