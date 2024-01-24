import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortAscFuture, sortDescPast } from '../../utils/dateConverter';
import Pagination from '../Pagination';
import Loading from '../Loading';
import Event from '../Event';
import * as eventActions from '../../store/event';

function Events() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  let events = useSelector(eventActions.getEvents);
  const upcomingEvents = sortAscFuture(Object.values(events));
  const pastEvents = sortDescPast(Object.values(events));
  events = [...upcomingEvents, ...pastEvents];

  useEffect(() => {
    const loadEvents = async () => {
      await dispatch(eventActions.loadEvents(page, 10));
      setIsLoaded(true);

      document.querySelector(".page-prev")?.removeAttribute("disabled");
      document.querySelector(".page-next")?.removeAttribute("disabled");
    }
    loadEvents();
  }, [dispatch, page]);

  if (!isLoaded) return <Loading />;

  return <>
    <Pagination
      list={events}
      page={page}
      setPage={setPage}
    />
    <li>
      {events.map(event => (
        <div key={event.id} onClick={() => navigate(`/events/${event.id}`, { replace: true })}>
          <Event event={event} />
        </div>
      ))}
    </li>
  </>;
}

export default Events;
