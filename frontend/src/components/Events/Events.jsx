import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';
import Event from '../Event';
import * as eventActions from '../../store/event';

function Events() {
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
      {events.upcomingEvents.map(event => <Event key={event.id} event={event} />)}
      {events.pastEvents.map(event => <Event key={event.id} event={event} />)}
    </li>
  );
}

export default Events;
