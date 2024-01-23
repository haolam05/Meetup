import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Pagination from '../Pagination';
import Loading from '../Loading';
import Event from '../Event';
import * as eventActions from '../../store/event';

function Events() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const events = useSelector(eventActions.getEvents);

  useEffect(() => {
    const loadEvents = async () => {
      await dispatch(eventActions.loadEvents(page, 10));
      setIsLoaded(true);
    }
    loadEvents();
  }, [dispatch, page]);

  if (!isLoaded) return <Loading />;

  return <>
    <Pagination
      list={[...events.upcomingEvents, ...events.pastEvents]}
      page={page}
      setPage={setPage}
    />
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
  </>;
}

export default Events;
