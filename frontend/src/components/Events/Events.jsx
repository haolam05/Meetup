import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Loading from '../Loading';
import Event from '../Event';
import * as eventActions from '../../store/event';
import Pagination from '../Pagination/Pagination';

function Events() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const events = useSelector(eventActions.getEvents);

  const handlePrevPageClick = () => {
    if (isLoaded && page > 1) {
      setPage(page - 1);
    }
  }

  const handleNextPageClick = () => {
    if (isLoaded && page > 0 && (events.upcomingEvents.length || events.pastEvents.length)) {
      setPage(page + 1);
    }
  }

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
      listsLength={events.upcomingEvents.length + events.pastEvents.length}
      handlePrevPageClick={handlePrevPageClick}
      handleNextPageClick={handleNextPageClick}
      page={page}
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
