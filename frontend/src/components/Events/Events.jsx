import { setPropertyOnDom } from '../../utils/dom';
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
  let events = useSelector(eventActions.getEvents);
  const currentPage = useSelector(eventActions.getEventPage);
  const currentSize = useSelector(eventActions.getEventSize);
  const [page, setPage] = useState(currentPage || 1);
  const [size, setSize] = useState(currentSize || 5);
  const [isLoaded, setIsLoaded] = useState(false);
  const upcomingEvents = sortAscFuture(Object.values(events));
  const pastEvents = sortDescPast(Object.values(events));
  events = [...upcomingEvents, ...pastEvents];

  const eventsNoOffset = useSelector(eventActions.getEventsNoOffset);
  const [input, setInput] = useState("");
  const [searchEvents, setSearchEvents] = useState(events);
  const setStyleForEventName = (shadowColor, textColor) => {
    setPropertyOnDom('#event-title', 'textShadow', `var(--${shadowColor}) 1px 0 10px`);
    setPropertyOnDom('#event-title', 'color', `var(--${textColor})`);
  }

  // See Events/Events.jsx for more information
  const handleSearch = e => {
    const substring = e.target.value;
    const results = eventsNoOffset.filter(event => event.name.includes(substring));
    setInput(substring);
    setStyleForEventName('white', 'black');
    setSearchEvents(results);
    if (substring.length) setStyleForEventName('teal', 'white');
  }

  useEffect(() => {
    const loadEvents = async () => {
      await dispatch(eventActions.loadEvents(page, size));
      setIsLoaded(true);

      document.querySelector(".page-prev")?.removeAttribute("disabled");
      document.querySelector(".page-next")?.removeAttribute("disabled");
      document.querySelector(".input-page")?.removeAttribute("disabled");
      document.querySelector(".input-size")?.removeAttribute("disabled");
      document.querySelector(".page-load")?.removeAttribute("disabled");
    }
    loadEvents();
  }, [dispatch, page, size]);

  if (!isLoaded) return <Loading />;

  return <>
    <div id="pagination">
      <div id="pagination-btns">
        <Pagination
          list={events}
          page={page}
          size={size}
          setPage={setPage}
          setSize={setSize}
          searchMode={input.length}
        />
        {events.length ? <input spellCheck="false" id="search-box" type="text" value={input} onChange={handleSearch} placeholder='Search box' /> : ''}
      </div>
    </div>
    <li>
      {(input.length ? searchEvents : events).map(event =>
        <div key={event.id} onClick={() => navigate(`/events/${event.id}`, { replace: true })}>
          <Event key={event.id} event={event} />
        </div>
      )}
    </li>
    <li>
    </li>
  </>;
}

export default Events;
